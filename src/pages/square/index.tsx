import { useRequest } from "ahooks";
import { getCatlist, getSquare } from "@/apis";
import { useMemo, useState } from "react";
import { Grid, Pagination, Space, Spin, Tag } from "@arco-design/web-react";
import { IconCaretRight } from "@arco-design/web-react/icon";
import { useRouterStore } from "@/hooks/router";

export default function Square() {
  const { push } = useRouterStore();
  const { data, loading } = useRequest(getCatlist);
  const [catSelect, setCat] = useState("全部");
  const [page, setPage] = useState(0);
  const { data: squareRes, loading: squareLoading } = useRequest(
    () => getSquare(catSelect, page),
    {
      refreshDeps: [page, catSelect],
    }
  );

  const catlist = useMemo(() => {
    if (loading) return [];
    return Object.keys(data?.data.categories!).map((index) => {
      return {
        // @ts-ignore
        title: data?.data.categories![index],
        // @ts-ignore
        cat: data?.data.sub.filter((sub) => sub.category == index),
      };
    });
  }, [loading]);

  const total = squareLoading ? 0 : squareRes?.data.total;
  const playlists = squareLoading ? [] : squareRes!.data.playlists!;

  return (
    <div>
      <Spin loading={loading} className="mt-2">
        <div className="flex">
          <div className="w-12 text-right mr-4 font-bold">全部:</div>
          <Space wrap className="flex-1">
            <Tag
              color="arcoblue"
              checkable
              onCheck={() => {
                setCat("全部");
              }}
              checked={catSelect === "全部"}
            >
              全部
            </Tag>
          </Space>
        </div>
        {catlist.map((cat, index) => (
          <div className="flex" key={index}>
            <div className="w-12 text-right mr-4 font-bold">{cat.title}:</div>
            <Space wrap className="flex-1">
              {cat.cat!.map((cat, index) => (
                <Tag
                  color="arcoblue"
                  checkable
                  onCheck={() => {
                    if (cat.name === catSelect) {
                      setCat("全部");
                    } else setCat(cat.name);
                  }}
                  checked={cat.name === catSelect}
                  key={index}
                >
                  {cat.name}
                </Tag>
              ))}
            </Space>
          </div>
        ))}
      </Spin>
      <Spin loading={squareLoading}>
        <div className="mx-6">
          <Grid.Row gutter={[24, 24]}>
            {playlists.map((playlist) => (
              <Grid.Col
                onClick={() => push("/playlist", playlist.id)}
                span={6}
                key={playlist.id}
              >
                <div className="w-full overflow-hidden rounded-md mb-1 relative card">
                  <img
                    loading="lazy"
                    src={playlist.coverImgUrl}
                    className="cursor-pointer w-full block aspect-square  transition-all duration-500"
                  />
                  <div className="absolute z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white top-1/2 left-1/2 -ml-6 -mt-6 cursor-pointer transition-all duration-500 card-icon opacity-0">
                    <IconCaretRight className="text-3xl" />
                  </div>
                </div>
                <div className="line-clamp-2 text-sm transition-colors cursor-pointer hover:text-[rgb(var(--primary-5))]">
                  {playlist.name}
                </div>
              </Grid.Col>
            ))}
          </Grid.Row>
        </div>
      </Spin>
      <div className="flex justify-center mt-4 mb-2">
        <Pagination
          onChange={(page) => {
            setPage(page - 1);
          }}
          current={page + 1}
          hideOnSinglePage
          pageSize={80}
          total={total}
          showMore={false}
          showTotal
        />
      </div>
    </div>
  );
}
