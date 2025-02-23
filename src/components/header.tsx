import { Link, useNavigate } from "react-router-dom";
import useSessionStore from "../stores/session";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const navigate = useNavigate();
  const { session, setSession } = useSessionStore();
  const [word, setWord] = useState("");

  useEffect(() => {
    console.log(session);

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

    navigate(`/search/${word}`);
  };
  return (
    <div className="flex justify-evenly p-5 z-[9999] sticky top-0 bg-white">
      <div></div>
      <div className="flex group relative justify-center items-center">
        <div className="fixed inset-0 bg-black opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-50 group-focus-within:opacity-50"></div>

        <div className="absolute left-3">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <form onSubmit={onSubmit}>
          <input
            onChange={onSearch}
            className="transition-transform duration-300 ease-in-out hover:scale-150 shadow-[0px_0px_10px_5px_rgba(0,_0,_0,_0.1)] focus:outline-none p-1 pl-9 rounded-3xl
            absolute top-[50%] hover:top-1/2 hover:left-1/2
                 "
            type="text"
          />
        </form>
      </div>
      <div className="flex justify-center gap-5 items-center">
        {session ? (
          <div
            className="border font-bold transition-all cursor-pointer hover:text-white hover:bg-orange-400 rounded-3xl py-2 px-3"
            onClick={signOut}
          >
            로그아웃
          </div>
        ) : (
          <>
            <Link to="/create-account">
              <div className="border font-bold transition-all hover:text-white hover:bg-orange-400 rounded-lg py-1 px-2">
                회원가입
              </div>
            </Link>
            <Link to="/login">
              <div className="border font-bold transition-all hover:text-white hover:bg-orange-400 rounded-lg py-1 px-2">
                로그인
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
