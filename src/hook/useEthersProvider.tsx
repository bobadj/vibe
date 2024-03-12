import { useMemo } from 'react'
import { Config, useClient } from 'wagmi'
import { clientToProvider } from "../utils";

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider(chainId: number | undefined) {
  const client = useClient<Config>({ chainId });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return useMemo(() => clientToProvider(client), [client]);
}
