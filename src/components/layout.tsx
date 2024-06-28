import { Link, Outlet } from "react-router-dom";
import Player from "./player";
import Header from "./header";

export default function Layout() {
  return (
    <>
      <div className="grid grid-cols-[1fr_4fr]">
        <div className="ml-10 space-y-3 sticky top-0 h-[100vh]">
          <div className="mt-5 text-3xl">MY-MUSIC-APP</div>
          <Link to={"/"}>
            <div className="mt-5 text-xl font-bold">홈</div>
          </Link>
          <Link to={"/playlist"}>
            <div className="mt-5 text-xl font-bold">MMA 플레이리스트</div>
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
