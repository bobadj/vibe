import { FC, JSX, useEffect, useState } from "react";
import { isValidURL } from "../../../utils";
import Preview from "../../Preview";

interface ContentProps {
  content: string
}

const Content: FC<ContentProps> = ({ content }): JSX.Element => {
  const [ previewSource, setPreviewSource ] = useState<string|undefined|null>(null);

  useEffect(() => {
    const URIs = (content || '').match(/(https?:\/\/[^ ]*)/g);
    if (URIs && (URIs || []).length > 0 && isValidURL(URIs[0])) {
      setPreviewSource(URIs[0]);
    } else {
      setPreviewSource(null);
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

export default Content;