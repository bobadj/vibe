import { useAccount } from "wagmi";
import { debounce } from "../../utils";
import { useAppContext } from "../../hook";
import { JSX, useEffect, useMemo } from "react";
import { PostForm, Search, Post, Loading } from "../../components";

export default function Timeline(): JSX.Element {
  const { address, isConnected } = useAccount();
  const { posts, isLoading, fetchPosts } = useAppContext();

  const handleScroll = useMemo(() => debounce(() => {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      fetchPosts();
    }
  }, 100), [fetchPosts]);

  // load a few more on mount to ensure that scroll is available
  useEffect(() => {
    fetchPosts(7);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  return (
    <div className="flex flex-col gap-12 px-2">
      <Search />
      {isConnected && <PostForm author={address} />}
      <div>
        <h2 className="font-medium leading-6 text-xl mb-6">Feed</h2>
        <div className="flex flex-col gap-3">
          {posts
              .map( (post, i) => (
                  <Post key={i} post={post} />
              ))}
          <Loading visible={isLoading} />
        </div>
      </div>
    </div>
  )
}
