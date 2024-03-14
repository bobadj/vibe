import { JSX } from "react";

import coins from "./assets/coins.svg";
import share from "./assets/share.svg";

export default function PostAction(): JSX.Element {
  return (
    <div className="post-actions flex flex-row gap-6 items-center">
      <button className="flex flex-row items-center gap-2 cursor-pointer text-red text-xs">
        <img src={coins} alt="support post"/>
        6.2K
      </button>
      <span className="flex flex-row items-center gap-2 cursor-pointer text-gray-200 text-xs">
        <img src={share} alt="share post"/>
        60
      </span>
    </div>
  )
}
