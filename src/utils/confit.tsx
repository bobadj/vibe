import { injected, walletConnect } from "wagmi/connectors";
import { Chain, sepolia } from "viem/chains";
import { createConfig, http } from "wagmi";

export const supportedWallets = [
  injected({ target: 'metaMask' }),
  walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID })
];

export const supportedChains: [Chain, ...Chain[]] = [ sepolia ];

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: supportedWallets,
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/'+import.meta.env.VITE_ALCHEMY_API_KEY),
  },
});
