import { FC, JSX, useState } from "react";
import { useAppContext } from "../../hooks";
import { useAccount, useEnsName } from "wagmi";

import Avatar from "../Avatar";
import Card from "../Card";
import Modal from "../Modal";
import DonationForm from "../DonationForm";

import { PostStruct } from "../../types";
import { PostActionType } from "../../types/enum";

import Header from "./Header";
import Footer from "./Footer";
import Content from "./Content";

interface PostProps {
  post: PostStruct,
}

const Post: FC<PostProps> = ({ post }): JSX.Element => {
  const { id, text, timestamp, owner } = post;
  
  const { sponsoredPosts } = useAppContext();
  const { isConnected, address } = useAccount();
  const { data: ensName } = useEnsName({ address: owner as any });
  
  const [ sponsorModalVisible, setSponsorModalVisible ] = useState<boolean>(false);
  
  const handleAction = (action: PostActionType) => {
    if (action === PostActionType.sponsor) setSponsorModalVisible(true);
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

export default Post;