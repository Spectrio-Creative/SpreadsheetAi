import { getLayerSheetCC, layer_sheet } from "../globals/globals";
import { deMoustache } from "../tools/textTools";
import { hexToRgb, stringToObj } from "../tools/tools";

class AiTextBox {
  constructor(item, value, options) {
    this.obj = item;

    // Set value if value is given
    if (value) {
      let sanatizedVal = value.replace(/""/g, '"');
      if (/^(['"]).*\1$/.test(sanatizedVal))
        sanatizedVal = sanatizedVal.slice(1, -1);

      this.setText(sanatizedVal);
    }

    this.options = options;
    this.expandOptions();
    this.original = { height: 0, width: 0 };
    this.getDimensions();
    if(options.color) {
      const layer_sheet_cc = getLayerSheetCC();
      this.setColor(layer_sheet_cc[options.color])
    }
  }

  setText(value) {
    this.obj.contents = value;
  }

  text() {
    return this.obj.contents;
  }

  height() {
    return this.obj.textPath.height;
  }

  width() {
    return this.obj.textPath.width;
  }

  offset(axis) {
    let offset = {
      y: this.obj.textPath.height - this.original.height,
      x: this.obj.textPath.width - this.original.width,
    };

    if (axis) return offset[axis];
    return offset;
  }

  move(x, y) {
    this.obj.top -= y;
    this.obj.left -= x;
  }

  getDimensions() {
    this.original.height = this.obj.textPath.height;
    this.original.width = this.obj.textPath.width;
  }

  expandOptions() {
    this.maxHeightInPixels = Number.POSITIVE_INFINITY;
    if (this.options) {
      if (this.options.maxHeight) {
        let lineHeight =
          (this.obj.paragraphs[0].autoLeadingAmount *
            this.obj.textRange.characterAttributes.size) /
          100;

        this.maxHeightInPixels = this.options.maxHeight * lineHeight;
      }
    }
  }

  overset() {
    const textBox = this.obj;

    if (textBox.lines.length > 0) {
      if (
        textBox.lines[0].characters.length * textBox.lines.length <
        textBox.characters.length
      ) {
        return true;
      } else {
        return false;
      }
    } else if (textBox.characters.length > 0) {
      return true;
    }
  }

  fitToBox() {
    while (this.overset()) {
      this.obj.textRange.characterAttributes.size -= 1;
    }
    this.resizeBox(true);
  }

  resizeBox(cancelFitting) {
    let orHeight = this.obj.textPath.height;
    this.obj.textPath.height = 10000;
    let lineHeight =
        (this.obj.paragraphs[0].autoLeadingAmount *
          this.obj.textRange.characterAttributes.size) /
        100,
      isolatedLeading =
        lineHeight - this.obj.textRange.characterAttributes.size,
      linesN = this.obj.lines.length,
      projectedH = lineHeight * linesN - isolatedLeading;

    if (this.maxHeightInPixels < projectedH)
      projectedH = this.maxHeightInPixels - isolatedLeading;

    this.obj.textPath.height = projectedH;
    if (!cancelFitting) this.fitToBox();
    if (linesN === 1) this.resizeBoxWidth();

    return projectedH - orHeight;
  }

  resizeBoxWidth() {
    let lineLength = this.longestLine().length;

    while (
      this.longestLine().length >= lineLength &&
      this.obj.textPath.width > 10
    ) {
      this.obj.textPath.width -= 10;
    }

    while (this.longestLine().length < lineLength) {
      this.obj.textPath.width += 0.5;
    }
  }

  longestLine() {
    let lines = this.obj.lines;
    let line = 0,
      length = 0;
    if (lines.length === 1) return { line, length: lines[0].characters.length };
    for (let i = 0; i < lines.length; i++) {
      let characters = this.obj.lines[i].characters;
      if (characters.length > length) {
        line = i;
        length = characters.length;
      }
    }

    return { line, length };
  }

  replaceMoustaches(lookup) {
    if (!lookup) return;
    const newText = deMoustache(this.text(), lookup);
    if (newText !== this.text()) {
      this.setText(newText);
      return true;
    }
    return false;
  }

  setColor(hex) {
    let rgb = hexToRgb(hex);
    let fill = new RGBColor();

    fill.red = rgb.r;
    fill.green = rgb.g;
    fill.blue = rgb.b;

    this.obj.textRange.characterAttributes.fillColor = fill;
  }
}

export { AiTextBox };
