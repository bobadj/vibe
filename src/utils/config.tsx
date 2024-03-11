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

export type AddressMap = {
  [chainId: number]: string
}

export const contractAddresses: AddressMap = {
  [sepolia.id]: '0x53Ca39179b1E0fC4C921331225EcE62b2973cE7b'
}
