import {JSX, useEffect, useState} from "react";

interface ModalProps {
  open: boolean
  onClose?: () => any
  children: JSX.Element|JSX.Element[]
}

export default function Modal({ open, onClose, children }: ModalProps): JSX.Element {
  const [ isVisible, setIsVisible ] = useState<boolean>(open);
  
  useEffect(() => {
    setIsVisible(open);
  }, [open]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  }
  
  return (
    <div className={`fixed inset-0 flex z-50 justify-center items-center transition-colors ${isVisible ? "visible bg-black/60" : "invisible"}`}
         onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()}
           className={`bg-card bg-white rounded-[25px] px-3 py-5 border-solid border-modal border-[16px] p-6 transition-all min-w-[50%] ${isVisible ? "scale-100" : "scale-125 opacity-0"}`}>
        {children}
      </div>
    </div>
  )
}