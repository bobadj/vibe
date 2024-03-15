import { FormEvent, JSX, useState } from "react";
import { Button } from "../index.tsx";
import Input from "../Input";

interface DonationFormProps {
  onSubmit?: (amount: string) => void
  onChange?: (amount: string) => void
  showSpinner?: boolean
  disabled?: boolean
}

export default function DonationForm({ onSubmit, onChange, showSpinner, disabled }: DonationFormProps): JSX.Element {
  const [ amount, setAmount ] = useState<string|null>(null);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (onSubmit && amount && +amount > 0)
      onSubmit(amount);
  };

  const handleChange = (value: string) => {
    setAmount(value);
    if (onChange) onChange(value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-between gap-4">
        <Input onChange={handleChange}
               type="text"
               placeholder="Enter amount of ETH you want to donate..." />
        <Button type="submit"
                loading={showSpinner}
                disabled={disabled || showSpinner || +(amount || 0) <= 0}>
          DONATE
        </Button>
      </div>
    </form>
  )
}
