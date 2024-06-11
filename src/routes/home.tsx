import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const supabase = createClient(
  "https://ayrqfhuebatobjierkyu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5cnFmaHVlYmF0b2JqaWVya3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc3NTQ1MDcsImV4cCI6MjAzMzMzMDUwN30.GysEdNw_lxaOeCoqIm1BVvCoLjpUEldCGZ-bcA2Jc2Q"
);

export default function Home() {
  const [loginState, setLoginState] = useState(false);
  const checkLogin = async () => {
    const { data, error } = await supabase.auth.getSession();
    const session = data.session;
    session !== null ? setLoginState(true) : setLoginState(false);
    console.log(session);
  };
  useEffect(() => {
    checkLogin();
  }, [loginState]);
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setLoginState(false);
  };
  return (
    <>
      <h1>Home!</h1>
      {loginState ? (
        <button onClick={signOut}>logout</button>
      ) : (
        <Link to={"create-account"}>signup</Link>
      )}
    </>
  );
}
