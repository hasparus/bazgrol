import { colors } from "../colors";
import { readableDict } from "../svelt-yjs/readableDict";
import type { Mark } from "../types";
import type { UserId } from "../userId";
import type { Yjs } from "../yjs";
import { yDoc } from "../yjs";

export interface UserState {
  currentMark: Mark | null;
  currentColor: string;
}

const usersYMap = yDoc.getMap("usersData") as Yjs.Map<UserState>;

export const UserState = {
  default: {
    currentMark: null,
    currentColor: colors[0],
  },
  get: (userId: UserId): UserState => {
    return usersYMap.get(userId) || UserState.default;
  },
  set: (userId: UserId, state: UserState): UserState => {
    return usersYMap.set(userId, state);
  },
  update: <K extends keyof UserState>(
    userId: UserId,
    delta: (state: UserState) => Pick<UserState, K>
  ): UserState => {
    const state = UserState.get(userId);
    return UserState.set(userId, { ...state, ...delta(state) });
  },
};

export const usersStore = readableDict(usersYMap);
