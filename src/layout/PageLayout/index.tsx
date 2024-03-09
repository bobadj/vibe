import {JSX} from "react";
import {Outlet} from "react-router-dom";

export default function PageLayout(): JSX.Element {
  return (
    <div className="container-lg h-screen p-6 bg-layout">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <h2>Submit post card</h2>
        <div className="page__content">
          <Outlet />
        </div>
        <h2>Username card</h2>
      </div>
    </div>
  )
}
