import { JSX, useEffect, useState } from "react";
import { siteLookup, SiteLookupResponse } from "../../utils/meta";

interface PreviewProps {
  uri: string
}

export default function Preview({ uri }: PreviewProps): JSX.Element|null {
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ data, setData ] = useState<SiteLookupResponse|null>({} as SiteLookupResponse);
  
  useEffect(() => {
    const fetchMetadata = async () => {
      setIsLoading(true);
      const siteLookupResponse = await siteLookup(uri);
      setData(siteLookupResponse);
      setIsLoading(false);
    }
    fetchMetadata()
  }, [uri]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-row border rounded-xl no-underline p-1 my-2">
        <div className="w-[150px] h-[150px] rounded-l-lg bg-slate-700"></div>
        <div className="flex-1 space-y-3 py-7 px-3">
          <div className="h-2 bg-slate-700 rounded-lg" />
          <div className="h-3 bg-slate-700 rounded-lg" />
          <div className="h-12 bg-slate-700 rounded-lg" />
        </div>
      </div>
    )
  }
  
  if (data === null) return null;
  
  if (data.type === 'image' && data.images && data.images.length > 0) {
    return (
      <a href={uri} target="_blank" className="my-2 shadow rounded-lg">
        <img className="h-auto rounded-lg" src={data.images[0] as string} alt={data.title as string} />
      </a>
    )
  }
  
  const getImageNode = () => {
    let imageSource = data.og?.image;
    if (!imageSource && data.images && data.images.length > 0) imageSource = data.images[0] as string;
    
    return <img className="w-[150px] h-auto rounded-l-lg" src={imageSource} alt={data.title as string} />
  }
  
  const getTitleNode = () => {
    let content = data.og?.title;
    if (!content && data.metadata?.title) content = data.metadata?.title;
    if (!content && data.title) content = data.title;
    
    return <p className="text-xl font-bold">{content}</p>;
  }
  
  const getDescriptionNode = () => {
    let content = data.og?.description;
    if (!content && data.metadata?.description) content = data.metadata?.description;
    
    return <p className="font-light text-slate-700">{content}</p>;
  }
  
  return (
    <a href={uri} target="_blank" className="flex flex-row border rounded-xl no-underline p-1 my-2">
      {getImageNode()}
      <div className="flex flex-col text-black p-3">
        <p className="text-xs text-slate-700 font-bold">{uri}</p>
        {getTitleNode()}
        {getDescriptionNode()}
      </div>
    </a>
  )
}
