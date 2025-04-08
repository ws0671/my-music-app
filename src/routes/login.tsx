import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import useSessionStore from "../stores/session";
import { PostgrestError, Provider } from "@supabase/supabase-js";

export default function Login() {
  const { session } = useSessionStore();
  const [email, setEmail] = useState("");
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
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session) navigate("/");
    } catch (error) {
      const postgrestError = error as PostgrestError;

      setError(postgrestError.message);
    }
  };

  return (
    <div className="bg-gradient-to-t from-purple-800 to-purple-600 h-screen text-white font-bold ">
      <div className="flex justify-center pt-3">
        <Link to={"/"}>
          <img
            className="w-16"
            src="/images/3-removebg-preview.png"
            alt="logo"
          />
        </Link>
      </div>
      <div className=" flex justify-center items-center">
        <div className="max-sm:bg-transparent rounded-xl bg-purple-800 mt-6 w-[400px] flex gap-4 flex-col justify-center border border-none">
          <div className="relative  sm:shadow py-6 px-8 flex gap-4 flex-col justify-center">
            <h1 className="text-center text-2xl">
              <div className="px-4 bg-transparent font-bold whitespace-nowrap">
                로그인
              </div>
            </h1>
            <button
              name="google"
              onClick={oAuthLogin}
              className=" rounded-full flex items-center hover:border-white border-purple-400 border px-4 py-2 shadow"
            >
              <img
                src="/images/icon/google.png"
                className="ml-2 w-5 h-5"
                alt=""
              />
              <span className="mr-4 flex justify-center flex-grow">
                구글로 계속하기
              </span>
            </button>
            <button
              name="github"
              onClick={oAuthLogin}
              className="rounded-full flex items-center hover:border-white border-purple-400 border px-4 py-2  shadow"
            >
              <img
                src="/images/icon/github.png"
                className="ml-2 w-5 h-5 bg-white rounded-full"
                alt=""
              />

              <span className="mr-4 flex justify-center flex-grow">
                깃허브로 계속하기
              </span>
            </button>
            <button
              onClick={oAuthLogin}
              name="kakao"
              className="rounded-full flex items-center hover:border-white border-purple-400 border px-4 py-2  shadow"
            >
              <img
                src="/images/icon/kakao-talk.png"
                className="ml-2 w-5 h-5"
                alt=""
              />

              <span className="mr-4 flex justify-center flex-grow">
                카카오로 계속하기
              </span>
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="border-t  border-purple-400 w-full"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent text-sm px-2">또는</span>
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
                type="password"
                name="password"
                value={password}
                placeholder="비밀번호"
                required
              />
              {error ? (
                <div className="text-red-500 text-sm">{error}</div>
              ) : null}
              <input
                className="px-4 py-2 hover:cursor-pointer hover:bg-gray-700 bg-black text-white rounded"
                type="submit"
                value="로그인하기"
              />
            </form>
            <Link to={"/create-account"}>
              <div className="text-center text-[13px]">
                <span className="underline">회원가입 페이지로 가기</span>
              </div>
            </Link>
            <Link to={"/find-password"}>
              <div className="text-center text-[13px]">
                <span className="underline">비밀번호를 잊었나요?</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
