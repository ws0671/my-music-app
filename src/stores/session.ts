import { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지에 저장
    }
  )
);

export default useSessionStore;
