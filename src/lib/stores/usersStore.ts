import { derived } from "svelte/store";

import { colors } from "../colors";
import { readableDict } from "../svelt-yjs/readableDict";
import type { Mark, Point } from "../types";
import { userId } from "../userId";
import type { Yjs } from "../yjs";
import { yDoc } from "../yjs";

export interface UserState {
  currentMark: Mark | null;
  color: string;
  cursorPos?: Point;
  activity: UserActivity;
}

export type UserActivity = "pencil" | "pointer" | "grab";

const usersYMap = yDoc.getMap("usersData") as Yjs.Map<UserState>;

const defaultUserState: UserState = {
  currentMark: null,
  color: colors[0],
  activity: "pointer",
};

export const UserState = {
  default: defaultUserState,
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
