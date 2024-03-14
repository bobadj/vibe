import { JSX } from "react";
import { formatAddress } from "../../utils";
import { useAccount, useEnsName } from "wagmi";
import { Outlet, useNavigate } from "react-router-dom";
import { useIsCurrentChainSupported } from "../../hook";
import { CONNECT_WALLET_PATH } from "../../utils/router";
import { Card, Button, NetworkError } from "../../components";
import logoIndigo from './../../assets/logo_indigo.svg';

export default function PageLayout(): JSX.Element {
  const navigate = useNavigate();
  const { isConnected, address } = useAccount();
  const isChainSupported = useIsCurrentChainSupported();
  
  const { data: ensName } = useEnsName({ address });
  
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
            <Button className="!opacity-100" classType="secondary" disabled={isConnected} onClick={() => navigate(CONNECT_WALLET_PATH)}>
              {(ensName || address) ? ensName || formatAddress(address) : 'Connect wallet'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
