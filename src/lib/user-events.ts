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

  return true;
}

function hasPressure() {
  return pointer.type !== "pen" || pointer.p !== 0;
}

function onTouch(e: TouchEvent) {
  e.preventDefault();
}

const handlePointerMove = (dispatch: Dispatch) => (e: PointerEvent) => {
  if (updatePointer(e) && hasPressure()) {
    dispatch({ t: "MOVED_POINTER", pointer, keys });
  }
};

const handlePointerUp = (dispatch: Dispatch) => (e: PointerEvent) => {
  updatePointer(e);
  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  dispatch({ t: "LIFTED_POINTER", pointer, keys });
};

const handlePointerDown = (dispatch: Dispatch) => (e: PointerEvent) => {
  e.preventDefault();
  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

  if (pointerIds.size === 0) first = e.pointerId;

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

    function handleKeydown(e: KeyboardEvent) {
      keys.shift = e.shiftKey;
      keys.meta = e.metaKey;
      keys.alt = e.altKey;
      dispatch({
        t: "PRESSED_KEY",
        pointer,
        keys,
        key: e.key,
      });
    }

    function handleKeyup(e: KeyboardEvent) {
      keys.shift = e.shiftKey;
      keys.meta = e.metaKey;
      keys.alt = e.altKey;
    }

    function handleResize() {
      dispatch({ t: "RESIZED" });
    }

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
      window.removeEventListener("resize", handleResize);
    };
  };

  return {
    onPointerMove: handlePointerMove(dispatch),
    onPointerDown: handlePointerDown(dispatch),
    onPointerUp: handlePointerUp(dispatch),
    onTouch: onTouch,
    onMount,
  };
}

export function getPointer(): Pointer {
  return pointer;
}
