import { JSX } from "react";
import { useEnsName } from "wagmi";
import { Avatar, Card } from "../../components";
import { ISocialNetwork } from "../../../abis/types/VibeAbi.ts";

import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostAction from "./PostAction";

interface PostProps {
  post: ISocialNetwork.PostStruct
}

export default function Post({ post }: PostProps): JSX.Element {
  const { text, timestamp, owner } = post;
  const { data: ensName } = useEnsName({ address: owner as any });
  
  return (
    <Card className="border-[2px] rounded-[1rem] flex flex-row gap-3 w-auto">
      <Avatar address={owner} />
      <div className="flex flex-col gap-3">
        <PostHeader author={ensName || owner} timestamp={timestamp} />
        <PostContent content={text} />
        <PostAction />
      </div>
    </Card>
  )
}