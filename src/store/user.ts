import { User } from "@/interfaces/api";
import { create } from "zustand";

const useUserStore = create<{
  userInfo: User | null;
  cookie: string;
  isAnonimous: boolean;
  listlist: Array<number>;
  setCookie: (cke: string) => void;
  setUserInfo: (usi: User) => void;
  setIsAnonimous: (i: boolean) => void;
  setLikelist: (ids: number[]) => void;
}>((set) => ({
  userInfo: null,
  cookie: "",
  isAnonimous: true,
  listlist: [],
  setCookie: (cookie) => set(() => ({ cookie })),
  setUserInfo: (userInfo) => set(() => ({ userInfo })),
  setIsAnonimous: (i) => set(() => ({ isAnonimous: i })),
  setLikelist: (ids) => set(() => ({ listlist: ids })),
}));

export default useUserStore;
