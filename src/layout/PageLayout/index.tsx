import { FC, JSX, useState } from "react";
import { formatAddress } from "../../utils";
import { useAccount, useEnsName } from "wagmi";
import { CONNECT_WALLET_PATH } from "../../router";
import { useIsCurrentChainSupported } from "../../hooks";
import { Outlet, useNavigate, useRouteError } from "react-router-dom";
import { Button, Card, NetworkError, PageError } from "../../components";

import type { OutletContextType } from "../../types";
import { ButtonClassTypes } from "../../types/enum";

import logoIndigo from './../../assets/logo_indigo.svg';

const PageLayout: FC = (): JSX.Element => {
  const navigate = useNavigate();
  const error = useRouteError() as { status: string|number, statusText: string };
  const { isConnected, address } = useAccount();
  const isChainSupported = useIsCurrentChainSupported();

  const [ showPostForm, setShowPostForm ] = useState<boolean>();
  
  const { data: ensName } = useEnsName({ address });

  return (
    <div className="container-lg h-screen p-6 bg-layout">
      <div className="flex flex-col md:flex-row gap-4 justify-between align-top h-full">
        <div className="sidebar">
          <Card>
            <img src={logoIndigo} alt="" className="w-[50px] h-auto" />
            <Button className="mt-[150px]"
                    onClick={() => setShowPostForm(true)}
                    disabled={!isConnected || !isChainSupported || !!error}>
              Write A Post
            </Button>
          </Card>
        </div>
        <Card className="container h-fit">
          {
            error
              ?
              <PageError status={error?.status} content={error?.statusText} />
              :
              isChainSupported
                ?
                <Outlet context={{ showPostForm, setShowPostForm } as OutletContextType} />
                :
                <NetworkError />
          }
        </Card>
        <div className="sidebar">
          <Card>
            <Button className="!opacity-100"
                    classType={ButtonClassTypes.secondary}
                    disabled={isConnected}
                    onClick={() => navigate(CONNECT_WALLET_PATH)}>
              {(ensName || address) ? ensName || formatAddress(address) : 'Connect wallet'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PageLayout;