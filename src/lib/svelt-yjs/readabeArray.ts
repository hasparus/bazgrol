import type { Readable, Subscriber, Unsubscriber } from "svelte/store";
import type * as Yjs from "yjs";

/**
 * @source https://github.dev/relm-us/svelt-yjs
 */
export function readableArray<T>(arr: Yjs.Array<T>): Readable<T[]> {
  let value: T[] = arr.toArray();
  let subs: Subscriber<T[]>[] = [];

  const setValue = (newValue: T[]) => {
    if (value === newValue) return;
    // update stored value so new subscribers can get the initial value
    value = newValue;

    // call all handlers to notify of new value
    subs.forEach((sub) => sub(value));
  };

  const observer = (
    event: Yjs.YArrayEvent<T>,
    _transaction: Yjs.Transaction
  ) => {
    const target = event.target as Yjs.Array<T>;
    setValue(target.toArray());
  };

  const subscribe = (handler: Subscriber<Array<T>>): Unsubscriber => {
    subs = [...subs, handler];

    if (subs.length === 1) {
      // update current value to latest that yjs has since we haven't been observing
      value = arr.toArray();
      // set an observer to call all handlers whenever there is a change
      arr.observe(observer);
    }

    // call just this handler once when it first subscribes
    handler(value);

    // return unsubscribe function
    return () => {
      subs = subs.filter((sub) => sub !== handler);
      if (subs.length === 0) {
        arr.unobserve(observer);
      }
    };
  };

  return { subscribe };
}
