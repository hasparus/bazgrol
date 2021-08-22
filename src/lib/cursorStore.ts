import { gun } from "./gun";
import { gunStore } from "./gunStore";

declare module "./gun" {
  export interface SharedState {
    cursor: { x: number; y: number };
  }
}

export const cursor = gunStore(
  gun.get("cursor"),
  {},
  { x: 0, y: 0 },
  { throttleMs: 100 }
);
