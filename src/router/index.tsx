import { createBrowserRouter } from "react-router-dom";
import { ConnectWallet, Feed, Profile } from "../pages";
import PageLayout from "../layout/PageLayout";

export const FEED_PATH: string = '/';
export const PROFILE_PAGE: string = '/feed/:address'
export const CONNECT_WALLET_PATH: string = '/wallet';

export const router = () => {
  return createBrowserRouter([
    {
      element: <PageLayout />,
      errorElement: <PageLayout />,
      children: [
        {
          path: FEED_PATH,
          element: <Feed />
        },
        {
          path: PROFILE_PAGE,
          element: <Profile />
        }
      ]
    },
    {
      path: CONNECT_WALLET_PATH,
      element: <ConnectWallet />
    }
  ]);
};
