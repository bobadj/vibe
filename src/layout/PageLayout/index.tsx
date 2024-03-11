import { JSX } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Card, Button } from "../../components";
import { useAccount, useEnsName } from "wagmi";
import { CONNECT_WALLET_PATH, formatAddress } from "../../utils";
import logoIndigo from './../../assets/logo_indigo.svg';

export default function PageLayout(): JSX.Element {
  const navigate = useNavigate();
  const { address } = useAccount();
  
  const { data } = useEnsName({
    address: address
  });
  
  return (
    <div className="container-lg h-screen p-6 bg-layout">
      <div className="flex flex-col md:flex-row gap-4 justify-between align-top h-full">
        <div className="sidebar">
          <Card>
            <img src={logoIndigo} alt="" className="w-[50px] h-auto" />
            <Button className="mt-[150px]" disabled={!address}>Write A Post</Button>
          </Card>
        </div>
        <Card className="container min-h-full h-fit">
          <Outlet />
        </Card>
        <div className="sidebar">
          <Card>
            <Button classType="secondary" disabled={!!address} onClick={() => navigate(CONNECT_WALLET_PATH)}>
              {(data || address) ? data || formatAddress(address) : 'Connect wallet'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
