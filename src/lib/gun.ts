import Gun from "gun/gun";
import type { IGunChainReference } from "gun/types/chain";

import { makeGlobal } from "./debug";

import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/store";
import "gun/lib/rindexed";

export type { IGunChainReference };

type Version = "v1";

interface GunState {
  "/hasparus-bazgrol": Record<Version, SharedState>;
}

/**
 * for declaration merging
 */
export interface SharedState {}

export const gun = Gun<GunState>("https://gunjs.herokuapp.com/gun")
  .get("/hasparus-bazgrol")
  .get("v1");

makeGlobal({ gun });
