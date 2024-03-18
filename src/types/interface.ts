import { SiteLookupResponseType } from "./enum";

export interface SiteLookupResponse {
  title?: string|null
  og?: Meta
  metadata?: Meta
  images?: (string|null)[],
  type: SiteLookupResponseType
}

export interface Meta {
  title?: string
  description?: string
  image?: string
}

export interface OgMeta extends Meta {
  url?: string
  type?: string
  site_name?: string
}