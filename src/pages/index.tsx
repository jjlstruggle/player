import {
  getNewMusic,
  getTodayRecommend,
  getMvRecommend,
  getPrivatecontent,
} from "@/apis";
import { Grid, Spin } from "@arco-design/web-react";
import { IconCaretRight } from "@arco-design/web-react/icon";
import { useRequest } from "ahooks";
import { chunk } from "lodash-es";
import "./index.less";
import { useRouterStore } from "@/hooks/router";

export default function Index() {
  const { push } = useRouterStore();
  const { data: recommendData, loading: recommendLoading } =
    useRequest(getTodayRecommend);
  const { data: newMusicData, loading: newMusicLoading } =
    useRequest(getNewMusic);
  const { data: mvData, loading: mvLoading } = useRequest(getMvRecommend);
  const { data: privatecontentData, loading: privatecontentLoading } =
    useRequest(getPrivatecontent);
  const recommends = recommendLoading
    ? []
    : recommendData?.data.recommend.slice(0, 4)!;
  const newMusics = newMusicLoading ? [] : chunk(newMusicData?.data.result!, 4);
  const mvs = mvLoading ? [] : mvData?.data.result.slice(0, 3)!;
  const privatecontents = privatecontentLoading
    ? []
    : privatecontentData?.data.result!;

  return (
    <div className="p-4 index">
      <div>
        <div className="flex justify-between items-end mb-6">
          <div style={{ letterSpacing: 2 }} className="text-2xl select-none">
            今日歌单
          </div>
          <div className="text-sm transition-colors cursor-pointer hover:text-[rgb(var(--primary-5))]">
            全部歌单
          </div>
        </div>
        <Spin loading={recommendLoading}>
          <Grid.Row gutter={[24, 24]}>
            {recommends.map((recommand) => (
              <Grid.Col
                onClick={() => push("/playlist", recommand.id)}
                span={24 / recommends.length}
                key={recommand.id}
              >
                <div className="w-full overflow-hidden rounded-md mb-1 relative card">
                  <img
                    src={recommand.picUrl}
                    className="cursor-pointer w-full block aspect-square  transition-all duration-500"
                  />
                  <div className="absolute z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white top-1/2 left-1/2 -ml-6 -mt-6 cursor-pointer transition-all duration-500 card-icon opacity-0">
                    <IconCaretRight className="text-3xl" />
                  </div>
                </div>
                <div className="line-clamp-2 text-sm transition-colors cursor-pointer hover:text-[rgb(var(--primary-5))]">
                  {recommand.name}
                </div>
              </Grid.Col>
            ))}
          </Grid.Row>
        </Spin>
      </div>
      <div className="mt-8">
        <div style={{ letterSpacing: 2 }} className="pb-6 text-2xl select-none">
          推荐MV
        </div>
        <Spin className="w-full" loading={newMusicLoading}>
          <Grid.Row gutter={24}>
            {mvs.map((mv, index) => (
              <Grid.Col
                className="cursor-pointer"
                span={24 / mvs.length}
                key={index}
              >
                <div className="cursor-pointer mb-1 relative mv-card">
                  <div className="absolute bottom-0 z-0 invisible mv-hidden line-clamp-1">
                    {mv.copywriter}
                  </div>
                  <img
                    src={mv.picUrl}
                    className="rounded block w-full h-56 transition-transform z-10"
                  ></img>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-2xl hover:text-[rgb(var(--primary-5))]">
                    {mv.name}
                  </div>
                  <div className="text-base text-[#61666D] hover:text-[rgb(var(--primary-5))] transition-colors ">
                    {mv.artistName}
                  </div>
                </div>
              </Grid.Col>
            ))}
          </Grid.Row>
        </Spin>
      </div>
      <div className="mt-8">
        <div style={{ letterSpacing: 2 }} className="mb-2 text-2xl select-none">
          最新歌曲
        </div>
        <Spin className="w-full" loading={newMusicLoading}>
          <Grid.Row gutter={24}>
            {newMusics.map((musics, index) => (
              <Grid.Col span={24 / newMusics.length} key={index}>
                {musics.map((music) => (
                  <div
                    className="flex p-2 cursor-pointer hover:bg-[var(--color-fill-2)] transition-colors mb-2 rounded"
                    key={music.id}
                  >
                    <img
                      className="w-16 h-16 rounded-md block mr-2"
                      src={music.picUrl}
                    />
                    <div>
                      <div className="text-base line-clamp-2 hover:text-[rgb(var(--primary-5))]">
                        {music.name}
                      </div>
                      <span className="text-xs text-[#61666D] hover:text-[rgb(var(--primary-5))] transition-colors line-clamp-2">
                        {music.song.artists
                          .map((item) => item.name)
                          .join(" / ")}
                      </span>
                    </div>
                  </div>
                ))}
              </Grid.Col>
            ))}
          </Grid.Row>
        </Spin>
      </div>
      <div className="mt-8">
        <div style={{ letterSpacing: 2 }} className="pb-6 text-2xl select-none">
          独家放送
        </div>
        <Spin className="w-full" loading={newMusicLoading}>
          <Grid.Row gutter={24}>
            {privatecontents.map((mv, index) => (
              <Grid.Col className="cursor-pointer mb-4" span={12} key={index}>
                <div className="cursor-pointer mb-1 relative">
                  <div className="absolute bottom-0 z-0 invisible mv-hidden line-clamp-1">
                    {mv.copywriter}
                  </div>
                  <img
                    src={mv.picUrl}
                    className="rounded block w-full h-56 transition-transform z-10"
                  ></img>
                </div>
                <div className="text-base hover:text-[rgb(var(--primary-5))]">
                  {mv.name}
                </div>
              </Grid.Col>
            ))}
          </Grid.Row>
        </Spin>
      </div>
    </div>
  );
}
