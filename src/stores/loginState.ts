import { create } from "zustand";

const useLoginStateStore = create((set) => ({
  loginState: false,
  setLoginState: (state: boolean) => set({ loginState: state }),
}));

export default useLoginStateStore;
