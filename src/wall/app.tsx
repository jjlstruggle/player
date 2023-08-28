import { Song } from "@/interfaces/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import "./index.css";

export default function App() {
  const [song, setSong] = useState<Song>();
  const [start, setStart] = useState(false);

  useEffect(() => {
    listen("play", (event) => {
      const s = event.payload as Song;
      setStart(true);
      setSong(s);
    });
    listen("pause", (event) => {
      setStart(false);
    });
  }, []);

  if (!song) return null;

  return (
    <div className="w-screen h-screen relative">
      <img src={song.al.picUrl} className={"block w-screen h-screen blur-sm"} />
      <div
        className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center"
        style={{
          width: 300,
          height: 400,
          marginLeft: -120,
          marginTop: -200,
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(6px)",
          border: "0.8px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "rgba(142, 142, 142, 0.19) 0px 6px 15px 0px",
          borderRadius: 12,
        }}
      >
        <img
          src={song.al.picUrl}
          className={
            start
              ? "block w-48 h-48 rounded-full revolve"
              : "block w-48 h-48 rounded-full"
          }
        />
        <div className="font-bold text-xl mt-2">{song.name}</div>
        <div className="text-base mt-2">
          {song.ar.map((item) => item.name).join("/")}
        </div>
      </div>
    </div>
  );
}
