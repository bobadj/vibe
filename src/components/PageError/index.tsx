import {JSX} from "react";

interface PageErrorProps {
  status: number|string,
  content: string
}

export default function PageError({ status, content }: PageErrorProps): JSX.Element {
  return (
    <div className="flex flex-col justify-center items-center py-9 text-slate-700">
      <h1 className="text-5xl font-bold my-9">OOOPS!</h1>
      <p className="text-5xl font-bold mb-4">{status}</p>
      <p className="text-xl">{content}</p>
    </div>
  )
}