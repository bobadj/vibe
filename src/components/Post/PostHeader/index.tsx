import {JSX} from "react";
import { formatTime } from "../../../utils";
import { BigNumber, BigNumberish } from "ethers";

interface PostHeaderProps {
  author: string,
  timestamp: BigNumber|BigNumberish|string
}

export default function PostHeader({ author, timestamp }: PostHeaderProps): JSX.Element {
  return (
    <div className="flex flex-row gap-2 items-center font-bold text-black">
      <p className="text-black w-auto truncate">{author}</p>
      ·
      <small>{formatTime(BigNumber.from(timestamp).toNumber())}</small>
    </div>
  )
}