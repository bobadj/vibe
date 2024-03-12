import { useMemo } from "react";
import { contractAddresses } from "../utils/config";
import { useEthersProvider } from "./useEthersProvider";
import { VibeAbi, VibeAbi__factory } from "../../abis/types";

// https://wagmi.sh/react/guides/ethers
export default function useContract(chainId: number): VibeAbi|null {
  const provider = useEthersProvider(chainId);
  
  return useMemo(() => {
    const address: string|undefined = contractAddresses[chainId];
    if (!address) return null;
    return VibeAbi__factory.connect(address, provider);
  }, [chainId, provider]);
}
