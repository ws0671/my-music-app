import { Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";
import Nav from "./left-nav";

export default function Layout() {
  return (
    <>
      <div className="grid grid-cols-[1fr_4fr_1fr]">
        <Nav />
        <div className="shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.1)] px-6">
          <Header />
          <Outlet />
        </div>
      </div>
      <Player />
    </>
  );
}
