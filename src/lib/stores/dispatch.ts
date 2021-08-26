import { UnreachableCaseError } from "ts-essentials";
import { v4 as uuid } from "uuid";

import type { Keys, Pointer } from "../types";
import { getPointer } from "../user-events";

import { MarksState } from "./marksStore";
import { UserState } from "./usersStore";

export type Action =
  | { t: "MOVED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "LIFTED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "DOWNED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "PRESSED_KEY"; pointer: Pointer; keys: Keys; key: string }
  | { t: "RESIZED" }
  | { t: "SELECTED_COLOR"; color: string };

export type Dispatch = (action: Action) => void;

export const dispatch: Dispatch = (action): void => {
  switch (action.t) {
    case "DOWNED_POINTER": {
      UserState.update((state) => {
        let { currentMark, currentColor } = state;

        if (currentMark) return;

        const { x, y, p } = getPointer();

        const points = [{ x, y, pressure: p }];

        currentMark = {
          id: uuid(),
          points,
          color: currentColor,
        };

        return { currentColor, currentMark };
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
            cursorPosition: { x, y },
            currentMark: {
              id: currentMark.id,
              color: currentMark.color,
              points: [...currentMark.points, { x, y, pressure }],
            },
          };
        } else {
          return { cursorPosition: { x, y } };
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
    case "PRESSED_KEY": {
      // console.log({ "action.key": action.key });

      // switch (action.key) {
      //   case 'a':
      //     if (action.keys.shift) {

      //     }
      // }

      // todo: ctrl+z to undo
      // todo: ctrl+a to select all
      return;
    }
    case "RESIZED": {
      return;
    }
    case "SELECTED_COLOR": {
      UserState.update(() => ({ currentColor: action.color }));
      return;
    }
    default:
      throw new UnreachableCaseError(action);
  }
};
