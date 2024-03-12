import { useMemo } from 'react'
import { Config, useAccount, useClient } from 'wagmi'
import { clientToProvider } from "../utils";
import { providers, Signer } from "ethers";

/** Hook to convert a viem Client to an ethers.js Provider. */
/** source: https://wagmi.sh/react/guides/ethers */
export default function useEthersSignerOrProvider(chainId: number | undefined): providers.JsonRpcProvider|Signer|null {
  const { address, isConnected } = useAccount();
  const client = useClient<Config>({ chainId });

  return useMemo((): providers.JsonRpcProvider|Signer|null => {
    if (!client) return null;
    const provider: providers.JsonRpcProvider = clientToProvider(client);
    // @note: if wallet is connected return signer instead
    if (isConnected) {
      return provider.getSigner(address);
    }
    return provider;
  }, [address, client, isConnected]);
}
