import { JSX } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Card, Button, NetworkError } from "../../components";
import { useAccount } from "wagmi";
import { formatAddress } from "../../utils";
import { CONNECT_WALLET_PATH } from "../../utils/router";
import { useIsCurrentChainSupported } from "../../hook";
import logoIndigo from './../../assets/logo_indigo.svg';

export default function PageLayout(): JSX.Element {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const isChainSupported = useIsCurrentChainSupported();
  
  return (
    <div className="container-lg h-screen p-6 bg-layout">
      <div className="flex flex-col md:flex-row gap-4 justify-between align-top h-full">
        <div className="sidebar">
          <Card>
            <img src={logoIndigo} alt="" className="w-[50px] h-auto" />
            <Button className="mt-[150px]" disabled={!isConnected || !isChainSupported}>Write A Post</Button>
          </Card>
        </div>
        <Card className="container h-fit">
          {isChainSupported ? <Outlet /> : <NetworkError />}
        </Card>
        <div className="sidebar">
          <Card>
            <Button classType="secondary" disabled={isConnected} onClick={() => navigate(CONNECT_WALLET_PATH)}>
              {address ? formatAddress(address) : 'Connect wallet'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
