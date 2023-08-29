import { Song } from "@/interfaces/api";
import { create } from "zustand";

const audio = new Audio();
audio.crossOrigin = "anonymous";

const useMusicStore = create<{
  audio: HTMLAudioElement;
  playIngMusic?: Song;
  setPlayingMusic: (music: Song) => void;
  setMusicList: (list: Song[]) => void;
  musicList: Song[];
}>((set) => ({
  audio,
  playIngMusic: undefined,
  setPlayingMusic: (music) => set(() => ({ playIngMusic: music })),
  setMusicList: (list) => set(() => ({ musicList: list })),
  musicList: [],
}));

export default useMusicStore;
