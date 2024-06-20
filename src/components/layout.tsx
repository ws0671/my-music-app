import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <div className="grid grid-cols-[1fr_4fr]">
        <div className="ml-10 space-y-3 sticky top-0 h-[100vh]">
          <div className="mt-10 text-3xl">MY-MUSIC-APP</div>
          <Link to={"/"}>
            <div className="text-xl font-bold">홈</div>
          </Link>
          <div className="text-xl font-bold">라이브러리</div>
        </div>
        <Outlet />
      </div>
    </>
  );
}
