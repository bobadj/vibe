import { useMemo } from "react";
import { Contract } from "ethers";
import { contractAddresses } from "../utils/config";
import { useEthersProvider } from "./useEthersProvider";

// https://wagmi.sh/react/guides/ethers
export default function useContract(ABI: any, chainId: number): Contract|null {
  const provider = useEthersProvider({ chainId })
  
  return useMemo(() => {
    const address: string|undefined = contractAddresses[chainId];
    if (!address) return null;
    return new Contract(address, ABI, provider);
  }, [ABI, chainId, provider]);
}
