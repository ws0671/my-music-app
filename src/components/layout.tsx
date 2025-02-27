import { Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";
import Nav from "./nav";
import Playlist from "./playlist";

export default function Layout() {
  return (
    <div className="p-2 h-screen grid grid-rows-[auto_1fr_auto] grid-cols-[1fr_3fr_1fr] gap-2 bg-purple-700">
      <div className="bg-purple-700">
        <Header />
      </div>
      <div className="bg-purple-600">
        <Nav />
      </div>
      <div className="">
        <div className="bg-purple-600 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </div>
      <div className="bg-purple-600">{/* <Playlist /> */}</div>
      <div className="bg-purple-700 col-span-3">
        <Player />
      </div>
    </div>
  );
}
