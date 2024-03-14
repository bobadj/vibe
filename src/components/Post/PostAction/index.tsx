import { JSX } from "react";

import coins from "./assets/coins.svg";
import share from "./assets/share.svg";

interface PostActionProps {
  handleAction: (action: "sponsor"|"share") => any
}

export default function PostAction({ handleAction }: PostActionProps): JSX.Element {
  return (
    <div className="post-actions flex flex-row gap-6 items-center">
      <button className="flex flex-row items-center gap-2 cursor-pointer text-red text-xs"
              onClick={() => handleAction('sponsor')}>
        <img src={coins} alt="support post"/>
        6.2K
      </button>
      <button className="flex flex-row items-center gap-2 cursor-pointer text-gray-200 text-xs"
              onClick={() => handleAction('share')}>
        <img src={share} alt="share post"/>
        60
      </button>
    </div>
  )
}
