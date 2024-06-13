import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import useSessionStore from "../stores/session";

export default function UpdatePassword() {
  const { session } = useSessionStore();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (session) navigate(-1);
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setAuth(session);
      } else {
        navigate(-1);
      }
    });
  }, []);
  const updatePasswordHandler = async () => {
    if (auth) {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (data) {
        alert("Password updated successfully!");
        setPassword("");
        navigate("/login");
      }

      if (error) {
        setError("There was an error updating your password.");
      }
    } else {
      setError("No session found. Please try resetting your password again.");
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length >= 6) {
      updatePasswordHandler();
    } else {
      setError("Password should be at least 6 characters.");
    }
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
  };
  return (
    <div className="w-[400px] flex gap-4 flex-col justify-center">
      <div className="relative rounded-md shadow p-8 pt-10 border border-gray-400 flex gap-4 flex-col justify-center">
        <h1 className="absolute top-0 text-2xl translate-y-[-50%]">
          <span className="px-4 bg-white">비밀번호 변경</span>
        </h1>
        <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
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
            value="비밀번호 변경"
          />
        </form>
      </div>
    </div>
  );
}
