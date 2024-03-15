import { ChangeEvent, FormEvent, JSX, useMemo } from "react";
import { debounce } from "../../utils";
import type { CallbackFunction } from "../../utils/types";

interface FormProps {
  onChange?: CallbackFunction
  onSubmit?: CallbackFunction
  children: JSX.Element|JSX.Element[]
  className?: string
}

export default function Form({ onChange, onSubmit, children, className }: FormProps): JSX.Element {
  const handleOnChange = useMemo(() => debounce((ev: ChangeEvent) => {
    if (onChange) onChange(ev);
  }), [onChange]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit)
      onSubmit(e);
  };
  
  return (
    <form className={className}
          onChange={handleOnChange}
          onSubmit={handleSubmit}>
      {children}
    </form>
  )
}
