import { FC, JSX } from "react";
import classNames from "classnames";

interface CardProps {
  children: JSX.Element|JSX.Element[],
  className?: string
}

const Card: FC<CardProps> = ({ children, className }): JSX.Element => {
  return (
    <div className={classNames("bg-card shadow-sm rounded-[25px] px-3 py-5 border-solid border-[16px] border-gray", className)}>
      {children}
    </div>
  )
}

export default Card;