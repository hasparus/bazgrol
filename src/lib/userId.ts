import { v4 as uuid } from "uuid";
import { makeGlobal } from "./debug";

export let userId = localStorage.getItem("userId") as string;

if (!userId) {
  userId = uuid();
  localStorage.setItem("userId", userId);
}

export type UserId = string;

makeGlobal({ userId });
