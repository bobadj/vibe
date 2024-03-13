import { FormEvent, JSX, useState } from "react";
import { Card, Button, Avatar, Textarea } from "./../../components";

interface PostFormProps {
  title?: string,
  onSubmit?: (postContent: string) => void,
  disabled?: boolean,
  author?: string
}

export default function PostForm({ title, onSubmit, disabled, author }: PostFormProps): JSX.Element {
  const [ postContent, setPostContent ] = useState<string|null>(null);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (onSubmit && postContent && postContent.length > 0)
      onSubmit(postContent);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="font-medium leading-6 text-xl mb-6">{title ? title : 'Update your Vibe'}</h2>
      <Card className="border-[2px] rounded-[1rem]">
        <div className="flex flex-row gap-4 mb-6">
          <Avatar address={author} small />
          <Textarea onChange={setPostContent}
                    disabled={disabled}
                    placeholder="How’s your Vibe today, 3327?" />
        </div>
        <div className="w-full flex justify-end">
          <Button type="submit" disabled={disabled}>POST</Button>
        </div>
      </Card>
    </form>
  )
}
