import { useRouterStore } from "@/hooks/router";
import { Menu, Space } from "@arco-design/web-react";
import {
  IconApps,
  IconDownload,
  IconHome,
  IconSchedule,
  IconTiktokColor,
} from "@arco-design/web-react/icon";
import { useState } from "react";
import { WebviewWindow, appWindow } from "@tauri-apps/api/window";
import useUserStore from "@/store/user";
import { useAsyncEffect, useRequest } from "ahooks";
import { getUserPlaylist } from "@/apis";
import { invoke } from "@tauri-apps/api";
import { getStore } from "@/utils/store";
import useCacheStore from "@/store/cache";
import { isNull } from "lodash-es";
import { Song } from "@/interfaces/api";

function Sider() {
  const { path, push, params } = useRouterStore();
  const { userInfo, isAnonimous } = useUserStore();
  const { initHistory } = useCacheStore();
  const [isMaximize, setIsMaximize] = useState(false);

  const { data, loading } = useRequest(
    () => getUserPlaylist(userInfo?.account.id!),
    {
      ready: !isAnonimous,
      refreshDeps: [isAnonimous],
    }
  );

  const list = loading ? [] : data?.data.playlist!;

  let selectKeys = path.startsWith("/playlist") ? path + "?" + params : path;

  useAsyncEffect(async () => {
    let store = await getStore();
    appWindow.onCloseRequested(async () => {
      await invoke("detach");
      let history = useCacheStore.getState().historyList;
      await store.set("music-history", history);
      await store.save();
      await WebviewWindow.getByLabel("wallpaper")!.close();
    });
    const history = await store.get<Song[]>("music-history");
    if (isNull(history)) {
      store.set("music-history", []);
      initHistory([]);
    } else {
      initHistory(history);
    }
  }, []);

  return (
    <>
      <div
        data-tauri-drag-region
        className="titlebar h-16 flex items-center select-none px-10"
      >
        <Space size="medium">
          <div
            className="w-4 h-4 rounded-full cursor-pointer bg-[#fd6458]"
            onClick={async () => {
              appWindow.close();
            }}
          ></div>
          <div
            className="w-4 h-4 rounded-full cursor-pointer bg-[#ffbf2b]"
            onClick={() => {
              appWindow.minimize();
            }}
          ></div>
          <div
            className="w-4 h-4 rounded-full cursor-pointer bg-[#24cc3d]"
            onClick={() => {
              setIsMaximize(!isMaximize);
              appWindow.toggleMaximize();
            }}
          ></div>
        </Space>
      </div>
      <Menu
        defaultOpenKeys={["my"]}
        selectedKeys={[selectKeys]}
        onClickMenuItem={(key) => {
          if (key.startsWith("/playlist")) {
            let split = key.split("?");
            push(split[0], split[1]);
          } else {
            push(key);
          }
        }}
      >
        <Menu.ItemGroup title="在线音乐">
          <Menu.Item key="/">
            <IconHome />
            音乐馆
          </Menu.Item>
          <Menu.Item key="/square">
            <IconApps />
            歌单广场
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup title="我的音乐">
          <Menu.Item key="/history">
            <IconSchedule />
            播放记录
          </Menu.Item>
          <Menu.Item key="/download">
            <IconDownload />
            本地下载
          </Menu.Item>
        </Menu.ItemGroup>
        <Menu.SubMenu key="my" title="我的歌单">
          {list?.map((playlist) => (
            <Menu.Item key={`/playlist?${playlist.id}`}>
              <IconTiktokColor />
              {playlist.name}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      </Menu>
    </>
  );
}

export default Sider;
