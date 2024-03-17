import { useVibeContract } from "../../hooks";
import { VibeAbi } from "../../../abis/types";
import { useAccount, useChainId } from "wagmi";
import { getEthersSigner } from '../../utils';
import { BigNumber, ethers, PayableOverrides } from "ethers";
import { Context, createContext, JSX, useEffect, useState } from "react";
import {
  ISocialNetwork,
  PostCreatedEvent,
  PostDeletedEvent,
  PostSponsoredEvent
} from "../../../abis/types/VibeAbi.ts";

import { PostStruct, ZERO_ADDRESS } from "../../types";

interface AppContextValue {
  posts: PostStruct[]
  sponsoredPosts: number[]
  isLoading: boolean
  clearPosts: () => void
  fetchPosts: (limit?: number) => Promise<void>
  estimateFeeForNewPost: (value: string) => Promise<string|number>
  estimateSponsorshipFee: (post: PostStruct, donationAmount: number) => Promise<string|number>
  submitPost: (content: string) => Promise<void>
  sponsorPost: (post: PostStruct, donationAmount: number) => Promise<void>
  searchPostsByAuthor: (author: string) => Promise<void>
}

export const AppContext: Context<AppContextValue> = createContext({} as AppContextValue);

interface AppProviderProps {
  children: JSX.Element|JSX.Element[]
}

export default function AppProvider({ children }: AppProviderProps): JSX.Element {
  const defaultChainId: number = useChainId();
  const { chainId, address } = useAccount();
  const contract: VibeAbi|null = useVibeContract(chainId || defaultChainId);
  
  const [ posts, setPosts ] = useState<PostStruct[]>([]);
  const [ sponsoredPosts, setSponsoredPosts ] = useState<Array<number>>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  useEffect(() => {
    getSponsoredPostsForAddress((address || '') as string);
  }, [address])
  
  const fetchLastPostId = async (): Promise<number> => {
    let lastPostId = 0;
    if (contract) {
      const fetchedLastPostId: BigNumber = await contract.getLatestPostID();
      lastPostId = fetchedLastPostId.toNumber();
    }
    return lastPostId;
  };

  const clearPosts = () => setPosts([]);
  
  const fetchPosts = async (loadLimit: number = 5): Promise<void> => {
    if (contract && !isLoading) {
      const latestPostId: number = await fetchLastPostId() + 1;
      let loadStartAt: number = (latestPostId - posts.length) - loadLimit;
      if (loadStartAt < 0) {
        loadLimit = +latestPostId - posts.length;
        loadStartAt = 0;
      }

      if (posts.length < +latestPostId) {
        setIsLoading(true);
        const fetchedPosts = await contract.fetchPostsRanged(loadStartAt, loadLimit);
        const modifiedPosts: PostStruct[] = Array.from(fetchedPosts)
          .reverse()
          .map((post: ISocialNetwork.PostStruct, i: number) => (
            {...post, id: (loadStartAt + loadLimit) - (i+1) }
          ));
        
        setPosts([...posts, ...modifiedPosts]);
        // lets delay loading a bit
        setTimeout(() => setIsLoading(false), 50);
      }
    }
  };

  const getValidPosts = (): PostStruct[] => posts.filter( (post) => post?.owner !== ZERO_ADDRESS ); // check for deleted posts

  const estimateFeeForNewPost = async (value: string): Promise<string|number> => {
    const estimatedFee = await contract?.estimateGas?.createPost(value);
    if (estimatedFee) {
      return ethers.utils.formatUnits(estimatedFee, 'ether');
    }
    return 0;
  };

  const submitPost = async (content: string): Promise<void> => {
    const signer = await getEthersSigner();
    const connectedContract = contract?.connect(signer);
    const transaction = await connectedContract?.createPost(content);
    if (transaction) {
      await transaction.wait(1);
      const latestPostId = await fetchLastPostId();
      const post = await contract?.getPost(latestPostId);
      if (post) setPosts([{...post, id: latestPostId}, ...posts]);
    }
  };

  const estimateSponsorshipFee = async (post: PostStruct, donationAmount: number): Promise<string|number> => {
    const donationAmountInEther = ethers.utils.parseEther(String(donationAmount));
    const overrideOptions: PayableOverrides = {
      value: donationAmountInEther
    };
    const estimatedFee = await contract?.estimateGas.sponsorPost(post.id, overrideOptions);
    if (estimatedFee) {
      return ethers.utils.formatUnits(estimatedFee, 'ether');
    }
    return 0;
  };

  const sponsorPost = async (post: PostStruct, donationAmount: number): Promise<void> => {
    const signer = await getEthersSigner();
    const connectedContract = contract?.connect(signer);
    const donationAmountInEther = ethers.utils.parseEther(String(donationAmount));
    const overrideOptions: PayableOverrides = {
      value: donationAmountInEther
    };
    const transaction = await connectedContract?.sponsorPost(post.id, overrideOptions);
    if (transaction) {
      await transaction.wait(1);
      const signerAddress = await signer.getAddress();
      await getSponsoredPostsForAddress(signerAddress);
    }
  };

  const getSponsoredPostsForAddress = async (address: string): Promise<void> => {
    let events: PostSponsoredEvent[] = [];
    if (address) {
      events = await contract?.queryFilter(
        contract?.filters.PostSponsored(null, null, address)
      ) || [];
    }
    const postIds: Array<number> = events?.map( (ev: PostSponsoredEvent) => BigNumber.from(ev.args[0] || '0').toNumber());
    setSponsoredPosts(postIds);
  };

  const searchPostsByAuthor = async (author: string): Promise<void> => {
    clearPosts();
    if (author.length > 0) {
      setIsLoading(true);

      const events: PostCreatedEvent[] = await contract?.queryFilter(
        contract?.filters.PostCreated()
      ) || [];
      
      const deleteEvents: PostDeletedEvent[] = await contract?.queryFilter(
        contract?.filters.PostDeleted()
      ) || [];
      const deletedPostIds: number[] = deleteEvents.map( (ev: PostDeletedEvent) => ev?.args?.postID.toNumber() );
      
      let authorPosts: PostStruct[] = await Promise.all(
        events
          .filter( (ev: PostCreatedEvent) => ev.args.owner === author )
          .sort((x: PostCreatedEvent, y: PostCreatedEvent) => y.args.postID.toNumber() - x.args.postID.toNumber() )
          .map( async (ev: PostCreatedEvent) => {
            const txBlock = await ev.getBlock();
            return {
              id: ev?.args.postID.toNumber(),
              text: ev?.args.text,
              owner: ev?.args.owner,
              timestamp: txBlock.timestamp
            }
          })
      );
      authorPosts = authorPosts.filter( (post) => deletedPostIds.indexOf(post.id) < 0 );

      setPosts(authorPosts);
      // lets delay loading a bit
      setTimeout(() => setIsLoading(false), 50);
    }
  };

  const contextValue: AppContextValue = {
    posts: getValidPosts(),
    sponsoredPosts,
    isLoading,
    fetchPosts,
    estimateFeeForNewPost,
    estimateSponsorshipFee,
    submitPost,
    sponsorPost,
    searchPostsByAuthor,
    clearPosts
  }
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
