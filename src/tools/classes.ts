import camelCase from 'just-camel-case';
import { AiGroupItem } from '../classes/AiGroupItem';
import { AiPageItem } from '../classes/AiPageItem';
import { AiTextBox } from '../classes/AiTextBox';
import { aiObjByUUID, layer_sheet_cc } from '../globals/globals';
import { is_color, is_image, layer_options } from "./regExTests";
import { stringToObj } from "./tools";
import { AiImage } from '../classes/AiImage';
import { AiColorShape } from '../classes/AiColorShape';

export const locationsAsSingleString = /^([\w.]+) ([\w.]+)/;

export const isStringLocation = (location: string) => {
  return locationsAsSingleString.test(location);
};

export const parseAlignment = (x: Alignment | DoubleAlignment, y?: Alignment): [HorizontalAlignment, VerticalAlignment] => {
  // If x is DoubleAlignment, separate into x and y
  if (typeof x === "string" && / /.test(x)) {
    let [xAlign, yAlign] = x.split(" ");

    // Check to make sure the values aren't reversed and fix if they are
    if (
      (/^(top|bottom)$/.test(xAlign) && /^(left|right|center)$/.test(yAlign)) ||
      (/^(left|right)$/.test(yAlign) && /^(top|bottom|center)$/.test(xAlign))
    ) {
      const temp = xAlign;
      xAlign = yAlign;
      yAlign = temp;
    }

    x = xAlign as HorizontalAlignment;
    y = yAlign as VerticalAlignment;
  }

  if (/^(top|bottom)$/.test(x)) {
    y = x as VerticalAlignment;
    x = "center";
  }

  y = y || (x === "center" ? "center" : "top");

  // Make sure x and y are valid values
  x = (/^(left|center|right)$/.test(x) ? x : "center") as HorizontalAlignment;
  y = (/^(top|center|bottom)$/.test(y) ? y : "center") as VerticalAlignment;

  return [x, y];
};

export const parseLocation = (location: string) => {
  const stringVals = location.match(locationsAsSingleString),
    val1 = stringVals[1],
    val2 = stringVals[2];

  let x: string, y: string;

  if (/top|bottom|center/.test(val1) && !/top|bottom/.test(val2)) y = val1;
  if (/left|right|center/.test(val1) && !/left|right/.test(val2)) x = val1;
  if (/top|bottom|center/.test(val2) && !/top|bottom/.test(val1)) y = val2;
  if (/left|right|center/.test(val2) && !/left|right/.test(val1)) x = val2;

  if (x || y) return { x: x ? x : "center", y: y ? y : "center" };

  if (isNaN(parseFloat(val1)) || isNaN(parseFloat(val2))) {
    return { x: "center", y: "center" };
  }

  return { x: parseFloat(val1), y: parseFloat(val2) };
};

export const getGroupAlignment = (
  group: GroupItem
): { x: HorizontalAlignment; y: VerticalAlignment } => {
  if (group.pageItems.length > 2) return { x: "center", y: "center" };
  let textAlignment = "center";

  group.pageItems.forEach((item) => {
    const options = layer_options.test(item.name)
      ? stringToObj(item.name.match(layer_options)[1])
      : {};
    $.write(options);
    if (item.typename === "TextFrame")
      textAlignment = (
        item as TextFrame
      ).textRange.paragraphAttributes.justification
        .toString()
        .toLowerCase()
        .replace("justification.", "")
        .replace("fulljustify", "");
  });

  const groupAlignment = /^(left|right|center)$/.test(textAlignment)
    ? (textAlignment as HorizontalAlignment)
    : "center";

  return { x: groupAlignment, y: "center" };
};

export const getFontFamily = (textFont: TextFont) => {
  return app.textFonts.filter((tf) => tf.family === textFont.family);
};

export const calculatePosition = (model: Box, obj: Box) => {
  const top = () => model.top;
  const left = () => model.left;

  const bottom = () => model.top - (model.height - obj.height);
  const right = () => model.left + (model.width - obj.width);

  const center = () => (model.width - obj.width) / 2 + model.left;
  const middle = () => (-1 * (model.height - obj.height)) / 2 + model.top;

  const output: { [key in DoubleAlignment]: () => [number, number] } = {
    "left top": () => [left(), top()],
    "left center": () => [left(), middle()],
    "left bottom": () => [left(), bottom()],
    "center top": () => [center(), top()],
    "center center": () => [center(), middle()],
    "center bottom": () => [center(), bottom()],
    "right top": () => [right(), top()],
    "right center": () => [right(), middle()],
    "right bottom": () => [right(), bottom()],
  };

  return output;
};

export const parseOptions = (layerName: string) => {
  const options = layer_options.test(layerName)
    ? stringToObj(layerName.match(layer_options)[1])
    : {};

  return options;
};

export const parseName = (layerName: string): string => {
  if (layer_options.test(layerName)) {
    return layerName.replace(layer_options, '')
  }

  return layerName
}

export type ItemClassType = "AiPageItem" | "AiGroupItem" | "AiImage" | "AiColorShape" | "AiTextBox";

export const getOrMakeItemClass = (item: PageItem, type: ItemClassType | "infer" = 'infer'): AiPageItem => {
  const uuid = item.uuid;
  if (uuid && aiObjByUUID[uuid]) return aiObjByUUID[uuid];

  const newValue = layer_sheet_cc[camelCase(item.name.replace(/\s*\{.*\}\s*$/g, ""))];

  if (type === "infer") {
    if (is_image.test(newValue)) return getOrMakeItemClass(item, "AiImage");
    if (is_color.test(newValue)) return getOrMakeItemClass(item, "AiColorShape");
    if (item.typename === "TextFrame") return getOrMakeItemClass(item, "AiTextBox");
    if (item.typename === "GroupItem") return getOrMakeItemClass(item, "AiGroupItem");
    return getOrMakeItemClass(item, "AiPageItem");
  }

  if (type === "AiTextBox") return new AiTextBox(item as TextFrame, newValue);
  if (type === "AiImage") return new AiImage(item, newValue);
  if (type === "AiColorShape") return new AiColorShape(item as PathItem, newValue);
  if (type === "AiGroupItem") return new AiGroupItem(item as GroupItem);
  return new AiPageItem(item);
};

export const addItemClassToGlobal = (item: AiPageItem, uuid?: string) => {
  if (uuid) aiObjByUUID[uuid] = item;
  if (item.uuid) aiObjByUUID[item.uuid] = item;
};