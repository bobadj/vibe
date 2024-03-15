import { ethers } from "ethers";
import { debounce } from "../../utils";
import { useAppContext } from "../../hook";
import { useAccount, useBalance } from "wagmi";
import { JSX, useEffect, useMemo, useState } from "react";
import { PostForm, Search, Post, Loader, Modal, DonationForm } from "../../components";
import type { PostActionType } from "../../components/Post";
import { PostStruct } from "../../context/AppContext";

export default function Timeline(): JSX.Element {
  const { address, isConnected } = useAccount();
  const { posts, isLoading, sponsoredPosts, fetchPosts, estimateFeeForNewPost, estimateSponsorshipFee, submitPost, sponsorPost } = useAppContext();
  const { data: balance } = useBalance({ address });
  
  const [ shouldLoadPosts, setShouldLoadPosts ] = useState<boolean>(true);
  const [ isPostFormEnabled, setIsPostFormEnabled ] = useState<boolean>(false);
  const [ isDonationFormEnabled, setIsDonationFormEnabled ] = useState<boolean>(false);
  const [ showPostFormSpinner, setShowPostFormSpinner ] = useState<boolean>(false);
  const [ showDonationFormSpinner, setShowDonationFormSpinner ] = useState<boolean>(false);
  const [ activePost, setActivePost ] = useState<number|null>(null);

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
  };

  const handlePostFormChange = async (value: string) => {
    setIsPostFormEnabled(false);
    setShowPostFormSpinner(true);
    const usersBalance = ethers.utils.formatUnits(balance?.value || 0, 'ether');
    const estimatedGas = await estimateFeeForNewPost(value);
    setIsPostFormEnabled(+usersBalance > +estimatedGas);
    setShowPostFormSpinner(false);
  };

  const handlePostFormSubmit = async (value: string) => {
    setShowPostFormSpinner(true);
    await submitPost(value);
    setShowPostFormSpinner(false);
  };

  const handleDonationFormChange = async (value: string): Promise<void> => {
    setIsDonationFormEnabled(false);
    setShowDonationFormSpinner(true);
    if (activePost && value.length > 0 && +value > 0) {
      const usersBalance = ethers.utils.formatUnits(balance?.value || 0, 'ether');
      const estimatedGas = await estimateSponsorshipFee(activePost, +value);
      setIsDonationFormEnabled(+usersBalance > (+estimatedGas + +value));
    }
    setShowDonationFormSpinner(false);
  }

  const handleDonationFormSubmit = async (value: string) => {
    if (activePost) {
      setIsDonationFormEnabled(false); // disable form while submitting
      setShowDonationFormSpinner(true); // show spinner
      if (+value > 0) {
        await sponsorPost(activePost, +value); // sponsor
        setActivePost(null); // close modal aka show now donation form
      }
      setShowDonationFormSpinner(false); // remove spinner
      setIsDonationFormEnabled(true); // enable form once again
    }
  };
  
  const postActionHandler = (postId: number, action: PostActionType) => {
    if (action === "sponsor") setActivePost(postId);
  };

  const canSponsorPost = (post: PostStruct) => post?.owner !== address && sponsoredPosts.indexOf(post?.id) < 0;

  return (
    <>
      <div className="flex flex-col gap-12 px-2">
        <Search />
        {isConnected && <PostForm author={address}
                                  onSubmit={handlePostFormSubmit}
                                  onChange={handlePostFormChange}
                                  showSpinner={showPostFormSpinner}
                                  disabled={!isPostFormEnabled || showPostFormSpinner} />}
        <div>
          <h2 className="font-medium leading-6 text-xl mb-6">Feed</h2>
          <div className="flex flex-col gap-3">
            {posts
              .map( (post, i) => (
                <Post key={i}
                      post={post}
                      actionsDisabled={!canSponsorPost(post)}
                      onAction={postActionHandler} />
              ))}
            <Loader visible={isLoading} />
          </div>
        </div>
      </div>
      {isConnected && (
        <Modal open={!!activePost} onClose={() => setActivePost(null)}>
          <DonationForm onChange={handleDonationFormChange}
                        onSubmit={handleDonationFormSubmit}
                        showSpinner={showDonationFormSpinner}
                        disabled={!isDonationFormEnabled || showDonationFormSpinner}/>
        </Modal>
      )}
    </>
  )
}
