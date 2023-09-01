import { Progress } from "@arco-design/web-react";
import { memo } from "react";

export default memo(function DownloadQueue({
  name,
  progress,
  total,
}: {
  name: string;
  progress: number;
  total: number;
}) {
  let percent = total ? parseInt(String((progress * 100) / total)) : 0;

  return (
    <div className="flex items-center">
      <div className="line-clamp-1" style={{ width: 200 }}>
        {name}
      </div>
      <Progress width={400} percent={percent} />
    </div>
  );
});
