import { createBrowserRouter } from "react-router-dom";
import { ConnectWallet, Timeline } from "../../pages";
import PageLayout from "../../layout/PageLayout";

export const TIMELINE_PATH: string = '/';
export const CONNECT_WALLET_PATH: string = '/wallet';

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
