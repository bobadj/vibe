import { ChangeEvent, JSX, useMemo } from "react";
import { debounce } from "../../utils";

interface InputProps {
  type: "text"|"number"
  className?: string
  placeholder?: string
  onChange?: (value: string) => void
  value?: string
  disabled?: boolean
}

export default function Input({ type, className, placeholder, onChange, value, disabled }: InputProps): JSX.Element {
  const handleChange = useMemo(() => debounce((ev: ChangeEvent) => {
    const target: HTMLTextAreaElement = ev.target as HTMLTextAreaElement;
    if (onChange) onChange(target.value)
  }), [onChange]);
  
  return (
    <input className={`bg-transparent w-full outline-0 outline-none appearance-none ${className || ''}`}
           type={type}
           defaultValue={value}
           placeholder={placeholder}
           onChange={handleChange}
           disabled={disabled}
    />
  )
}