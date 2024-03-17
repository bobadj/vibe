import { useMemo } from "react";
import { Chain } from "viem/chains";
import { useAccount, useChainId } from "wagmi";
import { supportedChains } from "../config";

export default function useIsCurrentChainSupported(): boolean|undefined {
  const defaultChainId: number = useChainId();
  const { chainId } = useAccount();
  
  return useMemo(() => {
    const currentChain: number = chainId || defaultChainId;
    const isCurrentChainSupported: boolean = supportedChains
      .some( (chain: Chain) => chain.id === currentChain );
    
    return isCurrentChainSupported;
  }, [chainId, defaultChainId]);
}
