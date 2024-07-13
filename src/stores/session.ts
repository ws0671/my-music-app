import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface User {
  app_metadata: string[];
  aud: string;
  confirmed_at: string;
  created_at: string;
  email: string;
  email_confirmed_at: string;
  id: string;
  identities: string[];
  is_anonymous: boolean;
  last_sign_in_at: string;
  phone: string;
  recovery_sent_at: string;
  role: string;
  updated_at: string;
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    preferred_username: string;
    provider_id: string;
    sub: string;
    user_name: string;
  };
}
interface ISession<T> {
  access_token: string;
  expires_at?: number | undefined;
  expires_in: number;
  provider_token?: string | null | undefined;
  refresh_token: string;
  token_type: string;
  user: User;
}
interface ISessionStore {
  session: Session | null;

  setSession: (state: Session | null) => void;
}
const useSessionStore = create(
  persist<ISessionStore>(
    (set) => ({
      session: null,
      setSession: (state) => set({ session: state }),
    }),
    {
      name: "session-storage", // 저장소의 이름
      getStorage: () => localStorage, // 로컬 스토리지에 저장
    }
  )
);

export default useSessionStore;
