import { JSX, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { useEnsName } from "wagmi";
import { formatTime } from "../../utils";
import { Avatar, Card } from "../../components";
import { ISocialNetwork } from "../../../abis/types/VibeAbi.ts";

import coins from "./assets/coins.svg";
import share from "./assets/share.svg";

interface PostProps {
  post: ISocialNetwork.PostStruct
}

export default function Post({ post }: PostProps): JSX.Element {
  const { text, timestamp, owner } = post;
  const { data: ensName } = useEnsName({ address: owner as any });
  const [ previewSource, setPreviewSource ] = useState<string|undefined>()
  
  useEffect(() => {
    const URIs = (text || '').match(/(https?:\/\/[^ ]*)/g);
    if (URIs && (URIs || []).length > 0) {
      setPreviewSource(URIs[0]);
    }
  }, [text]);
  
  return (
    <Card className="border-[2px] rounded-[1rem] flex flex-row gap-3 w-auto">
      <Avatar address={owner} />
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-2 items-center font-bold text-black">
          <p className="text-black w-auto truncate">{ensName || owner}</p>
          ·
          <small>{formatTime(BigNumber.from(timestamp).toNumber())}</small>
        </div>
        <div className="post-content text-black">
          {
            previewSource ? text.replace(previewSource, '') : text
          }
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