import { ethers } from "ethers";
import { debounce } from "../../utils";
import { wagmiConfig } from "../../config";
import { getEnsAddress } from "@wagmi/core";
import { useAppContext } from "../../hooks";
import { FC, JSX, useEffect, useMemo, useState } from "react";
import { PostForm, Search, PostList } from "../../components";

const Feed: FC = (): JSX.Element => {
  const [ shouldLoadPosts, setShouldLoadPosts ] = useState<boolean>(true);
  const [ infinityScrollEnabled, setInfinityScrollEnabled ] = useState<boolean>(true);
  
  const { fetchPosts, searchPostsByAuthor } = useAppContext();
  
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
    if (infinityScrollEnabled) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      }
    }
  }, [handleScroll, infinityScrollEnabled]);

  const handleFetchNewPosts = async (cleanup?: boolean, postsToLoad: number = 5): Promise<void> => {
    await fetchPosts(postsToLoad, cleanup);
    setShouldLoadPosts(false);
  };

  const handleSearch = async (searchTerm: string) => {
    const shouldSearch: boolean = searchTerm.length > 0;
    setInfinityScrollEnabled(!shouldSearch);
    if (shouldSearch) {
      if (!ethers.utils.isAddress(searchTerm)) {
        try {
          const data = await getEnsAddress(wagmiConfig, { name: searchTerm });
          if (data) searchTerm = data;
        } catch (e) {
          console.error(e);
        }
      }
      await searchPostsByAuthor(searchTerm);
    } else {
      await handleFetchNewPosts(true);
    }
  }
  
  return (
    <div className="flex flex-col gap-12 px-2">
      <Search onChange={handleSearch} />
      <PostForm />
      <PostList />
      <PostForm.Modal />
    </div>
  )
}

export default Feed;