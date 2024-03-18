import { FC, JSX, MouseEventHandler } from "react";
import { ButtonClassTypes, ButtonTypes } from "./../../types/enum";
import Loader from "../Loader";
import classNames from "classnames";

interface ButtonProps {
  children: string|JSX.Element,
  className?: string,
  classType?: ButtonClassTypes,
  disabled?: boolean,
  loading?: boolean
  onClick?: MouseEventHandler,
  type?: ButtonTypes
}

const Button: FC<ButtonProps> = ({ children, className, classType = ButtonClassTypes.primary, disabled = false, loading = false, onClick, type = ButtonTypes.button }) => {
  return (
    <button className={classNames("flex flex-row items-center font-medium leading-6 rounded-2xl px-[70px] py-[13px] text-xl w-max", className, {
      "bg-blue shadow-buttonPrimary text-white": classType === ButtonClassTypes.primary,
      "bg-white shadow-buttonSecondary text-black": classType === ButtonClassTypes.secondary,
      "shadow bg-card border-[2px] border-gray text-black": classType === ButtonClassTypes.transparent,
      "opacity-60 cursor-not-allowed": disabled
    })}
            disabled={disabled}
            type={type}
            onClick={onClick}>
      <Loader visible={loading} spinner />
      {children}
    </button>
  )
}
export default Button;