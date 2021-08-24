import { derived } from "svelte/store";

import { userId } from "../userId";

import { usersStore, UserState } from "./usersStore";

export const currentUserStore = derived(
  usersStore,
  (users) => users[userId] || UserState.default
);
