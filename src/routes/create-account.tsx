import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Provider } from "@supabase/supabase-js";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { RiKakaoTalkFill } from "react-icons/ri";
import useSessionStore from "./../stores/session";

export default function CreateAccount() {
  const { session } = useSessionStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (session) navigate(-1);
  }, []);
  const oAuthLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const provider = target.name as Provider;
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: "https://my-music-app-eta.vercel.app/",
      },
    });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "email") {
      setEmail(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: "https://my-music-app-eta.vercel.app/",
      },
    });

    if (error !== null) setError(error.message);
    if (data.session) navigate("/");
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="w-[400px] flex gap-4 flex-col justify-center">
        <div className="relative rounded-md shadow p-8 pt-10 border border-gray-400 flex gap-4 flex-col justify-center">
          <h1 className="absolute top-0 text-2xl translate-y-[-50%]">
            <span className="px-4 bg-white">회원가입</span>
          </h1>
          <button
            name="google"
            onClick={oAuthLogin}
            className="border px-4 py-2 rounded shadow"
          >
            <FontAwesomeIcon icon={faGoogle} size="lg" />
            <span className="ml-3">구글로 계속하기</span>
          </button>
          <button
            name="github"
            onClick={oAuthLogin}
            className="border px-4 py-2 rounded shadow"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
            <span className="ml-3">깃허브로 계속하기</span>
          </button>
          <button
            onClick={oAuthLogin}
            name="kakao"
            className="border px-4 py-2 rounded shadow"
          >
            <RiKakaoTalkFill className="text-2xl inline" />
            <span className="ml-3">카카오로 계속하기</span>
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="border-t border-black w-full"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white text-sm px-2">또는</span>
            </div>
          </div>
          <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
            <input
              className="px-4 py-2 w-full focus:outline-none bg-gray-100 border-solid border rounded"
              onChange={onChange}
              type="email"
              name="email"
              value={email}
              placeholder="이메일"
              required
            />
            <input
              className="px-4 py-2 w-full focus:outline-none bg-gray-100 border-solid border rounded"
              onChange={onChange}
              type="text"
              name="name"
              value={name}
              placeholder="이름"
              required
            />
            <input
              className="px-4 py-2 w-full focus:outline-none bg-gray-100 border-solid border rounded"
              onChange={onChange}
              type="password"
              name="password"
              value={password}
              placeholder="비밀번호"
              required
            />
            {error ? <div className="text-red-500 text-sm">{error}</div> : null}
            <input
              className="px-4 py-2 hover:cursor-pointer hover:bg-orange-300 text-white bg-orange-400 rounded"
              type="submit"
              value="가입하기"
            />
          </form>
          <Link to={"/login"}>
            <div className="text-center text-[13px]">
              <span className="underline">로그인 페이지로 가기</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
