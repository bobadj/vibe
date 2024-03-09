import {createBrowserRouter} from "react-router-dom";
import {ConnectWallet, Timeline} from "../pages";

export const TIMELINE_PATH: string = '/';
export const CONNECT_WALLET_PATH: string = '/wallet';

export const router = () => {
  return createBrowserRouter([
    {
      path: TIMELINE_PATH,
      element: <Timeline />,
    },
    {
      path: CONNECT_WALLET_PATH,
      element: <ConnectWallet />
    }
  ]);
};
