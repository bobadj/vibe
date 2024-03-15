import { JSX } from "react";
import { useAccount } from "wagmi";
import { useOutletContext } from "react-router-dom";
import { Modal as UIModal } from '../../../components';
import PostForm from "../index.tsx";

import type { OutletContextType } from "../../../utils/types";

interface ModalProps {
  onSubmit?: () => void
}

export default function Modal({ onSubmit }: ModalProps): JSX.Element|null {
  const { isConnected } = useAccount();
  const { showPostForm, setShowPostForm } = useOutletContext<OutletContextType>();
  
  if (!isConnected) return null;
  
  const handleSubmit = () => {
    setShowPostForm(false);
    if (onSubmit) onSubmit();
  }
  
  return (
    <UIModal open={showPostForm} onClose={() => setShowPostForm(false)}>
      <PostForm onSubmit={handleSubmit}
                hideTitle />
    </UIModal>
  )
}