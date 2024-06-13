import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import useLoginStateStore from "../stores/loginState";

export default function Home() {
  const { loginState, setLoginState } = useLoginStateStore();
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
