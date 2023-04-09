export const inkDecl = `
declare global {
export function show(...shapes: Array<Shape>): void;
export function draw(...shapes: Array<Shape>): void;
export function setViewport(width: number, height: number): void;
export function enableMarkers(): void;
export function disableMarkers(): void;
type Attrs = Record<string, string | number>;
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
    readonly args: {
        center: Point;
    };
    constructor(r: number, args?: {
        center: Point;
    }, attrs?: Attrs);
}
export function circle(r: number, args?: typeof Circle.prototype.args, attrs?: Attrs): Circle;
export class Ellipse extends Shape {
    readonly width: number;
    readonly height: number;
    readonly args: {
        center: Point;
    };
    constructor(width: number, height: number, args?: {
        center: Point;
    }, attrs?: Attrs);
}
export function ellipse(width: number, height: number, args?: typeof Ellipse.prototype.args, attrs?: Attrs): Ellipse;
export class Rect extends Shape {
    readonly width: number;
    readonly height: number;
    readonly args: {
        center: Point;
    };
    constructor(width: number, height: number, args?: {
        center: Point;
    }, attrs?: Attrs);
}
export function rect(width: number, height: number, args?: typeof Rect.prototype.args, attrs?: Attrs): Rect;
export class Line extends Shape {
    readonly start: Point;
    readonly end: Point;
    readonly args: {};
    constructor(start: Point, end: Point, args?: {}, attrs?: Attrs);
}
export function line(start: Point, end: Point, args?: typeof Line.prototype.args, attrs?: Attrs): Line;
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
export function point(x: number, y: number): Point;
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
export class Repeat extends Transformation {
    readonly n: number;
    readonly transformation: Transformation;
    constructor(n: number, transformation: Transformation);
    apply(shape: Shape): Shape;
    private applyRecursive;
    toString(): string;
}
}
export {};
`;
