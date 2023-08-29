import { getMusicLyric } from "@/apis";
import useMusicStore from "@/store/music";
import { useEventListener, useRequest } from "ahooks";
import needle from "@/assets/needle.png";
import disc from "@/assets/disc.png";
import { useEffect, useMemo, useRef, useState } from "react";
import { Space } from "@arco-design/web-react";
import classNames from "classnames";

const handleLyric = (lyric: string) => {
  let musicLyric: string[] = [],
    time_arr = [],
    nowTimeArr: number[] = [],
    isPure = false;

  if (lyric == null) {
    return { musicLyric, nowTimeArr };
  }
  for (let i of lyric.split("\n")) {
    let n = i.search(/]/);
    if (i.substring(n + 1) == "") musicLyric.push("···");
    else musicLyric.push(i.substring(n + 1));
    let time = i.substring(1, n);
    time_arr.push(time);
  }
  for (let a of time_arr) {
    let Time =
      // @ts-ignore
      parseInt((a.substring(0, 2) * 60) as unknown as string) +
      parseInt(a.substring(3, 5)) +
      parseFloat(a.substring(5, 9));
    nowTimeArr.push(Time);
  }
  nowTimeArr.pop();
  if (musicLyric[0] == "纯音乐，请欣赏") {
    isPure = true;
  }
  return {
    musicLyric,
    nowTimeArr,
    isPure,
  };
};

export default function Music() {
  const { playIngMusic, audio } = useMusicStore();
  const { data, loading } = useRequest(() => getMusicLyric(playIngMusic!.id));
  const [play, setPlay] = useState(false);
  const lyricBox = useRef<HTMLDivElement>(null);
  const [select, setSelect] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!audio.paused) {
      setPlay(true);
    }
  }, []);

  useEventListener(
    "play",
    () => {
      setPlay(true);
    },
    { target: audio }
  );
  useEventListener(
    "pause",
    () => {
      setPlay(false);
    },
    { target: audio }
  );

  const lyc = loading ? "" : data?.data.lrc.lyric!;

  const lyric = useMemo(() => handleLyric(lyc), [lyc]);

  useEventListener(
    "timeupdate",
    () => {
      let index = 0;

      for (; index < lyric.nowTimeArr.length; ) {
        if (audio.currentTime > lyric.nowTimeArr[index]) {
          index++;
        } else {
          break;
        }
      }

      if (index !== indexRef.current) {
        indexRef.current = index;
        if (index > 5) {
          lyricBox.current!.scrollTo({
            top: (index - 4) * 40,
            behavior: "smooth",
          });
        }
        setSelect(index);
      }
    },
    { target: audio }
  );

  return (
    <div
      className="overflow-auto"
      style={{
        backgroundImage: "linear-gradient(to top, #a8edea 0%, #fed6e3 100%)",
        height: "calc(100vh - 9rem)",
      }}
    >
      <div
        className="flex"
        style={{
          height: "calc(100vh - 9rem)",
        }}
      >
        <div
          style={{
            height: "calc(100vh - 9rem)",
          }}
          className="w-1/2"
        >
          <div
            className="relative"
            style={{
              width: 300,
              height: 300,
              marginTop: 100,
              marginLeft: 60,
            }}
          >
            <img
              style={{
                width: 100,
                left: 140,
                top: -60,
                transform: play ? "rotate(-5deg)" : "rotate(-45deg)",
                transformOrigin: "top left",
              }}
              src={needle}
              className="absolute z-50 transition-transform duration-1000"
            />
            <img
              src={disc}
              className="absolute w-full h-full z-10 top-0 left-0 block"
            />
            <img
              style={{
                width: 210,
                height: 210,
                marginLeft: -105,
                marginTop: -105,
              }}
              src={playIngMusic?.al.picUrl}
              className="absolute z-0 top-1/2 left-1/2 block"
            />
          </div>
        </div>
        <div
          style={{ height: "calc(100vh - 9rem)" }}
          className="w-1/2 flex flex-col"
        >
          <div className="text-2xl mt-4">{playIngMusic!.name}</div>
          <Space
            style={{ fontSize: 10 }}
            className="text-[var(--color-text-3)]"
          >
            <div>
              歌手:{playIngMusic?.ar.map((item) => item.name).join("/")}
            </div>
            <div>专辑:{playIngMusic?.al.name}</div>
          </Space>
          <div ref={lyricBox} className="flex-1 overflow-auto my-4">
            {lyric.musicLyric.map((item, index) => (
              <div
                className={classNames(
                  "text-sm flex items-center",
                  select - 1 === index ? "font-bold" : "font-thin"
                )}
                style={{ height: 40 }}
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex" style={{ height: "calc(100vh - 9rem)" }}></div>
    </div>
  );
}
