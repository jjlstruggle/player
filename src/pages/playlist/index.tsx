import "./index.less";
import { useRouterStore } from "@/hooks/router";
import { useRequest } from "ahooks";
import { getPlaylist } from "@/apis";
import { Button, Spin, Tag, Typography } from "@arco-design/web-react";
import { Playlist } from "@/interfaces/api";
import {
  IconCaretRight,
  IconDownload,
  IconFolder,
  IconPlus,
  IconShareAlt,
} from "@arco-design/web-react/icon";
import { parseCount } from "@/utils";
import dayjs from "dayjs";
import PlaylistTable from "@/components/playlist/table";

export default function IPlaylist() {
  const { params } = useRouterStore();
  const { data, loading } = useRequest(() => getPlaylist(params), {
    refreshDeps: [params],
  });

  const playlist = loading ? ({} as Playlist) : data?.data.playlist!;

  if (loading) return <Spin size={48} />;

  return (
    <div className="p-4 flex flex-col overflow-hidden">
      <div className="flex mb-4">
        <img
          src={playlist.coverImgUrl}
          alt="图片加载失败"
          className="rounded w-40 h-40 mr-5"
        />
        <Typography>
          <div className="flex items-center">
            <Tag bordered color="blue" size="small">
              歌单
            </Tag>
            <div className="font-serif text-xl font-bold ml-4">
              {playlist.name}
            </div>
          </div>
          <div className="flex items-center mt-1">
            <img
              className="w-6 h-6 rounded-full mr-2"
              src={playlist.creator.avatarUrl}
              alt="图片加载失败"
            />
            <div className="mr-2">{playlist.creator.nickname}</div>
            <span>
              {dayjs(playlist.updateTime).format("HHHH-MM-DD") + "创建"}
            </span>
          </div>
          <div className="mt-1">
            <Button
              type={"primary"}
              shape={"round"}
              className="mr-3"
              size="mini"
            >
              <IconCaretRight />
              播放全部
              <IconPlus />
            </Button>
            <Button
              size="mini"
              type="outline"
              shape={"round"}
              icon={<IconFolder />}
              className="mr-3"
            >
              收藏( {parseCount(playlist.subscribedCount)} )
            </Button>
            <Button
              size="mini"
              type="outline"
              shape={"round"}
              icon={<IconShareAlt />}
              className="mr-3"
            >
              分享( {parseCount(playlist.shareCount)} )
            </Button>
            <Button
              type="outline"
              shape={"round"}
              icon={<IconDownload />}
              size="mini"
            >
              下载全部
            </Button>
          </div>
          <div className="mt-1 text-xs">标签: {playlist?.tags.join(" / ")}</div>
          <div className="mt-1  text-xs">
            歌曲: {playlist!.trackIds.length}&nbsp;&nbsp;&nbsp;播放:
            {parseCount(playlist.playCount)}
          </div>
          <div className="mt-1  text-xs">
            <Typography.Paragraph
              ellipsis={{
                rows: 2,
                showTooltip: true,
                expandable: true,
                wrapper: "span",
              }}
            >
              简介: {playlist.description}
            </Typography.Paragraph>
          </div>
        </Typography>
      </div>
      <PlaylistTable playlist={playlist} />
    </div>
  );
}
