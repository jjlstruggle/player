import { create } from "zustand";

const useDownloadStore = create<{
  downloadList: Array<{
    state: "pendding" | "downloading" | "success" | "failed";
    origin: string;
    target: string;
    id: number;
  }>;
  pushlist: (id: number, origin: string, target: string) => void;
  setState: (id: number, state: "downloading" | "success" | "failed") => void;
}>((set) => ({
  downloadList: [],
  pushlist: (id, origin, target) =>
    set((state) => {
      state.downloadList.push({
        state: "pendding",
        origin,
        target,
        id,
      });
      return {
        downloadList: state.downloadList.slice(0),
      };
    }),
  setState: (id, newState) =>
    set((state) => {
      state.downloadList.find((item) => item.id == id)!.state = newState;
      return {
        downloadList: state.downloadList.slice(0),
      };
    }),
}));

export default useDownloadStore;
