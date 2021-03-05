import { getLayerSheetCC } from "../globals/globals";
import { isStringLocation, parseLocation } from "../tools/classTools";
import { hexToRgb } from "../tools/tools";

class AiColorShape {
  constructor(item, value, options) {
    this.obj = item;
    this.options = options;
    this.original = {};
    this.getDimensions();
    this.getPosition();

    let hex = value;
    if (options.color) {
      const layer_sheet_cc = getLayerSheetCC();
      hex = layer_sheet_cc[options.color];
    }
    if (hex) this.setFillColor(hex);
  }

  height() {
    return this.obj.textPath.height;
  }

  width() {
    return this.obj.textPath.width;
  }

  move(x, y) {
    this.obj.top -= y;
    this.obj.left -= x;
  }

  offset(axis) {
    let offset = {
      y: this.obj.height - this.original.height,
      x: this.obj.width - this.original.width,
    };

    if (axis) return offset[axis];
    return offset;
  }
  setFillColor(hex) {
    let rgb = hexToRgb(hex);
    let fill = new RGBColor();

    fill.red = rgb.r;
    fill.green = rgb.g;
    fill.blue = rgb.b;

    this.obj.fillColor = fill;
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

export { AiColorShape };
