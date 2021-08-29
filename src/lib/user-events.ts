import { miniStore } from "./miniEmitter";
import type { Dispatch } from "./stores";
import type { Keys, Pointer } from "./types";

let first: number;
const pointerIds = new Set<number>([]);

const pointer: Pointer = {
  x: 0,
  y: 0,
  cx: 0,
  cy: 0,
  dx: 0,
  dy: 0,
  tx: 0,
  ty: 0,
  p: 0,
  type: "mouse",
};

export const pointerStore = miniStore(pointer);

const keys: Keys = {
  shift: false,
  meta: false,
  alt: false,
};

function updatePointer(e: PointerEvent) {
  const dpr = window.devicePixelRatio || 1;

  const x = e.pageX,
    y = e.pageY,
    cx = x * dpr,
    cy = y * dpr,
    dx = x - pointer.x,
    dy = y - pointer.y,
    type = e.pointerType as "pen" | "mouse" | "touch",
    p = e.pressure === 0.5 ? 0 : e.pressure;

  if (dx === 0 && dy === 0) return false;

  pointer.x = x;
  pointer.y = y;
  pointer.cx = cx;
  pointer.cy = cy;
  pointer.dx = dx;
  pointer.dy = dy;
  pointer.tx += dx;
  pointer.ty += dy;
  pointer.p = p;
  pointer.type = type;
  keys.shift = e.shiftKey;
  keys.meta = e.metaKey;
  keys.alt = e.altKey;

  // Nobody needs it yet.
  // pointerStore.emit(pointer);

  return true;
}

function hasPressure() {
  return pointer.type !== "pen" || pointer.p !== 0;
}

function onTouch(e: TouchEvent) {
  e.preventDefault();
}

// Note: We can disable browser zoom and handle it ourselves, but it's not
// something we need really much, and it complicates other things.
// Gain: Toolbar would always be visible.
// Loss: We have to tranform the pointer coordinates to match the zoom and pan.
//
// /**
//  * @see https://kenneth.io/post/detecting-multi-touch-trackpad-gestures-in-javascript
//  */
// function onWheel(e: WheelEvent) {
//   e.preventDefault();

//   console.log("onWheel", {
//     deltaX: e.deltaX,
//     deltaY: e.deltaY,
//     deltaZ: e.deltaZ,
//   });

//   // if (e.ctrlKey) {
//   // } else {
//   // }
// }
//     // window.addEventListener("wheel", onWheel, { passive: false });
//     // window.removeEventListener("wheel", onWheel);

function handleKeyup(e: KeyboardEvent) {
  keys.shift = e.shiftKey;
  keys.meta = e.metaKey;
  keys.alt = e.altKey;
}

const handleResize = (dispatch: Dispatch) => () => {
  dispatch({ t: "RESIZED" });
};

const handlePointerMove = (dispatch: Dispatch) => (e: PointerEvent) => {
  if (updatePointer(e) && hasPressure()) {
    dispatch({ t: "MOVED_POINTER", pointer, keys });
  }
};

const handlePointerUp = (dispatch: Dispatch) => (e: PointerEvent) => {
  updatePointer(e);
  (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  dispatch({ t: "LIFTED_POINTER", pointer, keys });
};

const handlePointerDown = (dispatch: Dispatch) => (e: PointerEvent) => {
  e.preventDefault();
  (e.target as HTMLElement).setPointerCapture(e.pointerId);

  if (pointerIds.size === 0) {
    first = e.pointerId;
  }

  pointerIds.add(e.pointerId);

  updatePointer(e);

  if (hasPressure()) {
    setTimeout(() => {
      dispatch({ t: "DOWNED_POINTER", pointer, keys });
    }, 16);
  }
};

export function registerEvents(dispatch: Dispatch) {
  const onMount = () => {
    if (typeof window === "undefined") return () => {};

    window.addEventListener("keyup", handleKeyup);

    const onResize = handleResize(dispatch);
    const onPointerMove = handlePointerMove(dispatch);
    const onPointerDown = handlePointerDown(dispatch);
    const onPointerUp = handlePointerUp(dispatch);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("keyup", handleKeyup);

      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  };

  return {
    onTouch: onTouch,
    onMount,
  };
}

export function getPointer(): Pointer {
  return pointer;
}

export function getKeys(): Keys {
  return keys;
}
