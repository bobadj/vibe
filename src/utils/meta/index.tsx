import axios from "axios";
import { isImage, isValidURL } from "../../utils";

export const readMetaTag = (el: HTMLMetaElement, name: string): string|null => {
  const prop = el.getAttribute('name') || el.getAttribute('property');
  return prop === name ? el.getAttribute('content') : null;
};

export interface SiteLookupResponse {
  title?: string|null
  og?: Meta
  metadata?: Meta
  images?: (string|null)[]
}

export interface Meta {
  title?: string
  description?: string
  image?: string
}

export interface OgMeta extends Meta{
  url?: string
  type?: string
  site_name?: string
}

export const fetchDocumentFromURI = async (uri: string): Promise<Document> => {
  const config = {
    mode: 'no-cors',
    crossdomain: true,
    headers: {'Access-Control-Allow-Origin': '*'}
  };
  const { data } = await axios.get('https://cors-anywhere.herokuapp.com/'+uri, config);
  const domParser: DOMParser = new DOMParser();
  return domParser.parseFromString(data, 'text/html');
}

export const extractMetaFromDocument = (document: Document): { og: OgMeta, metadata: Meta } => {
  const elements: NodeListOf<HTMLMetaElement> = document.querySelectorAll('meta');
  
  const og: OgMeta = {}, metadata: Meta = {};
  
  for (let i = 0; i < elements.length; i++) {
    const el: HTMLMetaElement = elements[i];
    // build basic meta properties
    ['title', 'description', 'image'].forEach( (property: string)  => {
      const val = readMetaTag(el, property);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (val) metadata[property] = val;
    });
    // build og properties
    ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:type'].forEach( (property: string) => {
      const val = readMetaTag(el, property);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (val) og[property.split(':')[1]] = val; // replace og: from name
    });
  }
  
  return { og, metadata }
}

export const extractImagesFromDocument = (document: Document) => {
  return Array.from(document.querySelectorAll('img'))
    .map( (el: HTMLElement) => el.getAttribute('src'))
    .filter( (el: string|null) => el);
}

export async function siteLookup(url: string): Promise<SiteLookupResponse> {
  if (!isValidURL(url)) return {};
  // if is an image on other side, just return it
  if (await isImage(url)) return { images: [url] };
  
  const document: Document = await fetchDocumentFromURI(url);
  const { og, metadata } = extractMetaFromDocument(document);
  const title = document.getElementsByTagName('title').item(0)?.textContent;
  const images = extractImagesFromDocument(document);
  
  return {
    title,
    og,
    metadata,
    images
  };
}