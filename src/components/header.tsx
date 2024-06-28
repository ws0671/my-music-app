import { Link, useNavigate } from "react-router-dom";
import useSessionStore from "../stores/session";
import { useEffect } from "react";
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
  return (
    <div className="flex justify-between p-5 sticky top-0 bg-white">
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-5 h-5 flex items-center justify-center p-4  hover:rounded-full hover:bg-orange-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-5 h-5 flex items-center justify-center p-4  hover:rounded-full hover:bg-orange-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className="flex relative justify-center items-center">
        <div className="absolute left-3">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
        <div>
          <input
            className="pl-9 border focus:outline-none p-1 w-[500px] rounded-3xl"
            type="text"
          />
        </div>
      </div>
      <div className="flex justify-center gap-5 items-center">
        {session ? (
          <div
            className="border bg-black font-bold text-white rounded-3xl py-2 px-3"
            onClick={signOut}
          >
            로그아웃
          </div>
        ) : (
          <>
            <Link to="/create-account">
              <div className="border font-bold hover:text-white hover:bg-orange-400 rounded-3xl py-2 px-3">
                가입하기
              </div>
            </Link>
            <Link to="/login">
              <div className="border font-bold hover:text-white hover:bg-orange-400 rounded-3xl py-2 px-3">
                로그인하기
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
