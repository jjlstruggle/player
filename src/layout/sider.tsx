import { useRouterStore } from "@/hooks/router";
import { Menu, Space } from "@arco-design/web-react";
import { IconApps, IconHome, IconSchedule } from "@arco-design/web-react/icon";
import { useState } from "react";
import { appWindow } from "@tauri-apps/api/window";

function Sider() {
  const { path, push } = useRouterStore();
  const [isMaximize, setIsMaximize] = useState(false);

  return (
    <>
      <div
        data-tauri-drag-region
        className="titlebar h-16 flex items-center select-none px-10"
      >
        <Space size="medium">
          <div
            className="w-4 h-4 rounded-full cursor-pointer bg-[#fd6458]"
            onClick={() => {
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
      <Menu selectedKeys={[path]} onClickMenuItem={(key) => push(key)}>
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
        </Menu.ItemGroup>
      </Menu>
    </>
  );
}

export default Sider;
