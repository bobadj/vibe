import {JSX} from "react";
import {Outlet} from "react-router-dom";
import {Card, Button} from "../../components";
import logoIndigo from './../../assets/logo_indigo.svg';

export default function PageLayout(): JSX.Element {
  return (
    <div className="container-lg h-screen p-6 bg-layout">
      <div className="flex flex-col md:flex-row gap-4 justify-between align-top h-full">
        <div className="sidebar">
          <Card>
            <img src={logoIndigo} alt="" className="w-[50px] h-auto" />
            <Button className="mt-[150px]">Write A Post</Button>
          </Card>
        </div>
        <Card className="container h-full">
          <Outlet />
        </Card>
        <div className="sidebar">
          <Card>
            <Button classType="secondary" disabled>bobadj.eth</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
