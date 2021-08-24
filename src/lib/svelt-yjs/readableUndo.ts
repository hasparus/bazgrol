import { Readable, readable } from "svelte/store";
import type * as Y from "yjs";

export type ReadableUndo = Readable<{ undoSize: number; redoSize: number }>;

/**
 * @see https://docs.yjs.dev/api/undo-manager
 * @source svelt-yjs
 * - https://github.dev/relm-us/svelt-yjs
 * - https://github.com/relm-us/svelt-yjs/blob/79c284ec8c46cacbedf1a1ecfd6cd3b4779c69eb/src/undo.ts#L15-L15
 */
export function readableUndo(undoManager: Y.UndoManager): ReadableUndo {
  const stackCount = readable({ undoSize: 0, redoSize: 0 }, (set) => {
    let undoSize = 0;
    let redoSize = 0;

    const updateStackSizes = () => {
      undoSize = undoManager.undoStack.length;
      redoSize = undoManager.redoStack.length;
      set({ undoSize, redoSize });
    };

    const added = (/* { stackItem,  type } */) => {
      updateStackSizes();
    };

    const popped = (/* { stackItem,  type } */) => {
      updateStackSizes();
    };

    undoManager.on("stack-item-added", added);
    undoManager.on("stack-item-popped", popped);

    return () => {
      // clean up when readable store is unsubscribed
      undoManager.off("stack-item-added", added);
      undoManager.off("stack-item-popped", popped);
    };
  });

  return stackCount;
}
