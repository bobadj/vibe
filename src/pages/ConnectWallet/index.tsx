import { JSX, useEffect } from "react";
import { Button } from "../../components";
import { supportedWallets, wagmiConfig } from "../../utils/config";
import { FEED_PATH } from "../../utils/router";
import { connect } from '@wagmi/core';
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import logo from './../../assets/logo_white.svg';

export default function ConnectWallet(): JSX.Element {
  const { address, chainId} = useAccount();
  const navigate = useNavigate();
  
  useEffect( () => {
    if (address || chainId) navigate(FEED_PATH);
  }, [address, chainId]);
  
  return (
    <div className="container-lg bg-layout">
      <div className="flex flex-row justify-between min-h-[100vh]">
        <div className="hidden lg:flex justify-center bg-login bg-no-repeat w-full bg-center bg-cover">
          <img src={logo} alt="Vibe" className="max-w-[180px]" />
        </div>
        <div className="w-full flex flex-col justify-center px-6">
          <h2 className="text-black font-bold text-6xl mb-2">Connect your wallet</h2>
          <p className="font-normal text-black">Need help connecting a wallet? <a href="#">Read our FAQ</a></p>
          <div className="flex flex-col pt-12 gap-3 max-w-[350px]">
            {
              supportedWallets.map( (connector: any, i: number) => {
                const wallet = connector();
                return (
                  <Button key={i}
                          className="gap-4 !w-full"
                          classType="transparent"
                          onClick={() => connect(wagmiConfig, { connector: connector })}>
                    <>
                      <img src={`/src/assets/wallets/${wallet?.name.toLowerCase()}.svg`} alt={wallet.name} />
                      <span className="text-black">{wallet?.name}</span>
                    </>
                  </Button>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}
