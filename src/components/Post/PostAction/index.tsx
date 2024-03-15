import { JSX } from "react";

import type { PostActionType } from "../../../utils/types";

import coins from "./assets/coins.svg";
import share from "./assets/share.svg";

interface PostActionProps {
  handleAction: (action: PostActionType) => any
  disabled?: boolean
}

export default function PostAction({ handleAction, disabled = false }: PostActionProps): JSX.Element {

  const handleClick = (action: PostActionType) => {
    if (!disabled) handleAction(action);
  }

  return (
    <div className={`post-actions flex flex-row gap-6 items-center ${disabled ? 'opacity-50' : 'opacity-100'}`}>
      <button className={`flex flex-row items-center gap-2 text-red text-xs ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={disabled}
              onClick={() => handleClick('sponsor')}>
        <img src={coins} alt="support post"/>
        6.2K
      </button>
      <button className={`flex flex-row items-center gap-2 text-red text-xs ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={disabled}
              onClick={() => handleClick('share')}>
        <img src={share} alt="share post"/>
        60
      </button>
    </div>
  )
}
