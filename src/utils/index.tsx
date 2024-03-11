import { createBrowserRouter } from "react-router-dom";
import { ConnectWallet, Timeline } from "../pages";
import { createConfig, http } from "wagmi";
import { Chain, sepolia } from "viem/chains";
import { injected, walletConnect } from 'wagmi/connectors'
import PageLayout from "../layout/PageLayout";

export const TIMELINE_PATH: string = '/';
export const CONNECT_WALLET_PATH: string = '/wallet';

export type CallbackFunction = (...args: never[]) => void;

export const router = () => {
  return createBrowserRouter([
    {
      element: <PageLayout />,
      children: [
        {
          path: TIMELINE_PATH,
          element: <Timeline />
        }
      ]
    },
    {
      path: CONNECT_WALLET_PATH,
      element: <ConnectWallet />
    }
  ]);
};

export const debounce = (callback: CallbackFunction, wait: number = 300) => {
  let timeoutId: any;
  return (...args: never[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

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

export const formatAddress = (account: string|null|undefined) => {
  const acc = account || '';
  return acc.substring(0, 6) + '...' + acc.substring(acc.length - 4)
};

