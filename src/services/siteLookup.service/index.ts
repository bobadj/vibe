import axios from "axios";
import { isImage } from "../../utils";
import { SiteLookupResponseType } from "../../types/enum";
import { SiteLookupResponse, Meta, OgMeta } from "../../types/interface";

class SiteLookup {
  private getBaseURI(): string {
    return 'https://cors-anywhere.herokuapp.com/'
  }
  
  getMetadataAttribute(el: HTMLMetaElement, name: string): string|null {
    const prop = el.getAttribute('name') || el.getAttribute('property');
    return prop === name ? el.getAttribute('content') : null;
  }
  
  async fetchDocumentFromURI(URI: string): Promise<Document|null> {
    try {
      const config = {
        mode: 'no-cors',
        crossdomain: true,
        headers: {'Access-Control-Allow-Origin': '*'}
      };
      const { data } = await axios.get(this.getBaseURI()+URI, config);
      const domParser: DOMParser = new DOMParser();
      return domParser.parseFromString(data, 'text/html');
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  
  extractMetaFromDocument(document: Document): { og: OgMeta, metadata: Meta } {
    const elements: NodeListOf<HTMLMetaElement> = document.querySelectorAll('meta');
    
    const og: OgMeta = {}, metadata: Meta = {};
    
    for (let i = 0; i < elements.length; i++) {
      const el: HTMLMetaElement = elements[i];
      // build basic meta properties
      ['title', 'description', 'image'].forEach( (property: string)  => {
        const val = this.getMetadataAttribute(el, property);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (val) metadata[property] = val;
      });
      // build og properties
      ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:type'].forEach( (property: string) => {
        const val = this.getMetadataAttribute(el, property);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (val) og[property.split(':')[1]] = val; // replace og: from name
      });
    }
    
    return { og, metadata }
  }
  
  extractImagesFromDocument(document: Document) {
    return Array.from(document.querySelectorAll('img'))
      .map( (el: HTMLElement) => el.getAttribute('src'))
      .filter( (el: string|null) => el);
  }
  
  async lookup(url: string): Promise<SiteLookupResponse|null> {
    if (await isImage(url)) return { images: [url], type: SiteLookupResponseType.image };
    
    const document: Document|null = await this.fetchDocumentFromURI(url);
    if (!document) return null;
    const { og, metadata } = this.extractMetaFromDocument(document);
    const title = document.getElementsByTagName('title').item(0)?.textContent;
    const images = this.extractImagesFromDocument(document);
    
    return {
      title,
      og,
      metadata,
      images,
      type: SiteLookupResponseType.website
    };
  }
}

export const siteLookupService = new SiteLookup();