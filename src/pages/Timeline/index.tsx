import { JSX } from "react";
import { PostForm, Search, Post } from "../../components";
import { useAccount } from "wagmi";

export default function Timeline(): JSX.Element {
  const { isConnected } = useAccount();
  
  return (
    <div className="flex flex-col gap-12 px-2">
      <Search />
      {isConnected && <PostForm disabled />}
      <div>
        <h2 className="font-medium leading-6 text-xl mb-6">Feed</h2>
        <div className="flex flex-col gap-3">
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </div>
      </div>
    </div>
  )
}
