class AiPageItem {
  constructor(item, options) {
    this.obj = item;
    this.original = { height: 0, width: 0, ratio: 1 };
    this.stored = { height: 0, width: 0, top: 0, left: 0 };
    this.options = options;
    this.getDimensions();
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
    this.storeSizeAndPosition();
    this.setSize(.1, .1);
    this.setPosition(
      this.obj.parent.left + this.obj.parent.width,
      this.obj.parent.top - this.obj.parent.height
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

    let top = padding.top || 0,
      bottom = padding.bottom || 0,
      left = padding.left || 0,
      right = padding.right || 0;

    this.padding = [top, right, bottom, left];
  }

  offset(axis) {
    let offset = {
      y: 0, //(this.obj.textPath.height - this.original.height),
      x: 0, //(this.obj.textPath.width - this.original.width),
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
