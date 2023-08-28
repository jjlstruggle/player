import { User } from "@/interfaces/api";
import { create } from "zustand";

const useUserStore = create<{
  userInfo: User | null;
  cookie: string;
  isAnonimous: boolean;
  setCookie: (cke: string) => void;
  setUserInfo: (usi: User) => void;
  setIsAnonimous: (i: boolean) => void;
}>((set) => ({
  userInfo: null,
  cookie: "",
  isAnonimous: true,
  setCookie: (cookie) => set(() => ({ cookie })),
  setUserInfo: (userInfo) => set(() => ({ userInfo })),
  setIsAnonimous: (i) => set(() => ({ isAnonimous: i })),
}));

export default useUserStore;
