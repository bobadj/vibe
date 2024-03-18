import { FC, JSX } from "react";
import { formatTime } from "../../../utils";
import { BigNumber, BigNumberish } from "ethers";

interface HeaderProps {
  author: string,
  timestamp: BigNumber|BigNumberish|string
}

const Header: FC<HeaderProps> = ({ author, timestamp }): JSX.Element => {
  return (
    <div className="flex flex-row gap-2 items-center font-bold text-black">
      <p className="text-black w-auto truncate">{author}</p>
      ·
      <small>{formatTime(BigNumber.from(timestamp).toNumber())}</small>
    </div>
  )
}

export default Header;