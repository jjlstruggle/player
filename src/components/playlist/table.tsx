import { Table, TableColumnProps } from "@arco-design/web-react";
import { useMemo } from "react";
import { IconHeart } from "@arco-design/web-react/icon";
import { useRequest } from "ahooks";
import { Playlist, Song } from "@/interfaces/api";
import { parseIndex, parseTimeToString } from "@/utils";
import { getMusicInfo, getMusicUrl } from "@/apis";
import useMusicStore from "@/store/music";

function PlaylistTable({ playlist }: { playlist: Playlist }) {
  const columns: TableColumnProps[] = [
    {
      title: "操作",
      width: 120,
      render(col, item, index) {
        return (
          <div className="flex items-center">
            <div className="mr-2">{parseIndex(index + 1)}</div>
            <IconHeart className="mx-2" />
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

  return (
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
        })}
      />
    </div>
  );
}

export default PlaylistTable;
