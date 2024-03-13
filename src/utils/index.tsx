import axios from "axios";
import { providers } from "ethers";
import type { Chain, Client, Transport } from "viem";

export type CallbackFunction = (...args: any) => any;

export const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000';

const readMetaTag = (el: HTMLMetaElement, name: string): string|null => {
  const prop = el.getAttribute('name') || el.getAttribute('property');
  return prop === name ? el.getAttribute('content') : null;
};

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

export async function isImage(url: string): Promise<boolean> {
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

interface SiteLookupResponse {
  title?: string|null
  og?: Meta
  meta?: Meta
  images?: (string|null)[]
}

interface Meta {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  site_name?: string
}

export async function siteLookup(url: string): Promise<SiteLookupResponse> {
  if (!/(^http(s?):\/\/[^\s$.?#].[^\s]*)/i.test(url)) return {};
  // if is an image on other side, just return it
  if (await isImage(url)) return { images: [url] };

  const config = {
    mode: 'no-cors',
    crossdomain: true,
    headers: {'Access-Control-Allow-Origin': '*'}
  };
  const og: Meta = {}, meta: Meta = {};
  const { data } = await axios.get('https://cors-anywhere.herokuapp.com/'+url, config);
  const domParser: DOMParser = new DOMParser();
  const document: Document = domParser.parseFromString(data, 'text/html');
  const metas: NodeListOf<HTMLMetaElement> = document.querySelectorAll('meta');
  const title = document.getElementsByTagName('title').item(0)?.textContent;

  for (let i = 0; i < metas.length; i++) {
    const el: HTMLMetaElement = metas[i];
    // build basic meta properties
    ['title', 'description', 'image'].forEach( (property: string)  => {
      const val = readMetaTag(el, property);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (val) meta[property] = val;
    });
    // build og properties
    ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:type'].forEach( (property: string) => {
      const val = readMetaTag(el, property);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (val) og[property.split(':')[1]] = val; // replace og: from name
    });
  }

  const images = Array.from(document.querySelectorAll('img'))
      .map( (el: HTMLElement) => {
        let src: string|null = el.getAttribute('src');
        if (src) {
          src = new URL(src, url).href;
          return src;
        }
        return null
      })
      .filter( (el: string|null) => el !== null);

  return {
    title,
    og,
    meta,
    images
  };
}
