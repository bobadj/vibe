import { useVibeContract } from "../../hook";
import { VibeAbi } from "../../../abis/types";
import { useAccount, useChainId } from "wagmi";
import { getEthersSigner, ZERO_ADDRESS } from '../../utils';
import { BigNumber, ethers, PayableOverrides } from "ethers";
import { Context, createContext, JSX, useEffect, useState } from "react";
import { ISocialNetwork, PostSponsoredEvent } from "../../../abis/types/VibeAbi.ts";

interface AppContextValue {
  posts: PostStruct[]
  sponsoredPosts: number[]
  isLoading: boolean
  fetchPosts: (limit?: number) => Promise<void>
  estimateFeeForNewPost: (value: string) => Promise<string|number>
  estimateSponsorshipFee: (postId: number, donationAmount: number) => Promise<string|number>
  submitPost: (content: string) => Promise<void>
  sponsorPost: (postId: number, donationAmount: number) => Promise<void>
}

export interface PostStruct extends ISocialNetwork.PostStruct {
  id: number
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
  }

  const getValidPosts = () => posts.filter( (post) => post?.owner !== ZERO_ADDRESS ); // check for deleted posts

  const estimateFeeForNewPost = async (value: string): Promise<string|number> => {
    const estimatedFee = await contract?.estimateGas?.createPost(value);
    if (estimatedFee) {
      return ethers.utils.formatUnits(estimatedFee, 'ether');
    }
    return 0;
  }

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
  }

  const estimateSponsorshipFee = async (postId: number, donationAmount: number): Promise<string|number> => {
    const donationAmountInEther = ethers.utils.parseEther(String(donationAmount));
    const overrideOptions: PayableOverrides = {
      value: donationAmountInEther
    };
    const estimatedFee = await contract?.estimateGas.sponsorPost(postId, overrideOptions);
    if (estimatedFee) {
      return ethers.utils.formatUnits(estimatedFee, 'ether');
    }
    return 0;
  }

  const sponsorPost = async (postId: number, donationAmount: number): Promise<void> => {
    const signer = await getEthersSigner();
    const connectedContract = contract?.connect(signer);
    const donationAmountInEther = ethers.utils.parseEther(String(donationAmount));
    const overrideOptions: PayableOverrides = {
      value: donationAmountInEther
    };
    const transaction = await connectedContract?.sponsorPost(postId, overrideOptions);
    if (transaction) {
      await transaction.wait(1);
      const signerAddress = await signer.getAddress();
      await getSponsoredPostsForAddress(signerAddress);
    }
  }

  const getSponsoredPostsForAddress = async (address: string): Promise<void> => {
    let events: PostSponsoredEvent[] = [];
    if (address) {
      events = await contract?.queryFilter(
        contract?.filters.PostSponsored(null, null, address)
      ) || [];
    }
    const postIds: Array<number> = events?.map( (ev: PostSponsoredEvent) => BigNumber.from(ev.args[0] || '0').toNumber());
    setSponsoredPosts(postIds);
  }

  const contextValue: AppContextValue = {
    posts: getValidPosts(),
    sponsoredPosts,
    isLoading,
    fetchPosts,
    estimateFeeForNewPost,
    estimateSponsorshipFee,
    submitPost,
    sponsorPost
  }
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
