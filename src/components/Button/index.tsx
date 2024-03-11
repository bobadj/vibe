import { JSX, MouseEventHandler } from "react";

interface ButtonProps {
  children: string|JSX.Element,
  className?: string,
  classType?: 'primary'|'secondary'|'transparent',
  disabled?: boolean,
  onClick?: MouseEventHandler,
  type?: "submit"|"reset"|"button"
}
export default function Button({ children, className, classType = 'primary', disabled = false, onClick, type = 'button' }: ButtonProps) {
  const getButtonStyles = (): string => {
    switch (classType) {
      case 'transparent':
        return 'shadow bg-card border-[2px] border-gray text-black';
      case 'secondary':
        return 'bg-white shadow-buttonSecondary text-black';
      default:
        return "bg-blue shadow-buttonPrimary text-white";
    }
  }
  
  return (
    <button className={`${getButtonStyles()} ${disabled && 'cursor-not-allowed'} flex flex-row items-center font-medium leading-6 rounded-2xl px-[70px] py-[13px] text-xl w-max ${className}`}
            disabled={disabled}
            type={type}
            onClick={onClick}>
      {children}
    </button>
  )
}