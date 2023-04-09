export const inkDecl = `
declare global {
declare function show(...shapes: Array<Shape>): void;
declare function draw(...shapes: Array<Shape>): void;
type Attrs = Record<string, string | number>;
export declare class Shape {
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
export declare function toSVG(shapes: Array<Shape>, width?: number, height?: number): string;
export declare class Circle extends Shape {
    readonly r: number;
    readonly args: {
        center: Point;
    };
    constructor(r: number, args?: {
        center: Point;
    }, attrs?: Attrs);
}
export declare function circle(r: number, args?: typeof Circle.prototype.args, attrs?: Attrs): Circle;
export declare class Ellipse extends Shape {
    readonly width: number;
    readonly height: number;
    readonly args: {
        center: Point;
    };
    constructor(width: number, height: number, args?: {
        center: Point;
    }, attrs?: Attrs);
}
export declare function ellipse(width: number, height: number, args?: typeof Ellipse.prototype.args, attrs?: Attrs): Ellipse;
export declare class Rect extends Shape {
    readonly width: number;
    readonly height: number;
    readonly args: {
        center: Point;
    };
    constructor(width: number, height: number, args?: {
        center: Point;
    }, attrs?: Attrs);
}
export declare function rect(width: number, height: number, args?: typeof Rect.prototype.args, attrs?: Attrs): Rect;
export declare class Line extends Shape {
    readonly start: Point;
    readonly end: Point;
    readonly args: {};
    constructor(start: Point, end: Point, args?: {}, attrs?: Attrs);
}
export declare function line(start: Point, end: Point, args?: typeof Line.prototype.args, attrs?: Attrs): Line;
export declare class Group extends Shape {
    readonly children: Shape[];
    readonly attrs: Attrs;
    constructor(children: Shape[], attrs?: Attrs);
}
export declare function combine(...shapes: Array<Shape>): Shape;
export declare class Point {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    static get zero(): Point;
    equals(other: Point): boolean;
}
export declare function point(x: number, y: number): Point;
export declare abstract class Transformation {
    apply(shape: Shape): Shape;
    join(transform: Transformation): Transformation;
    abstract toString(): string;
}
export declare class MultipleTransformations extends Transformation {
    private readonly transformations;
    constructor(transformations: Transformation[]);
    join(transformation: Transformation): Transformation;
    toString(): string;
}
export declare class Translate extends Transformation {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    toString(): string;
}
export declare class Rotate extends Transformation {
    readonly angle: number;
    readonly anchor: Point;
    constructor(angle: number, anchor?: Point);
    toString(): string;
}
export declare class Scale extends Transformation {
    readonly sx: number;
    readonly sy: number;
    constructor(sx: number, sy: number);
    toString(): string;
}
export declare class Repeat extends Transformation {
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
