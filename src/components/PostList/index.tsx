import { FC, JSX } from "react";
import { useAppContext } from "../../hooks";
import Loader from '../Loader';
import Post from '../Post';

import type { PostStruct } from "../../types";

interface PostListProps {
  title?: string
}

const PostList: FC<PostListProps> = ({ title }): JSX.Element => {
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

export default PostList;