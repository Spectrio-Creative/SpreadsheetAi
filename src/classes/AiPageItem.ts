export interface AiPageItemOptions {
  maxHeight?: number;
  color?: string;
  align?: string;
  padding?: [number, number, number, number];
}

export class AiPageItem {
  uuid: string;
  obj: PageItem;
  original: Box;
  stored: Box;
  options: AiPageItemOptions;
  padding: number[];
  name: string;
  typename: string;
  constructor(item: PageItem) {

    this.obj = item;
    this.options = parseOptions(item.name);
    this.original = { height: 0, width: 0, ratio: 1, top: 0, left: 0 };
    this.stored = { height: 0, width: 0, top: 0, left: 0 };
    this.resetOriginalDimensions();
    this.resetOriginalPosition();
    this.padding = [0, 0, 0, 0];

    this.name = item.name;
    this.typename = "Ai" + item.typename;
  }

  top() {
    return this.obj.top;
  }

  left() {
    return this.obj.left;
  }

  height() {
    return this.obj.height;
  }

  width() {
    return this.obj.width;
  }

  typeName() {
    return this.obj.typename;
  }

  setHeight(height: number) {
    this.obj.height = height;
    return height;
  }

  setWidth(width: number) {
    this.obj.width = width;
    return width;
  }

  setSize(width: number, height: number) {
    this.setHeight(height);
    this.setWidth(width);
    return [width, height];
  }

  hide() {
    const parent = this.obj.parent as PageItem;
    this.storeSizeAndPosition();
    this.setSize(0.1, 0.1);
    this.setPosition(
      parent.left + parent.width,
      parent.top - parent.height
    );
  }

  unHide() {
    this.resetFromStored();
  }

  setPadding(padding) {
    if (Array.isArray(padding)) {
      if (padding.length > 4)
        this.padding = [padding[0], padding[1], padding[2], padding[3]];
      if (padding.length === 4) this.padding = padding;
      if (padding.length === 3)
        this.padding = [padding[0], padding[1], padding[2], padding[1]];
      if (padding.length === 2)
        this.padding = [padding[0], padding[1], padding[0], padding[1]];
      if (padding.length === 1)
        this.padding = [padding[0], padding[0], padding[0], padding[0]];
      return;
    }

    const top = padding.top || 0,
      bottom = padding.bottom || 0,
      left = padding.left || 0,
      right = padding.right || 0;

    this.padding = [top, right, bottom, left];
  }

  offset(axis?: "x" | "y") {
    const offset = {
      y: this.height() - this.original.height,
      x: this.width() - this.original.width,
    };

    if (axis) return offset[axis];
    return offset;
  }

  move(x: number, y: number) {
    // Check for NaN
    if (x !== x) x = 0;
    if (y !== y) y = 0;

    this.obj.top -= y;
    this.obj.left -= x;
  }

  setPosition(x, y) {
    this.obj.top = y;
    this.obj.left = x;
  }

  shrink(x, y) {
    x = x || 0;
    y = y || 0;

    this.obj.height -= y;
    this.obj.width -= x;
  }

  resetOriginalDimensions() {
    try {
      this.original.height = this.height();
      this.original.width = this.width();
      this.original.ratio = this.original.width / this.original.height;

    } catch (error) {
      alert(`Error thrown while getting text dimensions.
      layer: ${this.obj.name}
      layer kind: ${(this.obj as TextFrame)?.kind}
      ${error.name}
      ${error.message}
      (line #${error.line} in ${$.stack.match(/\[(.*?)\]/)[1]})`);
      throw error;
    }
  }

  resetOriginalPosition() {
    this.original.top = this.obj.top;
    this.original.left = this.obj.left;
  }

  storeSizeAndPosition() {
    this.stored.height = this.obj.height;
    this.stored.width = this.obj.width;
    this.stored.top = this.obj.top;
    this.stored.left = this.obj.left;
  }

  resetFromStored() {
    this.obj.height = this.stored.height;
    this.obj.width = this.stored.width;
    this.obj.top = this.stored.top;
    this.obj.left = this.stored.left;
  }
}