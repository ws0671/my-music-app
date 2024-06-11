import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { Form, redirect } from "react-router-dom";

const supabase = createClient(
  "https://ayrqfhuebatobjierkyu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cnFmaHVlYmF0b2JqaWVya3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc3NTQ1MDcsImV4cCI6MjAzMzMzMDUwN30.GysEdNw_lxaOeCoqIm1BVvCoLjpUEldCGZ-bcA2Jc2Q"
);

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const oAuthLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:5173/",
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
        emailRedirectTo: "http://localhost:5173/",
        data: {
          name,
        },
      },
    });

    if (error) console.log(error);
    if (error !== null) setError(error.message);
    console.log(data);
  };

  return (
    <div className="w-[400px] flex gap-4 flex-col justify-center">
      <div className="relative rounded-md shadow p-8 pt-10 border border-gray-400 flex gap-4 flex-col justify-center">
        <h1 className="absolute top-0 text-2xl translate-y-[-50%]">
          <span className="px-4 bg-white">회원가입</span>
        </h1>
        <button className="border px-4 py-2 rounded shadow">
          구글로 계속하기
        </button>
        <button
          onClick={oAuthLogin}
          className="border px-4 py-2 rounded shadow"
        >
          깃허브로 계속하기
        </button>
        <button className="border px-4 py-2 rounded shadow">
          카카오로 계속하기
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
            type="text"
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
            type="text"
            name="password"
            value={password}
            placeholder="비밀번호"
            required
          />
          <input
            className="px-4 py-2 hover:cursor-pointer hover:bg-orange-300 text-white bg-orange-400 rounded"
            type="submit"
            value="가입하기"
          />
        </form>
        {error !== "" ? <h1>{error}</h1> : null}
      </div>
    </div>
  );
}
