import { BigNumber, ethers } from "ethers";
import { useVibeContract } from "../../hook";
import { VibeAbi } from "../../../abis/types";
import { useAccount, useChainId } from "wagmi";
import { getEthersSigner, ZERO_ADDRESS } from '../../utils';
import { Context, createContext, JSX, useState } from "react";
import { ISocialNetwork, PostSponsoredEvent } from "../../../abis/types/VibeAbi.ts";

interface AppContextValue {
  posts: ISocialNetwork.PostStruct[],
  isLoading: boolean,
  fetchPosts: (limit?: number) => Promise<void>
  estimateFeeForNewPost: (value: string) => Promise<string>
  submitPost: (content: string) => Promise<void>
  getSponsoredPostsForAddress: (address: string) => Promise<PostSponsoredEvent[]|undefined>
}

export const AppContext: Context<AppContextValue> = createContext({} as AppContextValue);

interface AppProviderProps {
  children: JSX.Element|JSX.Element[]
}

export default function AppProvider({ children }: AppProviderProps): JSX.Element {
  const defaultChainId: number = useChainId();
  const { chainId } = useAccount();
  const contract: VibeAbi|null = useVibeContract(chainId || defaultChainId);
  
  const [ posts, setPosts ] = useState<ISocialNetwork.PostStruct[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  
  const fetchLastPostId = async (): Promise<number> => {
    let lastPostId = 0;
    if (contract) {
      const fetchedLastPostId: BigNumber = await contract.getLatestPostID();
      lastPostId = fetchedLastPostId.toNumber();
    }
    return lastPostId;
  };
  
  const fetchPosts = async (loadLimit: number = 5) => {
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
        setPosts([...posts, ...Array.from(fetchedPosts).reverse()]);
        // lets delay loading a bit
        setTimeout(() => setIsLoading(false), 50);
      }
    }
  }

  const getValidPosts = () => posts.filter( (post) => post?.owner !== ZERO_ADDRESS ); // check for deleted posts

  const estimateFeeForNewPost = async (value: string): Promise<string> => {
    const estimatedFee = await contract?.estimateGas?.createPost(value);
    if (estimatedFee) {
      return ethers.utils.formatUnits(estimatedFee, 'ether');
    }
    return '0';
  }

  const submitPost = async (content: string): Promise<void> => {
    const signer = await getEthersSigner();
    const connectedContract = contract?.connect(signer);
    const transaction = await connectedContract?.createPost(content);
    if (transaction) {
      await transaction.wait(1);
      const latestPostId = await fetchLastPostId();
      const post = await contract?.getPost(latestPostId);
      if (post) setPosts([post, ...posts]);
    }
  }

  const getSponsoredPostsForAddress = async (address: string): Promise<PostSponsoredEvent[]|undefined> => {
    return await contract?.queryFilter(
        contract?.filters.PostSponsored(null, null, address)
    )
  }

  const contextValue: AppContextValue = {
    posts: getValidPosts(),
    isLoading,
    fetchPosts,
    estimateFeeForNewPost,
    submitPost,
    getSponsoredPostsForAddress
  }
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
