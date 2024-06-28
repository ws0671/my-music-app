import { Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";
import Nav from "./nav";

export default function Layout() {
  return (
    <>
      <div className="grid grid-cols-[1fr_4fr]">
        <Nav />
        <div>
          <Header />
          <Outlet />
        </div>
      </div>
      <Player />
    </>
  );
}
