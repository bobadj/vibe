import { Contract } from "ethers";
import { Context, createContext, JSX, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { useContract } from "../../hook";
import ABI from './../../../abis/Vibe.abi.json';

interface AppContextValue {}

export const AppContext: Context<AppContextValue> = createContext({} as AppContextValue);

interface AppProviderProps {
  children: JSX.Element|JSX.Element[]
}

export default function AppProvider({ children }: AppProviderProps): JSX.Element {
  const defaultChainId: number = useChainId();
  const { chainId } = useAccount();
  const contract: Contract|null = useContract(ABI, chainId || defaultChainId);
  
  const fetchLastPostId = async () => {
    if (contract) {
      const t = await contract.getLatestPostID();
      console.log(t)
    }
  }

  useEffect(() => {
    console.log('ALO')
    fetchLastPostId();
  }, []);
  
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  )
}
