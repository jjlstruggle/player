import "./index.css";
import { Song } from "@/interfaces/api";
import { listen } from "@tauri-apps/api/event";

window.addEventListener("DOMContentLoaded", () => {
  const bg = document.querySelector(".image-bg") as HTMLImageElement;
  const image = document.querySelector(".image") as HTMLImageElement;
  const name = document.querySelector(".music-name") as HTMLDivElement;
  const artist = document.querySelector(".artist") as HTMLDivElement;
  const cvs = document.querySelector("canvas")!;
  cvs.width = document.body.clientWidth;
  cvs.height = document.body.clientHeight * 0.3;

  let ctx = cvs.getContext("2d")!;
  let size = 60;
  let rectArr: any[] = [];

  function draw(dataArray: Uint8Array) {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    let width = cvs.width / size;
    for (let i = 0; i < size; i++) {
      let height = dataArray[i];
      let y = cvs.height - height;
      let x = i * width + cvs.width / 2;
      let x2 = cvs.width / 2 - (i + 1) * width;
      const linear = ctx.createLinearGradient(0, 80, 0, cvs.height);
      linear.addColorStop(0, "white");
      linear.addColorStop(1, "#66aced");
      ctx.fillStyle = linear;
      ctx.fillRect(x, y, width - 5, height);
      ctx.fillRect(x2, y, width - 5, height);
      ctx.fillStyle = "#66aced";
      let o = rectArr[i];
      ctx.fillRect(x, cvs.height - (o.cap + 5), width - 5, 5);
      ctx.fillRect(x2, cvs.height - (o.cap + 5), width - 5, 5);
      o.cap -= 3;
      if (o.cap < 0) {
        o.cap = 0;
      }
      if (height > 0 && o.cap < height) {
        o.cap = height;
      }
    }
  }

  listen("play", (event) => {
    const s = event.payload as Song;
    image.src = s.al.picUrl;
    bg.src = s.al.picUrl;
    image.className = image.className + " revolve";
    name.innerText = s.name;
    artist.innerText = s.ar.map((item) => item.name).join("/");
  });

  listen<Uint8Array>("musicByte", (event) => {
    draw(event.payload);
  });

  listen("pause", () => {
    image.className = "block w-48 h-48 rounded-full image";
  });

  for (let i = 0; i < size; i++) {
    rectArr.push({ cap: 0 });
  }
});
