import Gun from "gun/gun";
import type { IGunChainReference } from "gun/types/chain";

import { makeGlobal } from "./debug";

import "gun/lib/radix";
import "gun/lib/radisk";
import "gun/lib/store";
import "gun/lib/rindexed";
import "gun/lib/open";

export type { IGunChainReference };

type Version = "v1";

interface GunState {
  "/hasparus-bazgrol": Record<Version, SharedState>;
}

/**
 * for declaration merging
 */
export interface SharedState {}

export const gun = Gun<GunState>({
  peers: ["https://gun-server-stonetop.herokuapp.com/gun"],
  localStorage: false,
})
  .get("/hasparus-bazgrol")
  .get("v1");

makeGlobal({ gun });
