import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Nav() {
  const [dropdown, setDropdown] = useState(false);
  const handleDropdown = () => {
    setDropdown((prev) => !prev);
    console.log(dropdown);
  };

  return (
    <div
      className="
         px-4  transition-shadow duration-300  font-bold text-white"
    >
      <div className="flex justify-between py-[18px]">
        <div className="">라이브러리</div>
        <div
          className="bg-purple-600 px-3 py-1 grid place-content-center rounded-full text-sm cursor-pointer hover:bg-purple-500"
          onClick={handleDropdown}
        >
          <FontAwesomeIcon
            icon={faPlus}
            className={`transform transition-transform duration-300 ${
              dropdown ? "rotate-45" : "rotate-0"
            }`}
          />
        </div>
      </div>

      <div>
        <div className="flex gap-3">
          <div className="">
            <img
              className="w-12 h-12 rounded-full"
              src="https://i.scdn.co/image/ab67616d00001e02922c02b3c6df73287798bf0d"
              alt=""
            />
          </div>
          <div className="">
            <div>내 플레이리스트</div>
            <div className="text-sm text-gray-400">
              플레이리스트·yeongmin lee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
