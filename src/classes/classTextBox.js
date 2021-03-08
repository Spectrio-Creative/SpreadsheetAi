import { getLayerSheetCC } from "../globals/globals";
import { getFontFamily } from "../tools/classTools";
import { deMoustache } from "../tools/textTools";
import { hexToRgb } from "../tools/tools";

class AiTextBox {
  constructor(item, value, options) {
    this.obj = item;

    // Set value if value is given
    if (value) {
      let sanatizedVal = value.replace(/""/g, "\"");
      if (/^(['"]).*\1$/.test(sanatizedVal))
        sanatizedVal = sanatizedVal.slice(1, -1);

      this.setText(sanatizedVal);
    }

    this.options = options;
    this.expandOptions();
    this.original = { height: 0, width: 0 };
    this.getDimensions();
    this.getPosition();
    this.getFont();
    this.fonts = { regular: this.original.textFont };
    if (options.color) {
      const layer_sheet_cc = getLayerSheetCC();
      this.setColor(layer_sheet_cc[options.color]);
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

  getPosition() {
    this.original.top = this.obj.top;
    this.original.left = this.obj.left;
  }

  getFont() {
    const textFont = this.obj.textRange.characterAttributes.textFont;
    this.original.textFont = textFont;
  }

  getFontAltertatives() {
    const textFont = this.original.textFont,
      family = getFontFamily(textFont),
      styleMatch = /^([\w ]*?)\s*(italic)?\s*?$/i,
      regularMatch = /^(roman|regular|$)/i,
      style = textFont.style.match(styleMatch),
      weight = style[1],
      italic = style[2];

    family.forEach((f) => {
      let fStyle = f.style.match(styleMatch);
      if (
        weight === fStyle[1] ||
        (regularMatch.test(weight) && regularMatch.test(fStyle[1]))
      ) {
        if (italic && fStyle[2]) return;
        if (!italic && !fStyle[2]) return;
        this.fonts.italic = f;
      }
    });

    if (!this.fonts.italic) this.fonts.italic = textFont;
  }

  italicize() {
    if (!this.fonts.italic) this.getFontAltertatives();
    const itMatch = /(?:^|[^\w])(_[^_]*?_)(?!\w)/g;

    let workingText = this.obj.contents;

    if (itMatch.test(workingText)) {
      let italicText = workingText.match(itMatch);

      italicText.forEach((t) => {
        let text = t[0] === "_" ? t : t.substring(1);
        let workingTextRange = this.obj.textRange,
          start = workingText.indexOf(text),
          end = start + text.length;

        workingTextRange.start = start;
        workingTextRange.end = end;
        workingTextRange.characterAttributes.textFont = this.fonts.italic;
        workingTextRange.contents = text.slice(1, -1);

        workingText =
          workingText.substring(0, start) +
          text.slice(1, -1) +
          workingText.substring(end);
      });
    }
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
    const calculateVisible = (lines) => {
      let total = 0;
      for (let i = 0; i < lines.length; i++) {
        total += lines[0].characters.length;
      }
      return total;
    };

    if (textBox.lines.length > 0) {
      let visibleLines = calculateVisible(textBox.lines);
      // alert(`${visibleLines} > ${textBox.characters.length}`);
      if (visibleLines < textBox.characters.length) {
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
    let lineHeight = this.obj.textRange.characterAttributes.leading,
      isolatedLeading =
        lineHeight - this.obj.textRange.characterAttributes.size,
      linesN = this.obj.lines.length,
      projectedH = lineHeight * linesN - isolatedLeading;

    // alert(`resizeBox
    // this.obj.textRange.characterAttributes.size: ${this.obj.textRange.characterAttributes.size}
    // this.obj.paragraphs[0].autoLeadingAmount: ${this.obj.paragraphs[0].autoLeadingAmount}
    // lineHeight: ${lineHeight}
    // isolatedLeading: ${isolatedLeading}
    // characterAttributes.autoLeading: ${this.obj.textRange.characterAttributes.autoLeading}
    // characterAttributes.leading: ${this.obj.textRange.characterAttributes.leading}
    // linesN: ${linesN}
    // projectedH: ${projectedH}
    // this.maxHeightInPixels: ${this.maxHeightInPixels}
    // `);

    if (this.maxHeightInPixels < projectedH)
      projectedH = this.maxHeightInPixels - isolatedLeading;

    this.obj.textPath.height = projectedH;
    if (!cancelFitting) this.fitToBox();
    if (cancelFitting && linesN === 1) this.resizeBoxWidth();

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

    // Respect text alignment
    let widthDifference = this.original.width - this.obj.textPath.width;
    switch (
      this.obj.textRange.paragraphAttributes.justification
        .toString()
        .toLowerCase()
        .replace("justification.", "")
        .replace("fulljustify", "")
    ) {
    case "center":
      this.obj.left = widthDifference / 2 + this.original.left;
      break;
    case "right":
      this.obj.left = this.original.left + widthDifference;
      break;
    default:
      break;
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
    if (rgb === null) {
      alert(`Error thrown while setting text color.
      '${hex}' must be formatted as a hex color to be used as a color value.`);
      return;
    }
    let fill = new RGBColor();

    fill.red = rgb.r;
    fill.green = rgb.g;
    fill.blue = rgb.b;

    this.obj.textRange.characterAttributes.fillColor = fill;
  }
}

export { AiTextBox };
