import { Song } from "@/interfaces/api";
import { Message } from "@arco-design/web-react";
import dayjs from "dayjs";
import { throttle } from "lodash-es";
import { download } from "tauri-plugin-upload-api";
import { create } from "zustand";

export type DownloadQueue = {
  state: "pendding" | "downloading" | "success" | "failed";
  origin: string;
  target: string;
  id: number;
  originSong: Song;
  downloadTime?: number;
  progress: number;
  total: number;
};

let index = 0;

const useDownloadStore = create<{
  tasklist: DownloadQueue[];
  addTask: (id: number, origin: string, target: string, record: Song) => void;
}>((set) => ({
  tasklist: [],
  addTask: (id, origin, target, record) =>
    set((state) => {
      state.tasklist.push({
        id,
        target,
        origin,
        state: "downloading",
        progress: 0,
        total: 0,
        originSong: record,
      });
      setTimeout(() => {
        if (index === state.tasklist.length - 1) {
          run(origin, target);
        }
      }, 1000);
      return { tasklist: state.tasklist.slice(0) };
    }),
}));

const set = throttle(function (tasklist) {
  useDownloadStore.setState({ tasklist: tasklist.slice(0) });
}, 200);

function run(origin: string, target: string) {
  let p = 0;
  let cacheIndex = index;
  download(origin, target, (progress, total) => {
    p += progress;
    let tasklist = useDownloadStore.getState().tasklist;
    let item = tasklist[cacheIndex];
    item.progress = p;
    item.total = total;
    set(tasklist);
  })
    .then(() => {
      let tasklist = useDownloadStore.getState().tasklist;
      let item = tasklist[cacheIndex];
      item.progress = item.total;
      item.state = "success";
      item.downloadTime = dayjs().unix();
      useDownloadStore.setState({ tasklist: tasklist.slice(0) });
      Message.success("下载成功");
    })
    .finally(() => {
      index++;
      let tasklist = useDownloadStore.getState().tasklist;
      if (tasklist[index]) {
        let item = tasklist[index];
        run(item.origin, item.target);
      }
    });
}

export default useDownloadStore;
