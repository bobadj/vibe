import type { Chain, Client, Transport } from "viem";
import { providers } from "ethers";

export type CallbackFunction = (...args: never[]) => void;

export const debounce = (callback: CallbackFunction, wait: number = 300) => {
  let timeoutId: any;
  return (...args: never[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

export const formatAddress = (account: string|null|undefined) => {
  const acc = account || '';
  return acc.substring(0, 6) + '...' + acc.substring(acc.length - 4)
};

export function clientToProvider(client: Client<Transport, Chain>): providers.JsonRpcProvider {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  return new providers.JsonRpcProvider(transport.url, network);
}
