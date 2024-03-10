import { JSX } from "react";
import { Avatar, Card } from "../../components";
import coins from "./assets/coins.svg";
import share from "./assets/share.svg";

export default function Post(): JSX.Element {
  return (
    <Card className="border-[2px] rounded-[1rem] flex flex-row gap-3">
      <Avatar />
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2 items-center font-bold text-black">
          <p className="text-black">0x03e75d7dd38cce2e20ffee35ec914c57780a8e29</p>
          ·
          <small>23s</small>
        </div>
        <div className="post-content text-black">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neque orci praesent facilisi risus etiam imperdiet fermentum. Sit neque, purus scelerisque sit eget risus ullamcorper suspendisse neque.</p>
        </div>
        <div className="post-actions flex flex-row gap-6 items-center">
          <span className="flex flex-row items-center gap-2 cursor-pointer text-red text-xs">
            <img src={coins} alt="support post" />
            6.2K
          </span>
          <span className="flex flex-row items-center gap-2 cursor-pointer text-gray-200 text-xs">
            <img src={share} alt="share post" />
            60
          </span>
        </div>
      </div>
    </Card>
  )
}