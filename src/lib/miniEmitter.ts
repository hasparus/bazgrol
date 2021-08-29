import type { Subscriber, Unsubscriber } from "svelte/store";

export function miniStore<T>(initialValue: T) {
  let currentValue: T = initialValue;
  const subscribers: Subscriber<T>[] = [];

  return {
    subscribe(subscriber: Subscriber<T>): Unsubscriber {
      subscribers.push(subscriber);
      subscriber(currentValue);
      return () => {
        subscribers.splice(subscribers.indexOf(subscriber), 1);
      };
    },
    emit(value: T) {
      currentValue = value;
      subscribers.forEach((subscriber) => subscriber(value));
    },
  };
}
