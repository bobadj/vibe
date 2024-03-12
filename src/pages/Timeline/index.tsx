import { JSX } from "react";
import { useAccount } from "wagmi";
import { useAppContext } from "../../hook";
import { PostForm, Search, Post, Loading } from "../../components";

export default function Timeline(): JSX.Element {
  const { isConnected } = useAccount();
  const { posts, isLoading } = useAppContext();
  
  return (
    <div className="flex flex-col gap-12 px-2">
      <Search />
      {isConnected && <PostForm />}
      <div>
        <h2 className="font-medium leading-6 text-xl mb-6">Feed</h2>
        <div className="flex flex-col gap-3">
          <Loading visible={isLoading}>
            {posts
              .map( (post, i) => (
                <Post key={i} post={post} />
              ))}
          </Loading>
        </div>
      </div>
    </div>
  )
}
