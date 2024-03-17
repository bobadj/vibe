import { useMemo } from "react";
import { Config, useClient } from "wagmi";
import { clientToProvider } from "../utils";
import { contractAddresses } from "../config";
import { VibeAbi, VibeAbi__factory } from "../../abis/types";

export default function useVibeContract(chainId: number): VibeAbi|null {
  const client = useClient<Config>({ chainId });

  return useMemo(() => {
    if (!client) return null;
    const provider = clientToProvider(client);
    const address: string|undefined = contractAddresses[chainId];
    if (!address || !provider) return null;
    return VibeAbi__factory.connect(address, provider);
  }, [chainId, client]);
}
