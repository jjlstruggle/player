import "./index.css";
import { Song } from "@/interfaces/api";
import { listen } from "@tauri-apps/api/event";

window.addEventListener("DOMContentLoaded", () => {
  const bg = document.querySelector(".image-bg") as HTMLImageElement;
  const image = document.querySelector(".image") as HTMLImageElement;
  const name = document.querySelector(".music-name") as HTMLDivElement;
  const artist = document.querySelector(".artist") as HTMLDivElement;

  listen("play", (event) => {
    const s = event.payload as Song;
    image.src = s.al.picUrl;
    bg.src = s.al.picUrl;
    image.className = image.className + " revolve";
    console.log(name, artist);

    name.innerText = s.name;
    artist.innerText = s.ar.map((item) => item.name).join("/");
  });

  listen("musicByte", (event) => {
    const dataArray = event.payload;
    console.log(dataArray);
  });

  listen("pause", () => {
    image.className = "block w-48 h-48 rounded-full image";
  });
});
