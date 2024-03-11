import { JSX } from "react";
import { Chain } from "viem/chains";
import { Button } from "../../components";
import { useSwitchChain } from "wagmi";

export default function NetworkError(): JSX.Element {
  const { chains, switchChain } = useSwitchChain();
  
  const getSupportedNetworksName = () => chains
    .map( (chain: Chain) => chain.name )
    .join(', ');
  
  return (
    <div className="flex flex-col w-full items-center gap-8 py-5">
      <p className="text-muted">This app supports {getSupportedNetworksName()}. You are currently connected to an unsupported network.</p>
      {chains.map( (chain: Chain) => (
        <Button key={chain.id}
                onClick={() => switchChain({ chainId: chain.id })}>
          {chain?.name}
        </Button>
      ))}
      <p className="text-xs text-muted mt-4">You may need to manually switch network via your wallet.</p>
    </div>
  )
}
