import { faHouse, faMusic } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
export default function Nav() {
  const [click, setClick] = useState("home");
  const onClick = (menu: string) => {
    setClick(menu);
  };
  return <div className=""></div>;
}
