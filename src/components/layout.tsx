import { Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";
import Nav from "./nav";
import Playlist from "./playlist";
import { useState } from "react";

export default function Layout() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className=" p-2 h-dvh grid grid-rows-[auto_1fr_auto] grid-cols-3 lg:grid-cols-[1fr_4fr_1fr] gap-2 bg-purple-800">
      <Header />
      <div className="bg-purple-700 sm:block hidden">
        <Nav />
      </div>
      <div className="bg-purple-700 sm:col-span-1 col-span-3 text-white custom-scrollbar">
        <Outlet />
      </div>
      <Playlist isOpen={isOpen} />

      <Player setIsOpen={setIsOpen} />
    </div>
  );
}
