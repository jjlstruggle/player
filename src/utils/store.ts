import { Store } from "tauri-plugin-store-api";
import { resourceDir, join } from "@tauri-apps/api/path";

let appDir = "",
  storeDir = "",
  store: Store;

export async function getStore() {
  if (!appDir || !storeDir || !store) {
    appDir = await resourceDir();
    storeDir = await join(appDir, "data", "runtime.dat");

    store = new Store(storeDir);
    store.onChange((a, b) => {
      store.save();
    });
  }
  return store;
}
