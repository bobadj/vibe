import { JSX, useState } from "react";
import { useAppContext } from "../../hooks";
import { useAccount, useEnsName } from "wagmi";
import { Avatar, Card, Modal } from "../../components";
import DonationForm from "../DonationForm";

import type { PostActionType, PostStruct } from "../../utils/types";

import Header from "./Header";
import Footer from "./Footer";
import Content from "./Content";

interface PostProps {
  post: PostStruct,
}

export default function Post({ post }: PostProps): JSX.Element {
  const { id, text, timestamp, owner } = post;
  
  const { sponsoredPosts } = useAppContext();
  const { isConnected, address } = useAccount();
  const { data: ensName } = useEnsName({ address: owner as any });
  
  const [ sponsorModalVisible, setSponsorModalVisible ] = useState<boolean>(false);
  
  const handleAction = (action: PostActionType) => {
    if (action === "sponsor") setSponsorModalVisible(true);
  }
  
  const canSponsorPost = (): boolean => owner !== address && sponsoredPosts.indexOf(id) < 0;
  
  return (
    <>
      <Card className="border-[2px] rounded-[1rem] flex flex-row gap-3 w-auto">
        <Avatar address={owner} />
        <div className="flex flex-col gap-3">
          <Header author={ensName || owner} timestamp={timestamp} />
          <Content content={text} />
          <Footer handleAction={handleAction} disabled={!isConnected || !canSponsorPost()} />
        </div>
      </Card>
      {isConnected && (
        <Modal open={sponsorModalVisible} onClose={() => setSponsorModalVisible(false)}>
          <DonationForm post={post} onSubmit={() => setSponsorModalVisible(false)} />
        </Modal>
      )}
    </>
  )
}