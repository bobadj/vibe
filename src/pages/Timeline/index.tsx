import { useAccount } from "wagmi";
import { debounce } from "../../utils";
import { useAppContext } from "../../hook";
import { JSX, useEffect, useMemo, useState } from "react";
import { PostForm, Search, Post, Loading } from "../../components";

export default function Timeline(): JSX.Element {
  const { address, isConnected } = useAccount();
  const { posts, isLoading, fetchPosts } = useAppContext();
  
  const [ shouldLoadPosts, setShouldLoadPosts ] = useState<boolean>(true);

  const handleScroll = useMemo(() => debounce((e: Event) => {
    const offset = 200;
    if (!shouldLoadPosts && (window.innerHeight + window.scrollY) >= document.body.scrollHeight - offset) {
      e.preventDefault();
      setShouldLoadPosts(true);
    }
  }, 50), [shouldLoadPosts]);

  // load a few more on mount to ensure that scroll is available
  useEffect(() => {
    if (shouldLoadPosts) handleFetchNewPosts(7);
  }, [shouldLoadPosts]);

  // scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  const handleFetchNewPosts = async (postsToLoad: number = 5) => {
    await fetchPosts(postsToLoad);
    setShouldLoadPosts(false);
  }
  
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
