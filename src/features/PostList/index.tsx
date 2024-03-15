import { JSX } from "react";
import { Loader } from "../../components";
import { useAppContext } from "../../hooks";
import Post from '../Post';

import type { PostStruct } from "../../utils/types";

interface PostListProps {
  title?: string
}

export default function PostList({ title }: PostListProps): JSX.Element {
  const { posts, isLoading } = useAppContext();
  
  return (
    <div>
      <h2 className="font-medium leading-6 text-xl mb-6">{title || 'Feed'}</h2>
      <div className="flex flex-col gap-3">
        {posts
          .map( (post: PostStruct, i: number) => (
            <Post key={i}
                  post={post}
            />
          ))}
        <Loader visible={isLoading} />
      </div>
    </div>
  )
}