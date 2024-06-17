import { supabase } from "./supabaseClient";

export async function checkAuth() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
