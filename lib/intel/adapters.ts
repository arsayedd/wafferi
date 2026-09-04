import type { AdapterKind } from "./types";
import { fingerprintStore } from "./store-detect";

export function detectAdapter(html: string, url: URL): AdapterKind {
  return fingerprintStore(html, url).adapter;
}
