import {JSX} from "react";

interface CardProps {
  children: JSX.Element|JSX.Element[],
  className?: string
}

export default function Card({ children, className }: CardProps): JSX.Element {
  return (
    <div className={`card rounded-[25px] px-3 py-5 border-solid border-[16px] ${className}`}>
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}
