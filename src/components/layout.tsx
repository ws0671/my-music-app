import { Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";
import Nav from "./nav";
import Playlist from "./playlist";

export default function Layout() {
  return (
    <div className="p-2 h-screen grid grid-rows-[auto_1fr_auto] grid-cols-3 lg:grid-cols-[1fr_3fr_1fr] gap-2 bg-purple-700">
      <Header />
      <div className="bg-purple-600 hidden sm:block">
        <Nav />
      </div>
      <div className="bg-purple-600 custom-scrollbar sm:col-span-1 col-span-3 text-white">
        <Outlet />
      </div>
      <Playlist />

      <Player />
    </div>
  );
}
