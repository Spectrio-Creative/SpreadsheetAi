import { stringToObj } from "../tools/tools";

class AiTextBox {
  constructor(item, value, options) {
    this.obj = item;

    // Set value if value is given
    if (value) this.setText(value);

    this.options = options;
    this.original = { height: 0, width: 0 };
    this.getDimensions();
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
  }

  resizeBox() {
    let orHeight = this.obj.textPath.height;
    this.obj.textPath.height = 10000;
    let lineHeight =
        (this.obj.paragraphs[0].autoLeadingAmount *
          this.obj.textRange.characterAttributes.size) /
        100,
      isolatedLeading =
        lineHeight - this.obj.textRange.characterAttributes.size,
      linesN = this.obj.lines.length,
      projectedH = lineHeight * linesN - isolatedLeading,
      maxH = this.options.maxHeight
        ? this.options.maxHeight
        : Number.POSITIVE_INFINITY;

    if (maxH * lineHeight < projectedH)
      projectedH = this.options.maxHeight * lineHeight - isolatedLeading;

    this.obj.textPath.height = projectedH;
    this.fitToBox();

    return projectedH - orHeight;
  }

  replaceMoustaches(lookup) {
    if (!lookup) return;
    for (key in lookup) {
      moustache = new RegExp(
        "{{[\\s]*" + key.replace(" ", "[\\s]{0,1}") + "[\\s]*}}",
        "i"
      );
      if (moustache.test(this.text())) {
        this.setText(this.text().replace(moustache, lookup[key]));
      }
    }
  }
}

export { AiTextBox };
