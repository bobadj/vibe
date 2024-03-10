import { JSX } from "react";
import avatar from './avatar.svg';

interface AvatarProps {
  small?: boolean
}

export default function Avatar({ small = false }: AvatarProps): JSX.Element {
  const avatarClass: string = small ? 'w-[30px] h-[30px]' : 'min-w-[60px] min-h-[60px]'
  return (
    <div className="avatar">
      <img src={avatar} alt="avatar" className={avatarClass} />
    </div>
  )
}
