import type { Readable, Subscriber, Unsubscriber } from "svelte/store";
import type { Dictionary } from "ts-essentials";
import type * as Yjs from "yjs";

export function readableDict<T>(map: Yjs.Map<T>): Readable<Dictionary<T>> {
  let value = map.toJSON() as Dictionary<T>;
  let subs: Subscriber<Dictionary<T>>[] = [];

  const setValue = (newValue: Dictionary<T>) => {
    if (value === newValue) return;

    // update stored value so new subscribers can get the initial value
    value = newValue;

    // call all handlers to notify of new value
    subs.forEach((sub) => sub(value));
  };

  const observer = (event: Yjs.YMapEvent<T>, _transaction: Yjs.Transaction) => {
    const target = event.target as Yjs.Map<T>;
    setValue(target.toJSON() as Dictionary<T>);
  };

  const subscribe = (handler: Subscriber<Dictionary<T>>): Unsubscriber => {
    subs = [...subs, handler];

    if (subs.length === 1) {
      // update current value to latest that yjs has since we haven't been observing
      value = map.toJSON() as Dictionary<T>;
      // set an observer to call all handlers whenever there is a change
      map.observe(observer);
    }

    // call just this handler once when it first subscribes
    handler(value);

    // return unsubscribe function
    return () => {
      subs = subs.filter((sub) => sub !== handler);
      if (subs.length === 0) {
        map.unobserve(observer);
      }
    };
  };

  return { subscribe };
}
