import { ChangeEvent, FC, JSX, useMemo } from "react";
import { debounce } from "../../utils";
import classNames from "classnames";

import type { InputType } from "../../types/enum";

interface InputProps {
  type: InputType
  className?: string
  placeholder?: string
  onChange?: (value: string) => void
  value?: string
  disabled?: boolean
}

const Input: FC<InputProps> = ({ type, className, placeholder, onChange, value, disabled }): JSX.Element => {
  const handleChange = useMemo(() => debounce((ev: ChangeEvent) => {
    const target: HTMLTextAreaElement = ev.target as HTMLTextAreaElement;
    if (onChange) onChange(target.value)
  }), [onChange]);
  
  return (
    <input className={classNames('bg-transparent w-full outline-0 outline-none appearance-none', className)}
           type={type}
           defaultValue={value}
           placeholder={placeholder}
           onChange={handleChange}
           disabled={disabled}
    />
  )
}

export default Input;