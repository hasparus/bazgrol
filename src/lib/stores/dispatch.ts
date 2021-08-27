import { UnreachableCaseError } from "ts-essentials";
import { v4 as uuid } from "uuid";

import type { Keys, Pointer } from "../types";
import { getPointer } from "../user-events";

import { MarksState } from "./marksStore";
import type { UserActivity } from "./usersStore";
import { UserState } from "./usersStore";

export type Action =
  | { t: "MOVED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "LIFTED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "DOWNED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "RESIZED" }
  | { t: "SELECTED_COLOR"; color: string }
  | { t: "SET_ACTIVITY"; activity: UserActivity };

export type Dispatch = (action: Action) => void;

export const dispatch: Dispatch = (action): void => {
  switch (action.t) {
    case "DOWNED_POINTER": {
      UserState.update((state) => {
        let { currentMark, color: currentColor } = state;

        if (currentMark) return;

        const { x, y, p } = getPointer();

        const points = [{ x, y, pressure: p }];

        currentMark = {
          id: uuid(),
          points,
          color: currentColor,
        };

        return { color: currentColor, currentMark };
      });
      return;
    }
    case "MOVED_POINTER": {
      UserState.update((state) => {
        const { currentMark } = state;

        const pointer = getPointer();
        const { x, y, p: pressure } = pointer;

        if (currentMark) {
          return {
            cursorPos: { x, y },
            currentMark: {
              id: currentMark.id,
              color: currentMark.color,
              points: [...currentMark.points, { x, y, pressure }],
            },
          };
        } else {
          return { cursorPos: { x, y } };
        }
      });

      return;
    }
    case "LIFTED_POINTER": {
      const state = UserState.get();
      const { currentMark } = state;

      if (!currentMark) return;

      UserState.set({ ...state, currentMark: null });
      MarksState.push({ ...currentMark, complete: true });

      return;
    }
    case "RESIZED": {
      return;
    }
    case "SELECTED_COLOR": {
      UserState.update(() => ({ color: action.color }));
      return;
    }
    case "SET_ACTIVITY": {
      UserState.update(() => ({ activity: action.activity }));
      return;
    }
    default:
      throw new UnreachableCaseError(action);
  }
};
