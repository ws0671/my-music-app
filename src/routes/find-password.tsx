import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import useSessionStore from "../stores/session";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";

export default function FindPassword() {
  const { session } = useSessionStore();
  const [email, setEmail] = useState("");
  const [error] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate(-1);
  }, []);
  const resetPasswordHandler = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://my-music-app-eta.vercel.app/update-password",
    });

    if (error) {
      setIsLoading(false);
      alert("Please check your email");
      setEmail("");
    }
    if (data) {
      setIsLoading(false);
      alert("이메일을 보냈습니다. 이메일을 확인해주세요.");
      navigate("/login");
    }
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
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
            비밀번호를 초기화합니다. 이메일을 적어주세요.
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

            {isLoading ? (
              <div className="relative">
                <input
                  className="px-4 w-full py-2 pointer-events-none text-white bg-orange-300 rounded"
                  type=""
                  value={""}
                />
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <div className="flex w-full h-full items-center justify-center">
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-black"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <input
                className="px-4  py-2 hover:cursor-pointer hover:bg-orange-300 text-white bg-orange-400 rounded"
                type="submit"
                value="메일 보내기"
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
