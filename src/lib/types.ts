export type SvgPath = string;

export interface Keys {
  shift: boolean;
  meta: boolean;
  alt: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface PointWithPressure extends Point {
  pressure?: number | undefined;
}

export interface Mark {
  id: string;
  points: PointWithPressure[];
  path: string;
  color: string;
}

export interface Pointer extends Point {
  cx: number;
  cy: number;
  dx: number;
  dy: number;
  tx: number;
  ty: number;
  p: number;
  type: "pen" | "mouse" | "touch";
}

export interface ClipboardMessage {
  error: boolean;
  message: string;
}
