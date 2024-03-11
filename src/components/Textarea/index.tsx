import { ChangeEvent, JSX, useMemo } from "react";
import { debounce } from "../../utils";

interface TextareaProps {
  placeholder?: string,
  value?: string,
  onChange?: (value: string) => void,
  disabled?: boolean
}

export default function Textarea({ placeholder, value, onChange, disabled }: TextareaProps): JSX.Element {
  const handleChange = useMemo(() => debounce((ev: ChangeEvent) => {
    const target: HTMLTextAreaElement = ev.target as HTMLTextAreaElement;
    if (onChange) onChange(target.value)
  }), [onChange]);
  
  return (
    <textarea className="bg-transparent w-full outline-0 resize-none"
              onChange={handleChange}
              defaultValue={value}
              disabled={disabled}
              placeholder={placeholder} />
  )
}
