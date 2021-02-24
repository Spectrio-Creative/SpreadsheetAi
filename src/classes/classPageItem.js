class AiPageItem {
  constructor(item) {
    this.obj = item;
    this.original = { height: 0, width: 0, ratio: 1 };
    this.getDimensions();
  }

  height() {
    return this.obj.textPath.height;
  }

  width() {
    return this.obj.textPath.width;
  }

  offset(axis) {
    let offset = {
      y: 0,//(this.obj.textPath.height - this.original.height),
      x: 0//(this.obj.textPath.width - this.original.width),
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

  getDimensions() {
    this.original.height = this.obj.height;
    this.original.width = this.obj.width;
    this.original.ratio = this.obj.width / this.obj.height;
  }
}

export { AiPageItem };
