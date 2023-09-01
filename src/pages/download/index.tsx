import useDownloadStore from "@/store/downloadList";
import { parseIndex } from "@/utils";
import {
  Table,
  Tabs,
  TableColumnProps,
  Space,
  List,
} from "@arco-design/web-react";
import DownloadQueue from "@/components/download/DownloadQueue";
import dayjs from "dayjs";

export default function Download() {
  const { tasklist } = useDownloadStore();
  const columns: TableColumnProps[] = [
    {
      title: "",
      width: 80,
      render(col, item, index) {
        return (
          <div className="flex items-center">
            <div className="mr-2">{parseIndex(index + 1)}</div>
          </div>
        );
      },
    },
    {
      title: "音乐标题",
      dataIndex: "originSong.name",
      ellipsis: true,
    },
    {
      title: "歌手",
      dataIndex: "originSong.ar",
      ellipsis: true,
      width: 100,
      render(col: any[]) {
        return col.map((ar) => ar.name).join(" / ");
      },
    },
    {
      title: "专辑",
      dataIndex: "originSong.al.name",
      ellipsis: true,
      width: 200,
    },
    {
      title: "下载时间",
      dataIndex: "downloadTime",
      render(col) {
        return dayjs(col * 1000).fromNow();
      },
    },
  ];

  return (
    <div className="mt-4 mx-2">
      <Tabs type="rounded" defaultActiveTab="hasDownload">
        <Tabs.TabPane title="已下载" key="hasDownload">
          <div className="m-4">
            <Table
              size="small"
              scroll={{ y: 400, x: false }}
              columns={columns}
              pagination={false}
              virtualized={true}
              data={tasklist.filter((item) => item.state === "success")}
            ></Table>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane title="正在下载" key="downloading">
          <div className="m-4">
            <List>
              {tasklist
                .filter((item) => item.state !== "success")
                .map((item) => (
                  <List.Item key={`${item.id}`}>
                    <DownloadQueue
                      name={item.originSong.name}
                      total={item.total}
                      progress={item.progress}
                    />
                  </List.Item>
                ))}
            </List>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
