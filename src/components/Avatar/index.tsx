import { FC, JSX, useEffect, useState } from "react";
import makeBlockie from 'ethereum-blockies-base64';
import classNames from "classnames";

interface AvatarProps {
  small?: boolean,
  address?: string
}

const Avatar: FC<AvatarProps> = ({ address, small = false }): JSX.Element => {
  const [ avatar, setAvatar ] = useState<string|undefined>();
  
  useEffect(() => {
    setAvatar(makeBlockie(address || ''));
  }, [address]);
  
  return (
    <div className="avatar">
      <img src={avatar} alt="avatar" className={classNames('rounded-sm', {
        'min-w-[60px] h-[60px]': !small,
        'w-[30px] h-auto': small
      })} />
    </div>
  )
}

export default Avatar;