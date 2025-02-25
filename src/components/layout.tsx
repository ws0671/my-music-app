import { Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";
import Nav from "./left-nav";

export default function Layout() {
  return (
    <div className="p-2 grid grid-rows-[auto_auto_auto] grid-cols-[1fr_3fr_1fr] gap-2 bg-purple-700 ">
      <Header />
      <div className="col-span-3 grid grid-cols-[1fr_3fr_1fr] text-white gap-2 ">
        <div className="bg-purple-600">
          <Nav />
        </div>
        <div className="bg-purple-600 px-6">
          <Outlet />
        </div>
        <div className="bg-purple-600"></div>
      </div>
      <Player />
    </div>
  );
}
