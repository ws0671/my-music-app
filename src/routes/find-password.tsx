import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import useSessionStore from "../stores/session";
import { useNavigate } from "react-router-dom";

export default function FindPassword() {
  const { session } = useSessionStore();
  const [email, setEmail] = useState("");
  const [error] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate(-1);
  }, []);
  const resetPasswordHandler = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://my-music-app-eta.vercel.app/update-password",
    });

    if (error) {
      alert("Please check your email");
      setEmail("");
    }
    if (data) {
      navigate("/login");
    }
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetPasswordHandler();
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
  };
  return (
    <div className="h-screen flex justify-center">
      <div className="w-[400px] flex gap-4 flex-col justify-center">
        <div className="relative rounded-md shadow p-8 pt-10 border border-gray-400 flex gap-4 flex-col justify-center">
          <h1 className="absolute top-0 text-2xl translate-y-[-50%]">
            <span className="px-4 bg-white">비밀번호 초기화</span>
          </h1>
          <div className="text-sm">
            비밀번호를 초기화합니다. 이메일을 적어주세요!
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
            {error ? <div className="text-red-500 text-sm">{error}</div> : null}
            <input
              className="px-4 py-2 hover:cursor-pointer hover:bg-orange-300 text-white bg-orange-400 rounded"
              type="submit"
              value="메일 보내기"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
