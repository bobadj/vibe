import { ethers } from "ethers";
import { JSX, useEffect } from "react";
import { getEnsAddress } from "@wagmi/core";
import { useAppContext } from "../../hooks";
import { wagmiConfig } from "../../utils/config";
import { FEED_PATH } from "../../utils/router";
import { Search, PostList, PostForm } from "../../features";
import { Params, useNavigate, useParams } from "react-router-dom";

export default function Profile(): JSX.Element {
  const { address } = useParams<Params>();
  const navigate = useNavigate();
  
  const { searchPostsByAuthor } = useAppContext();
  
  useEffect(() => {
    handleSearch()
  }, [address]);
  
  const handleSearch = async () => {
    if (address) {
      let author: string = address;
      if (!ethers.utils.isAddress(address)) {
        try {
          const data = await getEnsAddress(wagmiConfig, { name: address });
          if (data) author = data;
        } catch (e) {
          console.error(e);
        }
      }
      await searchPostsByAuthor(author);
    }
  }
  
  const handlePostFormSubmit = () => navigate(FEED_PATH);
  
  return (
    <div className="flex flex-col gap-12 px-2">
      <Search value={address} />
      <PostForm onSubmit={handlePostFormSubmit} />
      <PostList />
      <PostForm.Modal onSubmit={handlePostFormSubmit}/>
    </div>
  )
}