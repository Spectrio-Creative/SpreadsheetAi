import { templatePath } from "../globals/document";
// @ts-expect-error
import sheetString from "../../actions/SpreadsheetAi.aia";

export function loadSpreadsheetActions() {
  const actionFile = new File(templatePath + "/SpreadsheetAi_auto.aia");
  actionFile.open("w");
  actionFile.write(sheetString);
  actionFile.close();
  app.loadAction(actionFile); //LINE 75
  actionFile.remove();
}

export function removeSpreadsheetAction() {
  app.unloadAction("SpreadsheetAi", "");
}