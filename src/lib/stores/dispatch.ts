import { UnreachableCaseError } from "ts-essentials";
import { v4 as uuid } from "uuid";

import type { Keys, Pointer } from "../types";
import { getPointer } from "../user-events";
import { userId } from "../userId";

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
      let { currentMark, currentColor } = UserState.get(userId);

      if (currentMark) return;

      const { x, y, p } = getPointer();

      const points = [{ x, y, pressure: p }];

      currentMark = {
        id: uuid(),
        points,
        color: currentColor,
      };

      UserState.set(userId, { currentColor, currentMark });
      return;
    }
    case "MOVED_POINTER": {
      const { currentMark, currentColor } = UserState.get(userId);

      if (!currentMark) return;

      const pointer = getPointer();

      UserState.set(userId, {
        currentColor,
        currentMark: {
          id: currentMark.id,
          color: currentMark.color,
          points: [
            ...currentMark.points,
            {
              x: pointer.x,
              y: pointer.y,
              pressure: pointer.p,
            },
          ],
        },
      });
      return;
    }
    case "LIFTED_POINTER": {
      const state = UserState.get(userId);
      const { currentMark } = state;

      if (!currentMark) return;

      UserState.set(userId, {
        ...state,
        currentMark: null,
      });

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
      UserState.update(userId, () => ({ currentColor: action.color }));
      return;
    }
    default:
      throw new UnreachableCaseError(action);
  }
};
