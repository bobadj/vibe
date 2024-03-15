import { JSX } from "react";
import { useEnsName } from "wagmi";
import { Avatar, Card } from "../../components";
import { PostStruct } from "../../context/AppContext";

import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostAction, { PostActionType } from "./PostAction";

interface PostProps {
  post: PostStruct,
  actionsDisabled?: boolean
  onAction: (id: number, action: PostActionType) => any
}

export default function Post({ post, actionsDisabled = false, onAction }: PostProps): JSX.Element {
  const { id, text, timestamp, owner } = post;
  const { data: ensName } = useEnsName({ address: owner as any });
  
  return (
    <Card className="border-[2px] rounded-[1rem] flex flex-row gap-3 w-auto">
      <Avatar address={owner} />
      <div className="flex flex-col gap-3">
        <PostHeader author={ensName || owner} timestamp={timestamp} />
        <PostContent content={text} />
        <PostAction disabled={actionsDisabled}
                    handleAction={(action) => onAction(id, action)} />
      </div>
    </Card>
  )
}

export type {
  PostActionType
}