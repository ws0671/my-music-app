import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { checkAuth } from "../utils/auth";
import useSessionStore from "../stores/session";

export default function Home() {
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
    <>
      <h1>Home!</h1>
      {session ? (
        <button onClick={signOut}>logout</button>
      ) : (
        <Link to={"create-account"}>signup</Link>
      )}
    </>
  );
}
