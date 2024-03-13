import type { Chain, Client, Transport } from "viem";
import { providers } from "ethers";

export type CallbackFunction = (...args: any) => any;

export const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000';

export const debounce = (callback: CallbackFunction, wait: number = 300) => {
  let timeoutId: any;
  return (...args: any[]) => {
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

export const formatTime = (timestamp: number, useFullFormat: boolean = true) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date((timestamp * 1000)) as any;
  const seconds = Math.floor((new Date() as any - date) / 1000);
  
  if (seconds > 86400) {
    if (!useFullFormat) return `${monthNames[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`
  }
  if (seconds > 3600) return Math.floor(seconds/3600) + "h";
  if (seconds > 60) return Math.floor(seconds/60) + "m";
  return Math.floor(seconds) + "s";
}
