import { ethers } from "ethers";
import { debounce } from "../../utils";
import { useAppContext } from "../../hook";
import { useAccount, useBalance } from "wagmi";
import { JSX, useEffect, useMemo, useState } from "react";
import { PostForm, Search, Post, Loading } from "../../components";

export default function Timeline(): JSX.Element {
  const { address, isConnected } = useAccount();
  const { posts, isLoading, fetchPosts, estimateFeeForNewPost, submitPost } = useAppContext();
  const { data: balance } = useBalance({ address });
  
  const [ shouldLoadPosts, setShouldLoadPosts ] = useState<boolean>(true);
  const [ isPostFormEnabled, setIsPostFormEnabled ] = useState<boolean>(false);
  const [ showFormSpinner, setShowFormSpinner ] = useState<boolean>(false);

  const handleScroll = useMemo(() => debounce((e: Event) => {
    const offset = 200;
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
  
  const handleFetchNewPosts = async (postsToLoad: number = 5) => {
    await fetchPosts(postsToLoad);
    setShouldLoadPosts(false);
  }

  const handlePostFormChange = async (value: string) => {
    const usersBalance = ethers.utils.formatUnits(balance?.value || 0, 'ether');
    const estimatedGas = await estimateFeeForNewPost(value);
    setIsPostFormEnabled(+usersBalance > +estimatedGas);
  }

  const handlePostFormSubmit = async (value: string) => {
    setShowFormSpinner(true)
    await submitPost(value);
    setShowFormSpinner(false);
  }

  return (
    <div className="flex flex-col gap-12 px-2">
      <Search />
      {isConnected && <PostForm author={address}
                                onSubmit={handlePostFormSubmit}
                                onChange={handlePostFormChange}
                                showSpinner={showFormSpinner}
                                disabled={!isPostFormEnabled || showFormSpinner} />}
      <div>
        <h2 className="font-medium leading-6 text-xl mb-6">Feed</h2>
        <div className="flex flex-col gap-3">
          {posts
            .map( (post, i) => (
              <Post key={i}
                    post={post} />
            ))}
          <Loading visible={isLoading} />
        </div>
      </div>
    </div>
  )
}
