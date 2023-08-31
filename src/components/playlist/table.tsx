import {
  Dropdown,
  Menu,
  Message,
  Table,
  TableColumnProps,
} from "@arco-design/web-react";
import { useMemo, useRef, useState } from "react";
import { IconHeart, IconHeartFill } from "@arco-design/web-react/icon";
import { useRequest } from "ahooks";
import { Playlist, Song } from "@/interfaces/api";
import { parseIndex, parseTimeToString } from "@/utils";
import { getMusicInfo, getMusicUrl, like } from "@/apis";
import useMusicStore from "@/store/music";
import useUserStore from "@/store/user";

function PlaylistTable({ playlist }: { playlist: Playlist }) {
  const { listlist, setLikelist } = useUserStore();
  const [expand, setExpand] = useState(false);
  const selectMusic = useRef<Song>();

  const columns: TableColumnProps[] = [
    {
      title: "操作",
      width: 120,
      render(col, item: Song, index) {
        return (
          <div className="flex items-center">
            <div className="mr-2">{parseIndex(index + 1)}</div>
            {listlist.includes(item.id) ? (
              <IconHeartFill
                className="mx-2 cursor-pointer text-red-600"
                onClick={() => {
                  like(item.id, false).then(({ data }) => {
                    if (data.code == 200) {
                      Message.success("取消喜欢成功");
                      setLikelist(listlist.filter((id) => id != item.id));
                    } else {
                      Message.warning("取消喜欢失败");
                    }
                  });
                }}
              />
            ) : (
              <IconHeart
                className="mx-2 cursor-pointer"
                onClick={() => {
                  like(item.id).then(({ data }) => {
                    if (data.code == 200) {
                      Message.success("喜欢成功");
                      listlist.push(item.id);
                      setLikelist(listlist.slice(0));
                    } else {
                      Message.warning("喜欢失败");
                    }
                  });
                }}
              />
            )}
          </div>
        );
      },
    },
    {
      title: "曲名",
      dataIndex: "name",
      ellipsis: true,
    },
    {
      title: "歌手",
      dataIndex: "ar",
      ellipsis: true,
      width: 100,
      render(col: any[]) {
        return col.map((ar) => ar.name).join(" / ");
      },
    },
    {
      title: "专辑",
      dataIndex: "al.name",
      ellipsis: true,
      width: 200,
    },
    {
      title: "时间",
      dataIndex: "dt",
      width: 100,
      render(col) {
        return parseTimeToString(col / 1000);
      },
    },
  ];
  let ids = useMemo(
    () => playlist.trackIds.map((item) => item.id).join(","),
    [playlist.id]
  );
  const { setPlayingMusic, setMusicList, audio } = useMusicStore();
  const { loading, data } = useRequest(() => getMusicInfo(ids));
  const music = loading ? [] : data?.data.songs!;

  const droplist = expand ? (
    <Menu
      // @ts-ignore
      onClickMenuItem={(key: "play" | "download") => {
        if (key === "download") {
          console.log(selectMusic);
        }
      }}
    >
      <Menu.Item key="play">立即播放</Menu.Item>
      <Menu.Item key="download">下载单曲</Menu.Item>
    </Menu>
  ) : null;

  return (
    <Dropdown
      onVisibleChange={(v) => {
        if (!v) {
          setExpand(false);
        }
      }}
      trigger="contextMenu"
      position="bl"
      droplist={droplist}
    >
      <div className="h-full pb-2">
        <Table
          size="small"
          scroll={{ y: 500, x: false }}
          columns={columns}
          loading={loading}
          data={music}
          pagination={false}
          virtualized={true}
          onRow={(record: Song) => ({
            onDoubleClick: async function () {
              let urlInfo = await getMusicUrl(record.id);
              setPlayingMusic(record);
              setMusicList(music);
              audio.src = urlInfo.data.data[0].url;
              audio.play();
            },
            onContextMenu() {
              selectMusic.current = record;
              setExpand(true);
            },
          })}
        />
      </div>
    </Dropdown>
  );
}

export default PlaylistTable;
