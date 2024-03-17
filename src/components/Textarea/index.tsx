import { ChangeEvent, FC, JSX, useMemo } from "react";
import { debounce } from "../../utils";

interface TextareaProps {
  placeholder?: string,
  value?: string,
  onChange?: (value: string) => void,
  disabled?: boolean
}

const Textarea: FC<TextareaProps> = ({ placeholder, value, onChange, disabled }): JSX.Element => {
  const handleChange = useMemo(() => debounce((ev: ChangeEvent) => {
    const target: HTMLTextAreaElement = ev.target as HTMLTextAreaElement;
    if (onChange) onChange(target.value)
  }), [onChange]);
  
  return (
    <textarea className="bg-transparent w-full outline-0 outline-none resize-none"
              onChange={handleChange}
              defaultValue={value}
              disabled={disabled}
              placeholder={placeholder} />
  )
}

export default Textarea;