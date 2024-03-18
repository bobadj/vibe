import { providers } from "ethers";
import { wagmiConfig } from "../config";
import { getConnectorClient } from '@wagmi/core'

import type { CallbackFunction } from "../types";
import type { Account, Chain, Client, Transport } from "viem";

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

export const clientToProvider = (client: Client<Transport, Chain>): providers.JsonRpcProvider => {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  return new providers.JsonRpcProvider(transport.url, network);
}

export const clientToSigner = (client: Client<Transport, Chain, Account>) => {
    const { account, chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new providers.Web3Provider(transport, network)
    return provider.getSigner(account.address);
}

export const getEthersSigner = async () => {
    const client = await getConnectorClient(wagmiConfig)
    return clientToSigner(client)
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

export const isImage = async (url: string): Promise<boolean> => {
  const isImage = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  if (!isImage) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve) => {
      img.onerror = () => resolve(false);
      img.onload = () => resolve(true);
    });
  }
  return isImage;
}

export const isValidURL = (url: string) => /(^http(s?):\/\/[^\s$.?#].[^\s]*)/i.test(url);
