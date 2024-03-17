import { createPortal } from "react-dom";
import { JSX, useEffect, useState, useRef, FC } from "react";

interface ModalProps {
  open: boolean
  onClose?: () => any
  children: JSX.Element|JSX.Element[]
}

const Modal: FC<ModalProps> = ({ open, onClose, children }) => {
  const overlayEl = useRef(null);
  const [ isVisible, setIsVisible ] = useState<boolean>(false);
  
  const handleOpen = () => {
    if (overlayEl.current) {
      const overlay: Element = overlayEl.current;
      const modalEl: Element = overlay.children[0];
      overlay.classList.add('bg-black/60')
      modalEl.classList.remove('scale-0')
      modalEl.classList.add('opacity-100');
      modalEl.classList.add('scale-100');
      document.body.classList.add('overflow-hidden');
    }
  };
  
  useEffect(() => {
    let interval: any;
    setIsVisible(open);
    if (open) {
      interval = setInterval(handleOpen, 50);
    }
    return () => clearInterval(interval);
  }, [open]);
  
  useEffect(() => {
    let interval: any;
    if (isVisible) {
      interval = setInterval(handleOpen, 50);
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => clearInterval(interval);
  }, [isVisible]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  }
  
  if (!isVisible) return null;
  
  return createPortal(
    <div className={`fixed inset-0 flex z-50 justify-center items-center transition-colors duration-300`}
         ref={overlayEl}
         onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()}
           className={`bg-card bg-white rounded-[25px] px-3 py-5 border-solid border-modal border-[16px] p-6 transition-all duration-300 min-w-[50%] scale-0 opacity-0`}>
        {children}
      </div>
    </div>,
    document.body
  )
}
export default Modal;