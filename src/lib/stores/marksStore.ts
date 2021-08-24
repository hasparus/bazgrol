import { readableArray } from "../svelt-yjs/readabeArray";
import type { Mark } from "../types";
import type { Yjs } from "../yjs";
import { yDoc } from "../yjs";

const marksYArray: Yjs.Array<Mark> = yDoc.getArray("marks");

export const marksStore = readableArray(marksYArray);

export type MarksState = Mark[];

export const MarksState = {
  push(mark: Mark) {
    marksYArray.push([mark]);
  },
};
