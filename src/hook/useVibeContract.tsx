import { useMemo } from "react";
import { contractAddresses } from "../utils/config";
import { useEthersSignerOrProvider } from "./useEthersSignerOrProvider";
import { VibeAbi, VibeAbi__factory } from "../../abis/types";

export default function useVibeContract(chainId: number): VibeAbi|null {
  const signerOrProvider = useEthersSignerOrProvider(chainId);
  
  return useMemo(() => {
    const address: string|undefined = contractAddresses[chainId];
    if (!address || !signerOrProvider) return null;
    return VibeAbi__factory.connect(address, signerOrProvider);
  }, [chainId, signerOrProvider]);
}
