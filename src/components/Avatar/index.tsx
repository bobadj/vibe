import { FC, JSX, useEffect, useState } from "react";
import makeBlockie from 'ethereum-blockies-base64';

interface AvatarProps {
  small?: boolean,
  address?: string
}

const Avatar: FC<AvatarProps> = ({ address, small = false }): JSX.Element => {
  const avatarClass: string = small ? 'w-[30px] h-auto' : 'min-w-[60px] h-[60px]';
  const [ avatar, setAvatar ] = useState<string|undefined>();
  
  useEffect(() => {
    setAvatar(makeBlockie(address || ''));
  }, [address]);
  
  return (
    <div className="avatar">
      <img src={avatar} alt="avatar" className={`rounded-sm ${avatarClass}`} />
    </div>
  )
}

export default Avatar;