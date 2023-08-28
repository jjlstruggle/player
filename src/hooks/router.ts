import { create } from "zustand";

type RouterStore = {
  path: string;
  push: (path: string, params?: any) => void;
  params: any;
};

export const useRouterStore = create<RouterStore>((set) => ({
  path: "/",
  push: (newPath: string, params = {}) =>
    set(() => ({ path: newPath, params })),
  params: {},
}));
