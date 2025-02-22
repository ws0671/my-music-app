import { faHouse, faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function Nav() {
  const [click, setClick] = useState("home");
  const onClick = (menu: string) => {
    setClick(menu);
  };
  return (
    <div className="ml-10 space-y-3 sticky top-0 h-[100vh]">
      <Link className="block w-52 rounded-full mt-10" to={"/"}>
        <img
          className="rounded-full"
          src="/images/Honey-removebg-preview.png"
          alt="logo"
        />
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
          <span className="ml-4">미정</span>
        </div>
      </Link>
    </div>
  );
}
