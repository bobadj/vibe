import { FC, JSX } from "react";
import Spinner from "./assets/spinner.svg?react";


interface LoaderProps {
  visible: boolean,
  spinner?: boolean
  children?: JSX.Element|JSX.Element[]
}

const Loader: FC<LoaderProps> = ({ visible, children, spinner }): JSX.Element => {
  if (!visible) {
    return (
      <>{children}</>
    )
  }

  if (spinner) {
    return (
      <span className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
        <Spinner />
      </span>
    );
  }

  return (
    <div className="flex gap-2 w-full justify-center">
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
    </div>
  )
}

export default Loader;