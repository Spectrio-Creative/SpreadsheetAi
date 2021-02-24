import { active_document, application_path } from "../document";

class AiGroupItem {
  constructor(item) {
    this.obj = item;
    this.original = { height: 0, width: 0, ratio: 1 };
    this.getDimensions();
    this.getPosition();
  }

  height() {
    return this.obj.textPath.height;
  }

  width() {
    return this.obj.textPath.width;
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
    if (typeof x === "string") {
      x = x || "top";
      y = y || x === "center" ? "center" : "left";

      exes = {
        top: this.original.top,
        center:
          (this.obj.height - this.original.height) / 2 + this.original.top,
        bottom: this.original.top + (this.obj.height - this.original.height),
      };
      whys = {
        left: this.original.left,
        center: (this.obj.width - this.original.width) / 2 + this.original.left,
        bottom: this.original.left + (this.obj.width - this.original.width),
      };

      this.obj.top = exes[x] ? exes[x] : this.obj.top;
      this.obj.left = whys[y] ? whys[y] : this.obj.left;

      return;
    }

    this.obj.top = y;
    this.obj.left = x;
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
}

export { AiGroupItem };
