import { SheetInfo } from "../classes/SheetInfo";
import camelCase from "just-camel-case";

export let layer_sheet: { [key: string]: string } = {};
export let layer_sheet_cc: { [key: string]: string } = {};

export const getLayerSheet = () => {
  return layer_sheet;
};

export const getLayerSheetCC = () => {
  return layer_sheet_cc;
};

export const setLayerSheet = (sheet: { [key: string]: string } ) => {
  layer_sheet = sheet;
  layer_sheet_cc = {};
  for (const key in layer_sheet) {
    layer_sheet_cc[camelCase(key)] = layer_sheet[key];
  }
};

export const templates: Layer[] = [];

export const sheetInfo = new SheetInfo();