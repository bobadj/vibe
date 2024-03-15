import { ethers } from "ethers";
import { useAppContext } from "../../hooks";
import { useAccount, useBalance } from "wagmi";
import { FC, FormEvent, JSX, useState } from "react";
import { Card, Button, Avatar, Textarea, Form } from "./../../components";
import Modal from './Modal';

interface PostFormProps {
  title?: string
  onSubmit?: (postContent: string) => void
  hideTitle?: boolean
}

type IPostForm<T> = FC<T> & {
  Modal: typeof Modal;
}

const PostForm: IPostForm<PostFormProps> = ({ title, onSubmit, hideTitle = false }): JSX.Element|null => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const { submitPost, estimateFeeForNewPost } = useAppContext();
  
  const [ formEnabled, setFormEnabled ] = useState<boolean>(false);
  const [ postContent, setPostContent ] = useState<string|null>(null);
  const [ showSpinner, setShowSpinner ] = useState<boolean>(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (postContent && postContent.length > 0) {
      setShowSpinner(true);
      await submitPost(postContent);
      if (onSubmit) onSubmit(postContent);
      setShowSpinner(false);
    }
  };
  
  const handleChange = async (value: string): Promise<void> => {
    setPostContent(value);
    if (value.length > 0) {
      setFormEnabled(false);
      setShowSpinner(true);
      const usersBalance = ethers.utils.formatUnits(balance?.value || 0, 'ether');
      const estimatedGas = await estimateFeeForNewPost(value);
      setFormEnabled(+usersBalance > +estimatedGas);
      setShowSpinner(false);
    }
  };
  
  if (!isConnected) return null;
  
  return (
    <Form onSubmit={handleSubmit}>
      <>
        {!hideTitle && (
          <h2 className="font-medium leading-6 text-xl mb-6">{title ? title : 'Update your Vibe'}</h2>
        )}
        <Card className="border-[2px] rounded-[1rem]">
          <div className="flex flex-row gap-4 mb-6">
            <Avatar address={address} small />
            <Textarea onChange={handleChange}
                      placeholder="How’s your Vibe today, 3327?" />
          </div>
          <div className="w-full flex justify-end">
            <Button type="submit"
                    loading={showSpinner}
                    disabled={!formEnabled || showSpinner || (postContent || '').length <= 0}>
              POST
            </Button>
          </div>
        </Card>
      </>
    </Form>
  )
}

PostForm.Modal = Modal;

export default PostForm;