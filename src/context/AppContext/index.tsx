import { BigNumber } from "ethers";
import { ZERO_ADDRESS } from '../../utils';
import { useVibeContract } from "../../hook";
import { VibeAbi } from "../../../abis/types";
import { useAccount, useChainId } from "wagmi";
import { ISocialNetwork } from "../../../abis/types/VibeAbi.ts";
import { Context, createContext, JSX, useEffect, useState } from "react";

interface AppContextValue {
  posts: ISocialNetwork.PostStruct[],
  isLoading: boolean
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
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchLastPostId = async (): Promise<number> => {
    let lastPostId = 0;
    if (contract) {
      const fetchedLastPostId: BigNumber = await contract.getLatestPostID();
      lastPostId = fetchedLastPostId.toNumber();
    }
    return lastPostId;
  };
  
  const fetchPosts = async (cleanup: boolean = true) => {
    if (contract) {
      const latestPostId: number = await fetchLastPostId();
      const loadLimit = 5;
      let loadStartAt = (latestPostId - (cleanup ? 0 : posts.length)) - loadLimit;
      if (loadStartAt < 0) loadStartAt = 0;

      if (posts.length < +latestPostId) {
        setIsLoading(true);
        let fetchedPosts = await contract.fetchPostsRanged(loadStartAt, loadLimit);
        fetchedPosts = Array.from(fetchedPosts)
          .reverse() // reverse order
          .filter( (post) => post?.owner !== ZERO_ADDRESS ); // check for deleted posts
        setPosts((prevState) =>
          cleanup ? fetchedPosts : [...prevState, ...fetchedPosts]
        );
        // lets delay loading a bit
        setTimeout(() => setIsLoading(false), 50);
      }
    }
  }
  
  return (
    <AppContext.Provider value={{ posts, isLoading }}>
      {children}
    </AppContext.Provider>
  )
}
