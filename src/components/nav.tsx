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
    <div className="">
      <Link className="block w-14 mt-10" to={"/"}></Link>
      <Link to={"/"}>
        <div
          onClick={() => onClick("home")}
          className={
            click === "home"
              ? "text-purple-400 mt-5 text-xl font-bold hover:text-purple-400 transition-all"
              : "mt-5 text-xl font-bold hover:text-purple-400 transition-all"
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
              ? "text-purple-400 mt-5 text-xl font-bold hover:text-purple-400 transition-all"
              : "mt-5 text-xl font-bold hover:text-purple-400 transition-all"
          }
        >
          <FontAwesomeIcon icon={faMusic} />
          <span className="ml-4">미정</span>
        </div>
      </Link>
    </div>
  );
}
