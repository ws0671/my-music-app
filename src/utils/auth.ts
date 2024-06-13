import { supabase } from "./supabaseClient";

export async function checkAuth() {
  const user = supabase.auth.getSession();
  const session = (await user).data.session;
  return session;
}
