import { Awareness } from "y-protocols/awareness";
import { WebrtcProvider } from "y-webrtc";
import * as Yjs from "yjs";

export type { Yjs };

export const yDoc = new Yjs.Doc();

const yWebrtcOptions = {
  // Specify signaling servers. The client will connect to every signaling server concurrently to find other peers as fast as possible.
  signaling: [
    "wss://signaling.yjs.dev",
    "wss://y-webrtc-signaling-eu.herokuapp.com",
    "wss://y-webrtc-signaling-us.herokuapp.com",
  ],
  // If password is a string, it will be used to encrypt all communication over the signaling servers.
  // No sensitive information (WebRTC connection info, shared data) will be shared over the signaling servers.
  // The main objective is to prevent man-in-the-middle attacks and to allow you to securely use public / untrusted signaling instances.
  password: "super-password",
  // Specify an existing Awareness instance - see https://github.com/yjs/y-protocols
  awareness: new Awareness(yDoc),
  // Maximal number of WebRTC connections.
  // A random factor is recommended, because it reduces the chance that n clients form a cluster.
  maxConns: 20 + Math.floor(Math.random() * 15),
  // Whether to disable WebRTC connections to other tabs in the same browser.
  // Tabs within the same browser share document updates using BroadcastChannels.
  // WebRTC connections within the same browser are therefore only necessary if you want to share video information too.
  filterBcConns: true,
  // simple-peer options. See https://github.com/feross/simple-peer#peer--new-peeropts for available options.
  // y-webrtc uses simple-peer internally as a library to create WebRTC connections.
  peerOpts: {},
};

const _webrtcProvider = new WebrtcProvider(
  "hasparus-bazgrol",
  yDoc,
  yWebrtcOptions
);
