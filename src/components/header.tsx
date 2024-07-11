import { Link, useNavigate } from "react-router-dom";
import useSessionStore from "../stores/session";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { searchTracks } from "../api/spotify";

export default function Header() {
  const navigate = useNavigate();
  const { session, setSession } = useSessionStore();
  const [word, setWord] = useState();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    checkAuth();
  }, []);
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setSession(false);
  };
  const onSearch = (e) => {
    setWord(e.currentTarget.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    navigate(`/search/${word}`);
  };
  return (
    <div className="flex justify-between p-5 z-[9999] sticky top-0 bg-white">
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="transition-all w-5 h-5 flex items-center justify-center p-4  hover:rounded-full hover:bg-orange-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="transition-all w-5 h-5 flex items-center justify-center p-4  hover:rounded-full hover:bg-orange-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className="flex relative justify-center items-center">
        <div className="absolute left-3">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <form onSubmit={onSubmit}>
          <input
            onChange={onSearch}
            className="pl-9 border focus:outline-none p-1 w-[500px] rounded-3xl"
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
              <div className="border font-bold transition-all hover:text-white hover:bg-orange-400 rounded-3xl py-2 px-3">
                가입하기
              </div>
            </Link>
            <Link to="/login">
              <div className="border font-bold transition-all hover:text-white hover:bg-orange-400 rounded-3xl py-2 px-3">
                로그인하기
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
