import { getMusicLyric } from "@/apis";
import useMusicStore from "@/store/music";
import { useRequest } from "ahooks";

export default function Music() {
  const { playIngMusic } = useMusicStore();

  const { data, loading } = useRequest(() => getMusicLyric(playIngMusic!.id));

  return (
    <div className="overflow-auto" style={{ height: "calc(100vh - 9rem)" }}>
      <div className="flex" style={{ height: "calc(100vh - 9rem)" }}>
        <div style={{ height: "calc(100vh - 9rem)" }} className="w-1/2"></div>
        <div style={{ height: "calc(100vh - 9rem)" }} className="w-1/2"></div>
      </div>
      <div className="flex" style={{ height: "calc(100vh - 9rem)" }}></div>
    </div>
  );
}
