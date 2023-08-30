import useCacheStore from "@/store/cache";
import { parseTimeToString, parseIndex } from "@/utils";
import { Space, Table, TableColumnProps } from "@arco-design/web-react";
import { IconHeart } from "@arco-design/web-react/icon";
import useMusicStore from "@/store/music";
import { Song } from "@/interfaces/api";
import { getMusicUrl } from "@/apis";

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

export default function History() {
  const { historyList } = useCacheStore();
  const { setPlayingMusic, setMusicList, audio } = useMusicStore();
  return (
    <Space direction="vertical" className="p-6">
      <div className="text-xl font-bold flex items-end">
        最近播放
        <span className="text-sm font-normal ml-2">
          共{historyList.length}首
        </span>
      </div>
      <Table
        size="small"
        scroll={{ y: 500, x: false }}
        columns={columns}
        data={historyList}
        pagination={false}
        virtualized={true}
        onRow={(record: Song) => ({
          onDoubleClick: async function () {
            let urlInfo = await getMusicUrl(record.id);
            setPlayingMusic(record);
            setMusicList(historyList);
            audio.src = urlInfo.data.data[0].url;
            audio.play();
          },
        })}
      />
    </Space>
  );
}
