import { getLayerSheetCC } from "../globals/globals";
import { getFontFamily } from "../tools/classTools";
import { littleId } from '../tools/littleId';
import { deMoustache } from "../tools/text";
import { hexToRgb } from "../tools/tools";

export interface AiTextBoxOptions {
  maxHeight?: number;
  color?: string;
}

export class AiTextBox {
  obj: TextFrame;
  options: AiTextBoxOptions;
  original: Box;
  baseFont: TextFont;
  maxHeightInPixels: number;
  fonts: {
    regular: TextFont;
    italic?: TextFont;
  };
  id: string = littleId();
  

  constructor(item: TextFrame, value: string, options: AiTextBoxOptions) {
    if (item.name === "") item.name = item.contents;

    this.obj = item;

    this.options = options;
    this.expandOptions();
    this.original = { height: 0, width: 0 };
    this.getDimensions();
    this.getPosition();
    this.getFont();
    this.fonts = { regular: this.baseFont };

    // Set value if value is given
    if (value !== undefined) {
      let sanatizedVal = `${value}`.replace(/""/g, "\"");
      if (/^(['"]).*\1$/.test(sanatizedVal))
        sanatizedVal = sanatizedVal.slice(1, -1);

      this.setText(sanatizedVal);
    }

    if (options.color) {
      const layer_sheet_cc = getLayerSheetCC();
      this.setColor(layer_sheet_cc[options.color]);
    }
  }

  setText(value: string) {
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

  offset(axis?: "x" | "y") {
    const offset = {
      y: this.objHeight - this.original.height,
      x: this.objWidth - this.original.width,
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

  get objHeight() {
    if (this.obj.kind === TextType.POINTTEXT) return this.obj.height;
    return this.obj.textPath.height;
  }

  get objWidth() {
    if (this.obj.kind === TextType.POINTTEXT) return this.obj.width;
    return this.obj.textPath.width;
  }

  getDimensions() {    
    try {
      this.original.height = this.objHeight;
      this.original.width = this.objWidth;

    } catch (error) {
      alert(`Error thrown while getting text dimensions.
      layer: ${this.obj.name}
      layer: ${this.obj.kind}
      ${error.name}
      ${error.message}
      (line #${error.line} in ${$.stack.match(/\[(.*?)\]/)[1]})`);
      throw error;
    }
  }

  getPosition() {
    this.original.top = this.obj.top;
    this.original.left = this.obj.left;
  }

  getFont() {
    try {
      const textRange = this.obj.textRange;
      const characterAttributes = textRange.characterAttributes;
      this.baseFont = characterAttributes.textFont;
    } catch (error) {
      // const textRanges = this.obj.textRanges;
      
      // alert(`TextRange: ${textRanges.length}`);

      this.obj.locked = true;

      alert(`Error thrown while getting text font.
      layer: ${this.obj.name}
      layer kind: ${this.obj.kind}
      contents: ${this.obj.contents}
      ${error.name}
      ${error.message}
      (line #${error.line} in ${$.stack.match(/\[(.*?)\]/)[1]})`);
      throw error;
    }
    // const textFont = this.obj.textRange.characterAttributes.textFont;
    // this.baseFont = textFont;
  }

  getFontAltertatives() {
    const textFont = this.baseFont,
      family = getFontFamily(textFont),
      styleMatch = /^([\w ]*?)\s*(italic)?\s*?$/i,
      regularMatch = /^(roman|regular|$)/i,
      style = textFont.style.match(styleMatch),
      weight = style[1],
      italic = style[2];

    family.forEach((font) => {
      const fontStyle = font.style.match(styleMatch);
      if (
        weight === fontStyle[1] ||
        (regularMatch.test(weight) && regularMatch.test(fontStyle[1]))
      ) {
        if (italic && fontStyle[2]) return;
        if (!italic && !fontStyle[2]) return;
        this.fonts.italic = font;
      }
    });

    if (!this.fonts.italic) this.fonts.italic = textFont;
  }

  italicize() {
    if (!this.fonts.italic) this.getFontAltertatives();
    const itMatch = /(?:^|[^\w])(_[^_]*?_)(?!\w)/g;

    let workingText = this.obj.contents;

    if (itMatch.test(workingText)) {
      const italicText = workingText.match(itMatch);

      italicText.forEach((t) => {
        const text = t[0] === "_" ? t : t.substring(1);
        const workingTextRange = this.obj.textRange;
        const start = workingText.indexOf(text);
        const end = start + text.length;

        // @ts-ignore
        workingTextRange.start = start;
        // @ts-ignore
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
        const lineHeight =
        // @ts-ignore
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
      const visibleLines = calculateVisible(textBox.lines);
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

  resizeBox(cancelFitting: boolean = false) {
    this.convertToAreaText();

    const orHeight = this.obj.textPath.height;
    this.obj.textPath.height = 10000;
    const lineHeight = this.obj.textRange.characterAttributes.leading;
    const isolatedLeading =
        lineHeight - this.obj.textRange.characterAttributes.size;
    const linesN = this.obj.lines.length;
    let projectedH = lineHeight * linesN - isolatedLeading;

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
    const lineLength = this.longestLine().length;

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
    const widthDifference = this.original.width - this.obj.textPath.width;
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
    const lines = this.obj.lines;
    let line = 0,
      length = 0;
    if (lines.length === 1) return { line, length: lines[0].characters.length };
    for (let i = 0; i < lines.length; i++) {
      const characters = this.obj.lines[i].characters;
      if (characters.length > length) {
        line = i;
        length = characters.length;
      }
    }

    return { line, length };
  }

  replaceMoustaches(lookup: { [key: string]: string }) {
    if (!lookup) return;
    const newText = deMoustache(this.text(), lookup);
    if (newText !== this.text()) {
      this.setText(newText);
      return true;
    }
    return false;
  }

  setColor(hex: string) {
    const rgb = hexToRgb(hex);
    if (rgb === null) {
      alert(`Error thrown while setting text color.
      '${hex}' must be formatted as a hex color to be used as a color value.`);
      return;
    }
    const fill = new RGBColor();

    fill.red = rgb.r;
    fill.green = rgb.g;
    fill.blue = rgb.b;

    this.obj.textRange.characterAttributes.fillColor = fill;
  }

  convertToAreaText(): boolean {
    if (this.obj.kind === TextType.AREATEXT) return true;

    if (this.obj.kind === TextType.POINTTEXT) {
      const name = this.obj.name;
      this.obj.name = name + `_${this.id}`; // temporarily append id to name to avoid name conflicts
      this.obj.convertPointObjectToAreaObject();
      app.redraw();
      
      // reload item
      this.obj = app.activeDocument.pageItems.getByName(name + `_${this.id}`) as TextFrame;
      this.obj.name = name;
      app.redraw();
      
      alert(`Layer "${this.obj.name}" was converted to Area Text.
      If the text box is not the correct size, try converting it to Area Text in your template file and resizing the box appropriately.`);

      return true;
    }

    // if (this.obj.kind === TextType.PATHTEXT) 
    return false;
  }
}