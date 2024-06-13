import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSessionStore = create(
  persist(
    (set) => ({
      session: false,
      setSession: (state: boolean) => set({ session: state }),
    }),
    {
      name: "session-storage", // 저장소의 이름
      getStorage: () => localStorage, // 로컬 스토리지에 저장
    }
  )
);

export default useSessionStore;
