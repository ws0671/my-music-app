import { Link, Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";
import { faHouse, faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Layout() {
  const [click, setClick] = useState("");
  const onClick = (menu: string) => {
    setClick(menu);
  };
  return (
    <>
      <div className="grid grid-cols-[1fr_4fr]">
        <div className="ml-10 space-y-3 sticky top-0 h-[100vh]">
          <Link to={"/"}>
            <div className="">
              <img src="/images/Honey.png" alt="logo" />
            </div>
          </Link>
          <Link to={"/"}>
            <div
              onClick={() => onClick("home")}
              className={
                click === "home"
                  ? "text-orange-400 mt-5 text-xl font-bold hover:text-orange-400 transition-all"
                  : "mt-5 text-xl font-bold hover:text-orange-400 transition-all"
              }
            >
              <FontAwesomeIcon icon={faHouse} />
              <span className="ml-4 ">홈</span>
            </div>
          </Link>
          <Link to={"/playlist"}>
            <div
              onClick={() => onClick("playlist")}
              className={
                click === "playlist"
                  ? "text-orange-400 mt-5 text-xl font-bold hover:text-orange-400 transition-all"
                  : "mt-5 text-xl font-bold hover:text-orange-400 transition-all"
              }
            >
              <FontAwesomeIcon icon={faMusic} />
              <span className="ml-4">Honey 플레이리스트</span>
            </div>
          </Link>
        </div>
        <div>
          <Header />
          <Outlet />
        </div>
      </div>
      <Player />
    </>
  );
}
