import { JSX, useEffect, useState } from "react";
import { isValidURL } from "../../../utils";
import { Preview } from "../../../components";

interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps): JSX.Element {
  const [ previewSource, setPreviewSource ] = useState<string|undefined>()

  useEffect(() => {
    const URIs = (content || '').match(/(https?:\/\/[^ ]*)/g);
    if (URIs && (URIs || []).length > 0 && isValidURL(URIs[0])) {
      setPreviewSource(URIs[0]);
    }
  }, [content]);

  return (
    <div className="post-content text-black">
      {
        previewSource
          ?
          <>
            {content.replace(previewSource, '')}
            <Preview uri={previewSource}/>
          </>
          :
          content
      }
    </div>
  )
}