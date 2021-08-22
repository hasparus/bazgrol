import type { Dictionary } from "rambdax";
import { throttle } from "rambdax";
import { map } from "rambdax";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

import { makeGlobal } from "./debug";
import type { IGunChainReference } from "./gun";
import { gun } from "./gun";

function gunStore<
  T extends object,
  M extends Dictionary<(...args: any[]) => void>
>(
  ref: IGunChainReference<T>,
  methods: M &
    ThisType<IGunChainReference<T> & M & { innerStore: Writable<T> }>,
  { throttleMs }: { throttleMs?: number } = {}
): Omit<Writable<T>, "update" /* todo */> {
  const innerStore = writable<T>({} as T);
  const { set, subscribe, update: _update } = innerStore;

  Object.assign(ref, { innerStore });
  methods = map((f) => f.bind(ref), methods) as M;

  let current: T;
  subscribe((data) => (current = data));
  ref.on((data) => {
    set(data as T);
  });

  let put: typeof ref.put = (...args) => ref.put(...args);
  if (throttleMs) {
    put = throttle(put, throttleMs);
  }

  return {
    set(value) {
      ref.put(value);
      return set(value);
    },
    subscribe(cb) {
      return subscribe(cb);
    },
    ...methods,
  };
}

declare module "./gun" {
  export interface SharedState {
    cursor: { x: number; y: number };
  }
}

export const cursor = gunStore(gun.get("cursor"), {}, { throttleMs: 100 });
