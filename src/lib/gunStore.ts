import type { Dictionary } from "rambdax";
import { throttle } from "rambdax";
import { map } from "rambdax";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

import type { IGunChainReference } from "./gun";

export function gunStore<
  T extends object,
  M extends Dictionary<(...args: any[]) => void>
>(
  ref: IGunChainReference<T>,
  methods: M &
    ThisType<IGunChainReference<T> & M & { innerStore: Writable<T> }>,
  initialValue: T,
  { throttleMs }: { throttleMs?: number } = {}
): Omit<Writable<T>, "update"> {
  const innerStore = writable<T>(initialValue);
  const { set, subscribe, update: _update } = innerStore;

  Object.assign(ref, { innerStore });
  methods = map((f) => f.bind(ref), methods) as M;

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
