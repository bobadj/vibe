import { ISocialNetwork } from "../../../abis/types/VibeAbi.ts";

export type OutletContextType = {
  showPostForm: boolean,
  setShowPostForm: (show: boolean) => void
}

export type PostActionType = "sponsor"|"share";

export type PostStruct = ISocialNetwork.PostStruct & {
  id: number
}

export type CallbackFunction = (...args: any) => any;
