import { isEmpty } from "rambdax";
import { derived, get, writable } from "svelte/store";
import { UnreachableCaseError } from "ts-essentials";
import { v4 as uuid } from "uuid";

import { colors } from "./colors";
import { gun } from "./gun";
import { getPointer } from "./pointer";
import type { Keys, Mark, Pointer, Uuid } from "./types";
import { NumberDict } from "./types";
import type { UserId } from "./userId";
import { userId } from "./userId";

export type Action =
  | { t: "MOVED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "LIFTED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "DOWNED_POINTER"; pointer: Pointer; keys: Keys }
  | { t: "PRESSED_KEY"; pointer: Pointer; keys: Keys; key: string }
  | { t: "RESIZED" }
  | { t: "SELECTED_COLOR"; color: string };

export type Dispatch = (action: Action) => void;

interface UserState {
  currentMark: Mark | null;
  currentColor: string;
}

type DrawingState = {
  marks: Record<Uuid, Mark>;
  users: Record<UserId, UserState>;
};

interface DrawingStateDelta extends Partial<Omit<DrawingState, "users">> {
  users?: Record<UserId, Partial<UserState>>;
}

const reducer = (action: Action, s: DrawingState): DrawingStateDelta => {
  switch (action.t) {
    case "DOWNED_POINTER": {
      let { currentMark, currentColor } = s.users[userId];
      if (currentMark) return {};

      const { x, y, p } = getPointer();

      const points = NumberDict.of({ x, y, pressure: p });
      currentMark = {
        id: uuid(),
        points,
        color: currentColor,
      };

      return { users: { [userId]: { currentMark } } };
    }
    case "MOVED_POINTER": {
      const { currentMark } = s.users[userId];

      if (!currentMark) return {};

      const pointer = getPointer();
      const points = NumberDict.append(currentMark.points, {
        x: pointer.x,
        y: pointer.y,
        pressure: pointer.p,
      });

      return {
        users: {
          [userId]: {
            currentMark: {
              id: currentMark.id,
              color: currentMark.color,
              points,
            },
          },
        },
      };
    }
    case "LIFTED_POINTER": {
      const { currentMark } = s.users[userId];

      if (!currentMark) return {};

      return {
        marks: {
          ...s.marks,
          [currentMark.id]: { ...currentMark, complete: true },
        },
        users: {
          [userId]: { currentMark: null },
        },
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
      return { users: { [userId]: { currentColor: action.color } } };
    }
    default:
      throw new UnreachableCaseError(action);
  }
};

const initialValue: DrawingState = {
  marks: {},
  users: {
    [userId]: {
      currentMark: null,
      currentColor: colors[0],
    },
  },
};

const _drawingStore = writable<DrawingState>(initialValue);

declare module "./gun" {
  export interface SharedState {
    drawing: DrawingState;
  }
}

const gunRef = gun.get("drawing");

gunRef.open!((update) => {
  console.log({ update });
  const oldState = get(_drawingStore);
  _drawingStore.set({ ...oldState, ...update });
});

const dispatch: Dispatch = (action) => {
  const oldState = get(_drawingStore);
  const delta = reducer(action, oldState);

  if (!isEmpty(delta)) {
    const { users: usersDelta, ...rest } = delta;
    const newState = { ...oldState };

    if (usersDelta) {
      const userDelta = usersDelta[userId];

      gunRef.get("users").get(userId).put(userDelta);
      newState.users[userId] = { ...oldState.users[userId], ...userDelta };
    }

    if (!isEmpty(rest)) {
      gunRef.put(rest);
      console.log("PUT", { rest });
      Object.assign(newState, rest);
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`{{ dispatch ${action.t} }}`, {
        action,
        oldState,
        delta,
        newState,
      });
    }

    _drawingStore.set(newState);
  }
};

export const drawingStore = {
  dispatch,
  subscribe: _drawingStore.subscribe,
};

export const userStore = derived(drawingStore, (s) => s.users[userId]);
