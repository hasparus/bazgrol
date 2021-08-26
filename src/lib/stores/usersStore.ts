import { derived } from "svelte/store";

import { colors } from "../colors";
import { readableDict } from "../svelt-yjs/readableDict";
import type { Mark, Point } from "../types";
import { userId } from "../userId";
import type { Yjs } from "../yjs";
import { yDoc } from "../yjs";

export interface UserState {
  currentMark: Mark | null;
  currentColor: string;
  cursorPosition?: Point;
}

const usersYMap = yDoc.getMap("usersData") as Yjs.Map<UserState>;

export const UserState = {
  default: {
    currentMark: null,
    currentColor: colors[0],
  },
  get: (): UserState => {
    return usersYMap.get(userId) || UserState.default;
  },
  set: (state: UserState): UserState => {
    return usersYMap.set(userId, state);
  },
  update: (
    change: (state: UserState) => Partial<UserState> | undefined
  ): UserState => {
    const state = UserState.get();
    const delta = change(state);

    if (delta === null) {
      return state;
    } else {
      return UserState.set({ ...state, ...delta });
    }
  },
};

export const usersStore = readableDict(usersYMap);

export const userIdsStore = derived(usersStore, (users) => {
  return Object.keys(users);
});
