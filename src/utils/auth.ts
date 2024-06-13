import { supabase } from "./supabaseClient";

export async function checkAuth() {
  const user = supabase.auth.getUser();
  return user !== null;
}
