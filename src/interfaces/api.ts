export interface Recommend {
  name: string;
  id: number;
  createTime: number;
  picUrl: string;
}

export interface NewMusic {
  name: string;
  id: number;
  createTime: number;
  picUrl: string;
  song: {
    artists: { name: string }[];
  };
}

export interface Mv {
  artistName: string;
  copywriter: string;
  id: number;
  name: string;
  picUrl: string;
}

export interface Privatecontent {
  copywriter: string;
  id: number;
  name: string;
  picUrl: string;
}

export interface Playlist {
  id: number;
  name: string;
  coverImgUrl: string;
  createTime: number;
  updateTime: number;
  trackCount: number;
  playCount: number;
  subscribedCount: number;
  description: string;
  tags: Array<string>;
  subscribed: false;
  creator: {
    avatarUrl: string;
    userId: number;
    nickname: string;
    description: string;
    backgroundUrl: string;
  };
  trackIds: { id: number }[];
  shareCount: number;
  commentCount: number;
}

export interface Al {
  id: number;
  name: string;
  picUrl: string;
  tns: string[];
}

export interface Ar {
  id: number;
  name: string;
}

export interface Quqlity {
  br: number;
  size: number;
}

export interface Song {
  name: string;
  id: number;
  al: Al;
  ar: Ar[];
  dt: number;
  h?: Quqlity;
  hr?: Quqlity;
  l?: Quqlity;
  m?: Quqlity;
  sq?: Quqlity;
  tns: string[];
}

export interface User {
  cookie: string;
  token: string;
  profile: {
    avatarUrl: string;
    nickname: string;
  };
  account: { id: number; userName: string };
}
