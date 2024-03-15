import { FC, JSX } from "react";
import Spinner from "./Spinner";

interface LoaderProps {
  visible: boolean,
  spinner?: boolean
  children?: JSX.Element|JSX.Element[]
}

type ILoader<T> = FC<T> & {
  Spinner: typeof Spinner;
}

const Loader: ILoader<LoaderProps> = ({ visible, children, spinner }): JSX.Element => {
  if (!visible) {
    return (
      <>{children}</>
    )
  }

  if (spinner) return <Spinner visible={visible} />

  return (
    <div className="flex gap-2 w-full justify-center">
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
    </div>
  )
}

Loader.Spinner = Spinner;
export default Loader;