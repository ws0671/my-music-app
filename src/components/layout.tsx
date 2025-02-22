import { Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";
import Nav from "./left-nav";

export default function Layout() {
  return (
    <>
      <Header />
      <div className="grid grid-cols-[1fr_4fr_1fr] gap-2 bg-purple-700 text-white">
        <div className="bg-purple-600">
          <Nav />
        </div>
        <div className="bg-purple-600 px-6">
          <Outlet />
        </div>
        <div className="bg-purple-600"></div>
      </div>
      <Player />
    </>
  );
}
