import { JSX } from "react";

interface CardProps {
  children: JSX.Element|JSX.Element[],
  className?: string
}

export default function Card({ children, className }: CardProps): JSX.Element {
  return (
    <div className={`bg-card shadow-sm rounded-[25px] px-3 py-5 border-solid border-[16px] border-gray ${className || ''}`}>
      {children}
    </div>
  )
}
