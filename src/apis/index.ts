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
} from "@/interfaces/api";

const client = axios.create({
  adapter: axiosTauriApiAdapter,
  baseURL: "http://localhost:3000",
  withCredentials: true,
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
  client.get<{ playlist: Playlist }>("/playlist/detail", { params: { id } });

export const getMusicInfo = (ids: string) =>
  client.get<{ songs: Song[] }>("/song/detail", { params: { ids } });

export const getMusicUrl = (id: number) =>
  client.get("/song/url", { params: { id } });

export const getCatlist = () =>
  client.get<{
    categories: Record<number, string>;
    sub: { name: string; category: number }[];
  }>("/playlist/catlist");

export const getSquare = (cat: string, offset: number) =>
  client.get<{ total: number; playlists: Playlist[] }>("/top/playlist", {
    params: {
      cat,
      limit: 80,
      offset: offset * 80,
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
        },
      }
    );
  }
};

export const getUserPlaylist = (uid: number) =>
  client.get<{ playlist: Playlist[] }>("/user/playlist", { params: { uid } });

export const getMusicLyric = (id: number) =>
  client.get<{ lrc: { lyric: string }; klyric: { lyric: string } }>("/lyric", {
    params: { id, noCookie: true },
  });

client.interceptors.request.use(function (config) {
  return new Promise((resolve) => {
    const { cookie, setCookie } = useUserStore.getState();
    if (cookie) {
      if (config.params) {
        if (!config.params.noCookie) {
          config.params["cookie"] = cookie;
        }
      } else {
        config.params = { cookie };
      }
      resolve(config);
    } else {
      anonimousToken()
        .then(({ data }) => {
          setCookie(data.cookie);
          if (config.params) {
            config.params["cookie"] = cookie;
          } else {
            config.params = { cookie };
          }
        })
        .finally(() => {
          resolve(config);
        });
    }
  });
});
