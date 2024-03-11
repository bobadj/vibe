import { useMemo } from "react";
import { Contract } from "ethers";
import { contractAddresses } from "../utils/config";

// @todo: add signer or provider to contract
export default function useContract(ABI: any, chainId: number): Contract|null {
  return useMemo(() => {
    const address: string|undefined = contractAddresses[chainId];
    if (!address) return null;
    return new Contract(address, ABI);
  }, [ABI, chainId]);
}
