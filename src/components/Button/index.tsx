import {JSX, MouseEventHandler} from "react";

interface ButtonProps {
  children: string|JSX.Element,
  className?: string,
  classType?: 'primary'|'secondary',
  disabled?: boolean,
  onClick?: MouseEventHandler,
  type?: "submit"|"reset"|"button"
}
export default function Button({ children, className, classType = 'primary', disabled, onClick, type = 'button' }: ButtonProps) {
  const baseClass: string = classType === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  return (
    <button className={`${baseClass} ${disabled && 'cursor-not-allowed'} font-medium leading-6 rounded-2xl px-[70px] py-[13px] text-xl w-max ${className}`}
            type={type}
            onClick={onClick}>
      {children}
    </button>
  )
}
