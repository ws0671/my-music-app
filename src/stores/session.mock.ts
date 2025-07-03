import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface ISessionStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const useMockSessionStore = create<ISessionStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));

export default useMockSessionStore;
