import useMusicStore from "@/store/music";
import { parseTimeToString } from "@/utils";
import { Drawer, Slider, Tooltip } from "@arco-design/web-react";
import { useEventListener, useMouse } from "ahooks";
import { useRef, useState } from "react";
import noMusic from "@/assets/no-music.png";
import { isUndefined } from "lodash-es";
import {
  IconBackward,
  IconForward,
  IconMenu,
  IconPause,
  IconPlayArrow,
  IconSound,
} from "@arco-design/web-react/icon";
import { emit } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/window";
import { useRouterStore } from "@/hooks/router";
import IDrawer from "@/components/layout/drawer";

const formatTitle = (audio: HTMLAudioElement) => {
  return (
    parseTimeToString(audio.currentTime) +
    " / " +
    parseTimeToString(audio.duration)
  );
};

export default function Footer() {
  const { push } = useRouterStore();
  const container = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const { audio, playIngMusic } = useMusicStore();
  const { elementX } = useMouse(container.current);
  const [audioState, setAudioState] = useState<"pause" | "play">("pause");
  const [audioProgress, setAudioProgress] = useState("0%");
  const [isMove, setIsMove] = useState(false);
  const [showDraw, setShowDraw] = useState(false);

  useEventListener(
    "play",
    async () => {
      setAudioState("play");
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.fftSize);
      function send() {
        requestAnimationFrame(send);
        analyser.getByteFrequencyData(dataArray);
        emit("musicByte", dataArray);
      }

      const mainWindow = WebviewWindow.getByLabel("wallpaper")!;
      const isShow = await mainWindow.isVisible();
      if (!isShow) {
        await mainWindow.show();
      }
      await emit("play", playIngMusic);
      send();
    },
    { target: audio }
  );
  useEventListener(
    "pause",
    () => {
      setAudioState("pause");
      emit("pause");
    },
    { target: audio }
  );
  useEventListener(
    "timeupdate",
    () => {
      let rate = (100 * audio.currentTime) / audio.duration;
      setAudioProgress(rate + "%");
    },
    { target: audio }
  );
  useEventListener(
    "click",
    () => {
      if (!audio.src) return;
      let rate = 0;
      if (elementX > 0 && elementX < container.current!.clientWidth) {
        rate = elementX / container.current!.clientWidth;
        audio.currentTime = rate * audio.duration;
      } else if (elementX > container.current!.clientWidth) {
        rate = 0.98;
        audio.currentTime = rate * audio.duration;
      }
    },
    { target: container }
  );
  useEventListener(
    "mousedown",
    () => {
      setIsMove(true);
    },
    { target: container }
  );
  useEventListener(
    "mouseup",
    () => {
      setIsMove(false);
    },
    { target: document.body }
  );
  useEventListener(
    "mousemove",
    () => {
      if (isMove && audio.src) {
        let rate = 0;
        if (elementX > 0 && elementX < container.current!.clientWidth) {
          rate = elementX / container.current!.clientWidth;
          audio.currentTime = rate * audio.duration;
        } else if (elementX > container.current!.clientWidth) {
          rate = 0.98;
          audio.currentTime = rate * audio.duration;
        }
      }
    },
    { target: document.body }
  );

  let info = isUndefined(playIngMusic)
    ? {
        url: noMusic,
        name: "听我想听",
        artist: "",
        time: "00:00",
        duration: "00:00",
      }
    : {
        url: playIngMusic.al.picUrl,
        name: playIngMusic.name,
        artist: playIngMusic.ar.map((item) => item.name).join("/"),
        time: parseTimeToString(playIngMusic.dt / 1000),
        duration: parseTimeToString(audio.currentTime),
      };

  return (
    <div className="relative">
      <Drawer
        width="50vw"
        unmountOnExit
        footer={null}
        onCancel={() => setShowDraw(false)}
        visible={showDraw}
      >
        <IDrawer />
      </Drawer>
      <div
        ref={container}
        className="progress h-1 mt-2 bg-[var(--color-fill-2)] relative mr-4"
      >
        <div
          style={{ width: audioProgress }}
          ref={bar}
          className="progress-bar transition-width absolute left-0 duration-75 bg-gradient-to-r from-yellow-100 to-red-300 h-1"
        >
          <Tooltip
            color="#3491FA"
            content={formatTitle(audio)}
            disabled={audio.src === ""}
          >
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: "#fff",
                borderColor: "#1890ff",
                border: "2px solid",
                top: -4,
              }}
              className="absolute -right-2 top-0 rounded-full hanlder invisible cursor-pointer"
            />
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center h-16 mb-1 px-4 justify-between">
        <div className="flex">
          <div
            className="w-10 h-10 rounded overflow-hidden mr-2 cursor-pointer"
            onClick={() => {
              if (playIngMusic) {
                push("/music");
              }
            }}
          >
            <img className="block w-full h-full" src={info.url} />
          </div>
          <div className="h-10">
            <div className="text-sm">{info.name}</div>
            <div className="text-xs">{info.artist}</div>
          </div>
        </div>
        <div className="flex items-center pl-12">
          <IconBackward className="mx-4 cursor-pointer text-3xl" />
          <span className="text-4xl">
            {audioState === "play" ? (
              <IconPause
                className="cursor-pointer"
                onClick={() => {
                  audio.pause();
                }}
              />
            ) : (
              <IconPlayArrow
                className="cursor-pointer"
                onClick={() => {
                  if (audio.src) {
                    audio.play();
                  }
                }}
              />
            )}
          </span>
          <IconForward className="mx-3 cursor-pointer text-3xl" />
        </div>
        <div className="flex items-center">
          <div className="mr-6 ml-3 flex items-center">
            <IconSound className="cursor-pointer text-xl mr-4" />
            <div style={{ width: 100 }}>
              <Slider
                defaultValue={100}
                onChange={(val) => {
                  let v = val as number;
                  audio.volume = Number((v / 100).toFixed(2));
                }}
              />
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-xs select-none">
              {info.duration}/{info.time}
            </div>
            <IconMenu
              onClick={() => setShowDraw(true)}
              className="mr-6 ml-3 cursor-pointer text-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
