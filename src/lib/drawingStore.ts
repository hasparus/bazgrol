import { get, writable } from "svelte/store";
import { UnreachableCaseError } from "ts-essentials";
import { v4 as uuid } from "uuid";

import { colors } from "./colors";
import { getStrokePath, PATH_COMPLETE } from "./drawing";
import { getPointer } from "./pointer";
import type { Keys, Mark, Pointer } from "./types";

// TODO: Could paths be moved to UI layer?
// Why do we keep them in the state? They could be stored closer to the UI.

export type Action =
  | { t: "MOVED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "LIFTED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "DOWNED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "PRESSED_KEY"; pointer: Pointer; keys: Keys; key: string }
  | { t: "RESIZED" }
  | { t: "SELECTED_COLOR"; color: string };

export type Dispatch = (action: Action) => void;

// TODO: move to gunDB
export const drawingStore = (() => {
  type DrawingState = {
    marks: Mark[]; // <- shared
    currentMark: Mark | null; // <- user
    currentColor: string;
  };

  const initialValue: DrawingState = {
    marks: [],
    currentMark: null,
    currentColor: colors[0],
  };
  const store = writable(initialValue);

  const reducer = (action: Action, s: DrawingState): Partial<DrawingState> => {
    switch (action.t) {
      case "DOWNED_POINTER": {
        if (s.currentMark) return {};

        const { x, y, p } = getPointer();

        const points = [{ x, y, pressure: p }];
        const currentMark: Mark = {
          id: uuid(),
          points,
          color: s.currentColor,
        };

        return { currentMark };
      }
      case "MOVED_POINTER": {
        const { currentMark } = s;

        if (!currentMark) return {};

        const pointer = getPointer();
        const points = [
          ...currentMark.points,
          {
            x: pointer.x,
            y: pointer.y,
            pressure: pointer.p,
          },
        ];

        return {
          currentMark: {
            id: currentMark.id,
            color: currentMark.color,
            points,
          },
        };
      }
      case "LIFTED_POINTER": {
        const { currentMark } = s;

        if (!currentMark) return {};

        return {
          currentMark: null,
          marks: [
            ...s.marks,
            {
              ...currentMark,
              complete: true,
            },
          ],
        };
      }
      case "PRESSED_KEY": {
        // todo: ctrl+z to undo
        return {};
      }
      case "RESIZED": {
        return {};
      }
      case "SELECTED_COLOR": {
        return { currentColor: action.color };
      }
      default:
        throw new UnreachableCaseError(action);
    }
  };

  const dispatch: Dispatch = (action) => {
    // update((s) => {
    //   const newState = { ...s, ...reducer(action, s) };

    //   return newState;
    // })

    const oldState = get(store);
    const delta = reducer(action, oldState);

    if (Object.keys(delta).length !== 0) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`{{ dispatch ${action.t} }}`, { action, oldState, delta });
      }

      store.set({ ...oldState, ...delta });
    }
  };

  return { subscribe: store.subscribe, dispatch };
})();
