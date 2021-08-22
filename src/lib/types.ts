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

/**
 * GunDB doesn't like arrays
 */
type NumberDict<T> = Record<number, T> & { length: number };
export const NumberDict = {
  empty: () => ({ length: 0 }),
  of: <T>(x: T) => ({ length: 1, 0: x }),
  toArray: <T>(dict: NumberDict<T>): T[] => Array.from(dict),
  append: <T>(dict: NumberDict<T>, x: T): NumberDict<T> => ({
    ...dict,
    length: dict.length + 1,
    [dict.length]: x,
  }),
};

export interface Mark {
  id: string;
  points: NumberDict<PointWithPressure>;
  color: string;
  complete?: boolean;
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

export type Uuid = string;
