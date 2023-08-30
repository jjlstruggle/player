import { Table, TableColumnProps } from "@arco-design/web-react";
import { IconHeart } from "@arco-design/web-react/icon";
import { Song } from "@/interfaces/api";
import { parseIndex, parseTimeToString } from "@/utils";
import { getMusicUrl } from "@/apis";
import useMusicStore from "@/store/music";

const columns: TableColumnProps[] = [
  {
    title: "曲名",
    dataIndex: "name",
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
    title: "时间",
    dataIndex: "dt",
    width: 100,
    render(col) {
      return parseTimeToString(col / 1000);
    },
  },
];

export default function IDrawer() {
  const { musicList, setPlayingMusic, audio } = useMusicStore();
  return (
    <div>
      <Table
        size="small"
        scroll={{ y: 500, x: false }}
        columns={columns}
        data={musicList}
        pagination={false}
        virtualized={true}
        onRow={(record: Song) => ({
          onDoubleClick: async function () {
            let urlInfo = await getMusicUrl(record.id);
            setPlayingMusic(record);
            audio.src = urlInfo.data.data[0].url;
            audio.play();
          },
        })}
      />
    </div>
  );
}
