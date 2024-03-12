import { JSX } from "react";

interface LoadingProps {
  visible: boolean,
  children?: JSX.Element|JSX.Element[]
}

export default function Loading({ visible, children }: LoadingProps): JSX.Element {
  if (!visible) {
    return (
      <>
        {children}
      </>
    )
  }
  
  return (
    <div className="flex gap-2 w-full justify-center">
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
    </div>
  )
}