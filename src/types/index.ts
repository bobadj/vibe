import type { ISocialNetwork } from "../../abis/types/VibeAbi.ts";

export type OutletContextType = {
  showPostForm: boolean,
  setShowPostForm: (show: boolean) => void
}

export type PostStruct = ISocialNetwork.PostStruct & {
  id: number
}

export type CallbackFunction = (...args: any) => any;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
