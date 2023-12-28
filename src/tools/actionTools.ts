import { templatePath } from "../globals/document";
// @ts-expect-error
import sheetString from "../../actions/SpreadsheetAi.aia";

function loadSpreadsheetActions() {
  const actionFile = new File(templatePath + "/SpreadsheetAi_auto.aia");
  actionFile.open("w");
  actionFile.write(sheetString);
  actionFile.close();
  app.loadAction(actionFile); //LINE 75
  actionFile.remove();
}

function removeSpreadsheetAction() {
  app.unloadAction("SpreadsheetAi", "");
}

export { loadSpreadsheetActions, removeSpreadsheetAction };
