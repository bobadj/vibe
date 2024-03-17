import { ethers} from "ethers";
import { FC, FormEvent, JSX, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { useAppContext } from "../../hooks";
import { Button, Form, Input } from "../../components";

import type { PostStruct } from "../../types";
import { ButtonTypes, InputType } from "../../types/enum";

interface DonationFormProps {
  post: PostStruct
  onSubmit?: (amount: string|null) => void
}

const DonationForm: FC<DonationFormProps> = ({ post, onSubmit }: DonationFormProps): JSX.Element => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  
  const { estimateSponsorshipFee, sponsorPost } = useAppContext();
  
  const [ amount, setAmount ] = useState<string|null>(null);
  const [ isFormEnabled, setIsFormEnabled ] = useState<boolean>(true);
  const [ showSpinner, setShowSpinner ] = useState<boolean>(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setIsFormEnabled(false);
    setShowSpinner(true);
    if (amount && +amount > 0) {
      await sponsorPost(post, +amount);
    }
    setShowSpinner(false);
    setIsFormEnabled(true);
    if (onSubmit) onSubmit(amount);
  };
  
  const handleChange = async (value: string) => {
    setAmount(value);
    setIsFormEnabled(false);
    setShowSpinner(true);
    if (value.length > 0 && +value > 0) {
      const usersBalance = ethers.utils.formatUnits(balance?.value || 0, 'ether');
      const estimatedGas = await estimateSponsorshipFee(post, +value);
      setIsFormEnabled(+usersBalance > (+estimatedGas + +value));
    }
    setShowSpinner(false);
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <div className="flex flex-row justify-between gap-4">
        <Input onChange={handleChange}
               type={InputType.text}
               placeholder="Enter amount of ETH you want to donate..." />
        <Button type={ButtonTypes.button}
                loading={showSpinner}
                disabled={!isFormEnabled || showSpinner || +(amount || 0) <= 0}>
          DONATE
        </Button>
      </div>
    </Form>
  )
}

export default DonationForm;