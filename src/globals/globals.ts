import { SheetInfo } from "../classes/SheetInfo";
import { camelCase } from "../tools/tools";

let layer_sheet = {},
  layer_sheet_cc = {};

const getLayerSheet = () => {
  return layer_sheet;
};

const getLayerSheetCC = () => {
  return layer_sheet_cc;
};

const setLayerSheet = (sheet) => {
  layer_sheet = sheet;
  layer_sheet_cc = {};
  for (const key in layer_sheet) {
    layer_sheet_cc[camelCase(key)] = layer_sheet[key];
  }
};

export const circleBack = [];

export const sheetInfo = new SheetInfo();

export { getLayerSheet, setLayerSheet, getLayerSheetCC, layer_sheet, layer_sheet_cc };
