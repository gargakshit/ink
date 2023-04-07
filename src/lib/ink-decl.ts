export const inkDecl = `
declare global {
type Attrs = Record<string, string | number>;
export function setIdPrefix(prefix: string): void;
export class Shape {
  readonly tag: string;
  readonly attrs: Attrs;
  readonly children: Shape[];
  readonly transformation: Transformation | undefined;
  readonly id: string;
  constructor(tag: string, attrs?: Attrs, children?: Shape[], transformation?: Transformation | undefined);
  get reference(): Shape;
  get attributes(): Attrs;
  svg(indent?: string): string;
  transform(transformation: Transformation): Shape;
  translate(x: number, y: number): Shape;
  rotate(angle: number, anchor?: Point): Shape;
  scale(sx: number, sy: number): Shape;
}
export function toSVG(shapes: Array<Shape>, width?: number, height?: number): string;
export class Circle extends Shape {
  readonly r: number;
  readonly cx: number;
  readonly cy: number;
  constructor(r: number, cx?: number, cy?: number);
}
export function circle(r: number, cx?: number, cy?: number): Circle;
export class Ellipse extends Shape {
  readonly rx: number;
  readonly ry: number;
  readonly center: Point;
  constructor(rx: number, ry?: number, center?: Point);
}
export function ellipse(rx: number, ry?: number, center?: Point): Ellipse;
export class Rect extends Shape {
  readonly width: number;
  readonly height: number;
  readonly rx: number | string;
  readonly ry: number | string;
  constructor(width: number, height: number, rx?: number | string, ry?: number | string);
}
export function rect(width: number, height: number, rx?: typeof Rect.prototype.rx, ry?: typeof Rect.prototype.ry): Rect;
export class Line extends Shape {
  readonly start: Point;
  readonly end: Point;
  constructor(start: Point, end: Point);
}
export function line(start: Point, end: Point): Line;
export class Group extends Shape {
  readonly children: Shape[];
  readonly attrs: Attrs;
  constructor(children: Shape[], attrs?: Attrs);
}
export function combine(...shapes: Array<Shape>): Shape;
export class Point {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number);
  static get zero(): Point;
  equals(other: Point): boolean;
}
export abstract class Transformation {
  apply(shape: Shape): Shape;
  join(transform: Transformation): Transformation;
  abstract toString(): string;
}
export class MultipleTransformations extends Transformation {
  private readonly transformations;
  constructor(transformations: Transformation[]);
  join(transformation: Transformation): Transformation;
  toString(): string;
}
export class Translate extends Transformation {
  readonly x: number;
  readonly y: number;
  constructor(x: number, y: number);
  toString(): string;
}
export class Rotate extends Transformation {
  readonly angle: number;
  readonly anchor: Point;
  constructor(angle: number, anchor?: Point);
  toString(): string;
}
export class Scale extends Transformation {
  readonly sx: number;
  readonly sy: number;
  constructor(sx: number, sy: number);
  toString(): string;
}
}
export {};
`;
