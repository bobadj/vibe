import { Context, createContext, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router, supportedChains } from "./utils";
import { useAccount } from "wagmi";
import { Chain } from "viem/chains";
import './index.css';

interface AppContextValue {}
const AppContext: Context<AppContextValue> = createContext({} as AppContextValue);

function App() {
  const { address, chainId } = useAccount();
  
  useEffect(() => {
    const isCurrentChainSupported = supportedChains
      .some( (chain: Chain) => chain.id === chainId );
    
    if (address && !isCurrentChainSupported) {
      console.error('You are on unsupported chain!');
    }
  }, [address, chainId]);
  
  return (
    <AppContext.Provider value={{}}>
      <RouterProvider router={router()} />
    </AppContext.Provider>
  )
}

export default App
