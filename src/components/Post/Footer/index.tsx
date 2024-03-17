import {JSX} from "react";

import { PostActionType } from "../../../types/enum";

import coins from "./assets/coins.svg";
import share from "./assets/share.svg";

interface FooterProps {
  handleAction?: (action: PostActionType) => any
  disabled?: boolean
}

export default function Footer({ handleAction, disabled = false }: FooterProps): JSX.Element {
  
  const handleClick = (action: PostActionType) => {
    if (!disabled && handleAction) handleAction(action);
  }
  
  return (
    <div className={`post-actions flex flex-row gap-6 items-center ${disabled ? 'opacity-50' : 'opacity-100'}`}>
      <button className={`flex flex-row items-center gap-2 text-red text-xs ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={disabled}
              onClick={() => handleClick(PostActionType.sponsor)}>
        <img src={coins} alt="support post"/>
        6.2K
      </button>
      <button className={`flex flex-row items-center gap-2 text-red text-xs ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={disabled}
              onClick={() => handleClick(PostActionType.share)}>
        <img src={share} alt="share post"/>
        60
      </button>
    </div>
  )
}
