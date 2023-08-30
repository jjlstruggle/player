import axios from "axios";
import axiosTauriApiAdapter from "axios-tauri-api-adapter";
import useUserStore from "@/store/user";
import { fetch } from "@tauri-apps/api/http";
import {
  NewMusic,
  Recommend,
  Mv,
  Privatecontent,
  Playlist,
  Song,
  User,
  Suggest,
} from "@/interfaces/api";

axios.defaults.adapter = axiosTauriApiAdapter;
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:3000",
});

export const anonimousToken = () =>
  fetch<{ cookie: string }>("http://localhost:3000/register/anonimous");

export const getTodayRecommend = () =>
  client.get<{ recommend: Recommend[] }>("/recommend/resource");

export const getNewMusic = () =>
  client.get<{ result: NewMusic[] }>("/personalized/newsong", {
    params: {
      limit: 12,
    },
  });

export const getMvRecommend = () =>
  client.get<{ result: Mv[] }>("/personalized/mv");

export const getPrivatecontent = () =>
  client.get<{ result: Privatecontent[] }>(
    "/personalized/privatecontent/list",
    {
      params: { limit: 4 },
    }
  );

export const getPlaylist = (id: number) =>
  client.get<{ playlist: Playlist }>("/playlist/detail", {
    params: { id, noCookie: true },
  });

export const getMusicInfo = (ids: string) =>
  client.get<{ songs: Song[] }>("/song/detail", {
    params: { ids, noCookie: true },
  });

export const getMusicUrl = (id: number) =>
  client.get("/song/url", { params: { id } });

export const getCatlist = () =>
  client.get<{
    categories: Record<number, string>;
    sub: { name: string; category: number }[];
  }>("/playlist/catlist", { params: { noCookie: true } });

export const getSquare = (cat: string, offset: number) =>
  client.get<{ total: number; playlists: Playlist[] }>("/top/playlist", {
    params: {
      cat,
      limit: 80,
      offset: offset * 80,
      noCookie: true,
    },
  });

export const login = (
  account: string,
  password: string,
  type: "phone" | "captcha" | "email"
) => {
  if (type === "phone") {
    return client.post<User>(
      "/login/cellphone",
      {},
      {
        params: {
          phone: account,
          password,
          noCookie: true,
        },
      }
    );
  } else if (type === "captcha") {
    return client.post<User>(
      "/login/cellphone",
      {},
      {
        params: {
          phone: account,
          captcha: password,
          noCookie: true,
        },
      }
    );
  } else {
    return client.post<User>(
      "/login",
      {},
      {
        params: {
          email: account,
          password,
          noCookie: true,
        },
      }
    );
  }
};

export const loginStatus = () => client.get<{ data: User }>("/login/status");

export const getUserPlaylist = (uid: number) =>
  client.get<{ playlist: Playlist[] }>("/user/playlist", {
    params: { uid, noCookie: true },
  });

export const getMusicLyric = (id: number) =>
  client.get<{ lrc: { lyric: string }; klyric: { lyric: string } }>("/lyric", {
    params: { id, noCookie: true },
  });
export const searchSuggest = (key: string) =>
  client.get<{
    result: Suggest;
  }>("/search/suggest", {
    params: { keywords: key, noCookie: true },
  });

client.interceptors.request.use(function (config) {
  const { cookie } = useUserStore.getState();
  if (config.params) {
    if (!config.params.noCookie) {
      config.params["cookie"] = cookie;
    }
  } else {
    config.params = { cookie };
  }
  return config;
});
