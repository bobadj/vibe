import { JSX } from "react";
import { Button } from "../../components";
import { supportedWallets, wagmiConfig } from "../../utils";
import { connect } from '@wagmi/core';
import logo from './../../assets/logo_white.svg';

export default function ConnectWallet(): JSX.Element {
  return (
    <div className="container-lg bg-layout">
      <div className="flex flex-row justify-between min-h-[100vh]">
        <div className="hidden lg:flex justify-center bg-login bg-no-repeat w-full bg-center">
          <img src={logo} alt="Vibe" className="max-w-[180px]" />
        </div>
        <div className="w-full flex flex-col justify-center px-6">
          <h2 className="text-black font-bold text-6xl mb-2">Connect your wallet</h2>
          <p className="font-normal text-black">Need help connecting a wallet? <a href="#">Read our FAQ</a></p>
          <div className="flex flex-col pt-12 gap-3 max-w-[350px]">
            {
              supportedWallets.map( (connector: any, i: number) => (
                <Button key={i} className="gap-4 !w-full"
                        classType="transparent"
                        onClick={() => connect(wagmiConfig, { connector: connector })}>
                  <>
                    <img src={'/src/assets/wallets/metamask.svg'} alt="Metamask" />
                    <span className="text-black">{connector()?.name}</span>
                  </>
                </Button>
              ))
            }
            {/*<Button className="gap-4 !w-full" classType="transparent" onClick={() => console.log('asdasd')}>*/}
            {/*  <>*/}
            {/*    <img src={metamask} alt="Metamask" />*/}
            {/*    <span className="text-black">MetaMask</span>*/}
            {/*  </>*/}
            {/*</Button>*/}
            {/*<Button className="gap-4 !w-full" classType="transparent">*/}
            {/*  <>*/}
            {/*    <img src={walletconnect} alt="WalletConnect" />*/}
            {/*    <span className="text-black">WalletConnect</span>*/}
            {/*  </>*/}
            {/*</Button>*/}
          </div>
        </div>
      </div>
    </div>
  )
}
