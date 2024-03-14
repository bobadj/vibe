import { FormEvent, JSX, useState } from "react";
import { Button } from "../index.tsx";
import Input from "../Input";

interface DonationFormProps {
  onSubmit?: (postContent: string) => void,
  showSpinner?: boolean
  disabled?: boolean
}

export default function DonationForm({ onSubmit, showSpinner, disabled }: DonationFormProps): JSX.Element {
  const [ amount, setAmount ] = useState<string|null>(null);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (onSubmit && amount && +amount > 0)
      onSubmit(amount);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-between gap-4">
        <Input disabled={disabled}
               onChange={setAmount}
               type="number"
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
