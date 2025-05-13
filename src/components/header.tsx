import { Link, useNavigate } from "react-router-dom";
import useSessionStore from "../stores/session";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const navigate = useNavigate();
  const { session, setSession } = useSessionStore();
  const [word, setWord] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setSession(data.session);
    };
    checkAuth();
  }, []);
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWord(e.currentTarget.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current?.blur();

    navigate(`/search/${word}`);
  };
  return (
    <>
      <div className="flex items-center sm:hidden col-span-3 mx-2 ">
        <div>
          <Link to={"/"}>
            <img
              className="w-10"
              src="/images/3-removebg-preview.png"
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex relative justify-center items-center mx-auto ml-2">
          <div className="group flex items-center ">
            <div className="fixed inset-0 bg-black opacity-0 transition-opacity duration-300 pointer-events-none sm:group-hover:opacity-50 sm:group-focus-within:opacity-50"></div>

            <form className="relative" onSubmit={onSubmit}>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 ">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
              <input
                ref={inputRef}
                onChange={onSearch}
                className="w-full transition-transform duration-300 ease-in-out sm:hover:scale-[1.5] sm:focus:scale-[1.5] shadow-[0px_0px_10px_5px_rgba(0,_0,_0,_0.1)] focus:outline-none p-1 pl-9 rounded-3xl
                 "
                type="text"
              />
            </form>
          </div>
        </div>
        <div className="text-white ">
          <FontAwesomeIcon
            className="text-2xl"
            icon={faBars}
            onClick={() => setOpenMenu(true)}
          />
        </div>
        {openMenu && (
          <div className="z-50 fixed top-0 left-0 w-full h-full bg-purple-700 text-white flex flex-col gap-5 p-5 pl-10">
            <div className="flex justify-end">
              <FontAwesomeIcon
                className="text-2xl"
                icon={faXmark}
                onClick={() => setOpenMenu(false)}
              />
            </div>
            <Link to="/login">
              <div className="font-bold text-xl">로그인하기</div>
            </Link>
            <Link to="/create-account">
              <div className="font-bold text-xl">가입하기</div>
            </Link>
          </div>
        )}
      </div>
      <div className="hidden justify-center sm:flex">
        <Link
          to={"/"}
          className=""
          style={{ clipPath: "circle(33.9% at 50% 50%)" }}
        >
          <img
            className="w-20"
            src="/images/3-removebg-preview.png"
            alt="logo"
          />
        </Link>
      </div>
      <div className="hidden sm:flex relative justify-center items-center">
        <div className="group flex items-center ">
          <div className="fixed inset-0 bg-black opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-50 group-focus-within:opacity-50"></div>

          <form className="relative" onSubmit={onSubmit}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 ">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <input
              ref={inputRef}
              onChange={onSearch}
              className="w-full transition-transform duration-300 ease-in-out hover:scale-[2] focus:scale-[2] shadow-[0px_0px_10px_5px_rgba(0,_0,_0,_0.1)] focus:outline-none p-1 pl-9 rounded-3xl
                 "
              type="text"
            />
          </form>
        </div>
      </div>
      <div className="hidden sm:flex justify-center gap-2 md:gap-5 items-center">
        {session ? (
          <div
            className="border cursor-pointer font-bold transition-all bg-black text-white border-none hover:bg-gray-600 rounded-lg py-3 px-4"
            onClick={signOut}
          >
            로그아웃
          </div>
        ) : (
          <>
            <Link to="/create-account">
              <div className="border font-bold transition-all bg-black text-white border-none hover:bg-gray-600 rounded-lg py-3 px-4">
                회원가입
              </div>
            </Link>
            <Link to="/login">
              <div className="border font-bold transition-all bg-black text-white border-none hover:bg-gray-600 rounded-lg py-3 px-4">
                로그인
              </div>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
