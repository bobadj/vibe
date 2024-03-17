import { debounce } from "../../utils";
import { useAppContext } from "../../hooks";
import { FC, JSX, useEffect, useMemo, useState } from "react";
import { PostForm, Search, PostList } from "../../components";

const Feed: FC = (): JSX.Element => {
  const [ shouldLoadPosts, setShouldLoadPosts ] = useState<boolean>(true);
  
  const { fetchPosts } = useAppContext();
  
  const handleScroll = useMemo(() => debounce((e: Event) => {
      const offset = 300;
      if (!shouldLoadPosts && (window.innerHeight + window.scrollY) >= document.body.scrollHeight - offset) {
        e.preventDefault();
        setShouldLoadPosts(true);
      }
  }, 50), [shouldLoadPosts]);
  
  useEffect(() => {
    if (shouldLoadPosts) handleFetchNewPosts();
  }, [shouldLoadPosts]);
  
  // scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  const handleFetchNewPosts = async (postsToLoad: number = 5): Promise<void> => {
    await fetchPosts(postsToLoad);
    setShouldLoadPosts(false);
  };
  
  return (
    <div className="flex flex-col gap-12 px-2">
      <Search />
      <PostForm />
      <PostList />
      <PostForm.Modal />
    </div>
  )
}

export default Feed;