import { resourceDir, join } from "@tauri-apps/api/path";
import { createDir, exists } from "@tauri-apps/api/fs";

export const getStorePath = async () => {
  let appDir = await resourceDir();
  return join(appDir, "data", "runtime.dat");
};

export const getDownloadPath = async () => {
  let appDir = await resourceDir();
  const downloadDir = await join(appDir, "download");
  let exist = await exists(downloadDir);
  if (!exist) {
    await createDir(downloadDir);
  }
  return downloadDir;
};
