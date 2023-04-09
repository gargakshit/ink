type Attrs = Record<string, string | number>;

const characters = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
const idPrefix =
  "ink-" +
  new Array(4)
    .fill("")
    .map(() => characters[Math.floor(Math.random() * characters.length)])
    .join("");

function* sequence(prefix: string) {
  for (let count = 0; ; count++) {
    yield `${prefix}${count}`;
  }
}

let idSequence = sequence(idPrefix);

function escapeHTML(unsafe: string) {
  return unsafe;
}

function renderTag(tag: string, attrs: Attrs, closed = false) {
  const closing = closed ? " />" : ">";

  const entries = Object.entries(attrs);
  if (entries.length === 0) {
    return `<${tag}${closing}`;
  }

  const attrText = entries
    .map(
      ([name, value]) => `${escapeHTML(name)}="${escapeHTML(value.toString())}"`
    )
    .join(" ");
  return `<${tag} ${attrText}${closing}`;
}

export class Shape {
  readonly id: string;

  constructor(
    public readonly tag: string,
    public readonly attrs: Attrs = {},
    public readonly children: Shape[] = [],
    public readonly transformation: Transformation | undefined = undefined
  ) {
    this.id = idSequence.next().value!;
  }

  get reference() {
    return new Shape("use", { "xlink:href": `#${this.id}` });
  }

  get attributes() {
    const attrs = Object.assign({}, this.attrs);

    if (this.tag !== "use") {
      attrs["id"] = this.id;
    }

    if (this.transformation) {
      attrs["transform"] = this.transformation.toString();
    }

    return attrs;
  }

  svg(indent = ""): string {
    const attrs = this.attributes;

    if (this.children.length === 0) {
      return `${indent}${renderTag(this.tag, attrs, true)}`;
    }

    return `${indent}${renderTag(this.tag, attrs, false)}
${this.children.map((c) => c.svg(indent + "  ")).join("\n")}
${indent}</${this.tag}>`;
  }

  transform(transformation: Transformation): Shape {
    return transformation.apply(this);
  }

  translate(x: number, y: number) {
    return this.transform(new Translate(x, y));
  }

  rotate(angle: number, anchor = Point.zero) {
    return this.transform(new Rotate(angle, anchor));
  }

  scale(sx: number, sy: number) {
    return this.transform(new Scale(sx, sy));
  }
}

export function toSVG(shapes: Array<Shape>, width = 300, height = 300) {
  const tag = renderTag("svg", {
    width: width,
    height: height,
    viewBox: `-${width / 2} -${height / 2} ${width} ${height}`,
    fill: "none",
    stroke: "black",
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
  });

  const node = combine(...shapes).transform(new Scale(1, -1));

  return `${tag}
${node.svg("  ")}
</svg>`;
}

export class Circle extends Shape {
  constructor(
    public readonly r: number,
    public readonly args = { center: Point.zero },
    attrs: Attrs = {}
  ) {
    super("circle", {
      r: r,
      cx: args.center.x,
      cy: args.center.y,
      ...attrs,
    });
  }
}

export function circle(
  r: number,
  args: typeof Circle.prototype.args = { center: Point.zero },
  attrs: Attrs = {}
) {
  return new Circle(r, args, attrs);
}

export class Ellipse extends Shape {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly args = { center: Point.zero },
    attrs: Attrs = {}
  ) {
    super("ellipse", {
      rx: width / 2,
      ry: height / 2,
      cx: args.center.x,
      cy: args.center.y,
      ...attrs,
    });
  }
}

export function ellipse(
  width: number,
  height: number,
  args: typeof Ellipse.prototype.args = { center: Point.zero },
  attrs: Attrs = {}
) {
  return new Ellipse(width, height, args, attrs);
}

export class Rect extends Shape {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly args = { center: Point.zero },
    attrs: Attrs = {}
  ) {
    super("rect", {
      width: width,
      height: height,
      x: args.center.x - width / 2,
      y: args.center.y - height / 2,
      ...attrs,
    });
  }
}

export function rect(
  width: number,
  height: number,
  args: typeof Rect.prototype.args = { center: Point.zero },
  attrs: Attrs = {}
) {
  return new Rect(width, height, args, attrs);
}

export class Line extends Shape {
  constructor(
    public readonly start: Point,
    public readonly end: Point,
    public readonly args = {},
    attrs: Attrs = {}
  ) {
    super("line", {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      ...attrs,
    });
  }
}

export function line(
  start: Point,
  end: Point,
  args: typeof Line.prototype.args = {},
  attrs: Attrs = {}
) {
  return new Line(start, end, args, attrs);
}

export class Group extends Shape {
  constructor(readonly children: Shape[], public readonly attrs: Attrs = {}) {
    super("g", attrs, children);
  }
}

export function combine(...shapes: Array<Shape>): Shape {
  return new Group(shapes);
}

export class Point {
  constructor(public readonly x: number, public readonly y: number) {}

  static get zero() {
    return new Point(0, 0);
  }

  equals(other: Point) {
    return other.x === this.x && other.y === this.y;
  }
}

export function point(x: number, y: number) {
  return new Point(x, y);
}

export abstract class Transformation {
  apply(shape: Shape): Shape {
    return new Shape(
      shape.tag,
      Object.assign({}, shape.attrs),
      [...shape.children],
      shape.transformation ? this.join(shape.transformation) : this
    );
  }

  join(transform: Transformation): Transformation {
    return new MultipleTransformations([this, transform]);
  }

  abstract toString(): string;
}

export class MultipleTransformations extends Transformation {
  constructor(private readonly transformations: Transformation[]) {
    super();
  }

  join(transformation: Transformation): Transformation {
    return new MultipleTransformations([
      ...this.transformations,
      transformation,
    ]);
  }

  toString(): string {
    return this.transformations
      .reverse()
      .map((t) => t.toString())
      .join(", ");
  }
}

export class Translate extends Transformation {
  constructor(public readonly x: number, public readonly y: number) {
    super();
  }

  toString(): string {
    return `translate(${this.x}, ${this.y})`;
  }
}

export class Rotate extends Transformation {
  constructor(
    public readonly angle: number,
    public readonly anchor = Point.zero
  ) {
    super();
  }

  toString(): string {
    if (this.anchor.equals(Point.zero)) {
      return `rotate(${this.angle})`;
    }

    return `rotate(${this.angle}, ${this.anchor.x}, ${this.anchor.y})`;
  }
}

export class Scale extends Transformation {
  constructor(public readonly sx: number, public readonly sy: number) {
    super();
  }

  toString(): string {
    return `scale(${this.sx}, ${this.sy})`;
  }
}

export class Repeat extends Transformation {
  constructor(
    public readonly n: number,
    public readonly transformation: Transformation
  ) {
    super();
  }

  apply(shape: Shape): Shape {
    const ref = shape.reference;
    const def = new Shape("def", {}, [shape]);

    return combine(def, this.applyRecursive(this.n, this.transformation, ref));
  }

  private applyRecursive(
    n: number,
    transformation: Transformation,
    shape: Shape
  ): Shape {
    if (n <= 0) {
      return combine();
    }

    if (n === 1) {
      return shape;
    }

    return combine(
      shape,
      this.applyRecursive(n - 1, transformation, shape).transform(
        transformation
      )
    );
  }

  toString(): string {
    throw new Error("Should never be called!");
  }
}
