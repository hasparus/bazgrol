import type { StrokeOptions } from "perfect-freehand";
import freehandGetStroke from "perfect-freehand";

import type { PointWithPressure, SvgPath } from "./types";

export const PATH_COMPLETE = Symbol("path complete");
export type PATH_COMPLETE = typeof PATH_COMPLETE;

const strokeOptions: StrokeOptions = {
  size: 14,
  thinning: 0.4,
  smoothing: 0.6,
  streamline: 0.5,
  start: {
    taper: 130,
  },
  end: {
    taper: 130,
  },
  simulatePressure: true,
};

export type Stroke = ReturnType<typeof freehandGetStroke>;

function getSvgPathFromStroke(stroke: Stroke): SvgPath {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

export const getStrokePath = (
  points: PointWithPressure[],
  pathComplete?: PATH_COMPLETE
) =>
  getSvgPathFromStroke(
    freehandGetStroke(
      points,
      pathComplete ? { ...strokeOptions, last: true } : strokeOptions
    )
  );
