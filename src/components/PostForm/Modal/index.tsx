import { FC, JSX } from "react";
import { useAccount } from "wagmi";
import { useOutletContext } from "react-router-dom";
import { default as UIModal } from "../../Modal";
import PostForm from "../../PostForm"

import type { OutletContextType } from "../../../types";

interface ModalProps {
  onSubmit?: () => void
}

const Modal: FC<ModalProps> = ({ onSubmit }): JSX.Element|null => {
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

export default Modal;