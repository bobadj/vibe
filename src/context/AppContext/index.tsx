import { BigNumber } from "ethers";
import { useVibeContract } from "../../hook";
import { VibeAbi } from "../../../abis/types";
import { useAccount, useChainId } from "wagmi";
import { ZERO_ADDRESS } from './../../utils';
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
    fetchPosts()
  }, [contract]);
  
  const fetchLastPostId = async (): Promise<number> => {
    let lastPostId = 0;
    if (contract) {
      const fetchedLastPostId: BigNumber = await contract.getLatestPostID();
      lastPostId = fetchedLastPostId.toNumber();
    }
    return lastPostId;
  };
  
  const fetchPosts = async () => {
    setIsLoading(true);
    if (contract) {
      const lastPostId: number = await fetchLastPostId();
      const loadLimit = 5;
      
      const fetchedPosts = await contract.fetchPostsRanged(lastPostId - loadLimit, loadLimit);
      setPosts(
        Array.from(fetchedPosts)
          // reverse order
          .reverse()
          // check for deleted posts
          .filter( (post) => post?.owner !== ZERO_ADDRESS )
      );
    }
    // lets delay loading a bit
    setTimeout(() => setIsLoading(false), 50);
  }
  
  return (
    <AppContext.Provider value={{ posts, isLoading }}>
      {children}
    </AppContext.Provider>
  )
}
