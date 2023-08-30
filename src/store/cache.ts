import { Song } from "@/interfaces/api";
import { create } from "zustand";

const useCacheStore = create<{
  pushMusic: (music: Song) => void;
  historyList: Song[];
  initHistory: (music: Song[]) => void;
  levelMusic: (id: number) => void;
}>((set) => ({
  historyList: [],
  pushMusic: (music: Song) =>
    set((state) => {
      let list = state.historyList.slice(0);
      list.unshift(music);
      return {
        historyList: list,
      };
    }),
  initHistory: (list: Song[]) => set(() => ({ historyList: list })),
  levelMusic: (index: number) =>
    set((state) => {
      let clone = state.historyList.slice(0);
      let del = clone.splice(index, 1)[0];
      clone.unshift(del);
      return {
        historyList: clone,
      };
    }),
}));

export default useCacheStore;
