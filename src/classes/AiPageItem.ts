interface AiPageItemOptions {
  maxHeight?: number;
  color?: string;
  align?: string;
  padding?: [number, number, number, number];
}

class AiPageItem {
  obj: PageItem;
  original: Box;
  stored: Box;
  options: AiPageItemOptions;
  padding: number[];

  constructor(item: PageItem, options: AiPageItemOptions) {
    this.obj = item;
    this.original = { height: 0, width: 0, ratio: 1 };
    this.stored = { height: 0, width: 0, top: 0, left: 0 };
    this.options = options;
    this.getDimensions();
    this.getPosition();
    this.padding = [0, 0, 0, 0];
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

  setHeight(height) {
    this.obj.height = height;
    return height;
  }

  setWidth(width) {
    this.obj.width = width;
    return width;
  }

  setSize(width, height) {
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

  offset(axis?: 'x' | 'y') {
    const offset = {
      y: this.obj.height - this.original.height,
      x: this.obj.width - this.original.width,
    };

    if (axis) return offset[axis];
    return offset;
  }

  move(x, y) {
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

  getDimensions() {
    this.original.height = this.obj.height;
    this.original.width = this.obj.width;
    this.original.ratio = this.obj.width / this.obj.height;
  }

  getPosition() {
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

export { AiPageItem };
