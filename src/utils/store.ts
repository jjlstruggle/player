import { Store } from "tauri-plugin-store-api";
import { getStorePath } from "./path";

export async function getStore() {
  let storeDir = await getStorePath();
  let store = new Store(storeDir);
  return store;
}
