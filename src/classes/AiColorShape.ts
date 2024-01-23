import { getLayerSheetCC } from "../globals/globals";
import { hexToRgb } from '../tools/colors';
import { AiPageItem } from "./AiPageItem";

export interface AiColorShapeOptions {
  color?: string;
}

export class AiColorShape extends AiPageItem {
  obj: PathItem;

  constructor(item: PathItem, value: string, options: AiColorShapeOptions) {
    super(item, options);

    let hex = value;
    if (options.color) {
      const layer_sheet_cc = getLayerSheetCC();
      hex = layer_sheet_cc[options.color];
    }
    if (hex) this.setFillColor(hex);
  }

  setFillColor(hex: string) {
    const rgb = hexToRgb(hex);
    if (rgb === null) {
      alert(`Error thrown while setting path color.
      '${hex}' must be formatted as a hex color to be used as a color value.`);
      return;
    }
    const fill = new RGBColor();

    fill.red = rgb.r;
    fill.green = rgb.g;
    fill.blue = rgb.b;

    this.obj.fillColor = fill;
  }
}