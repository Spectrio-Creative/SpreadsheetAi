import { application_path } from "../globals/document";
// @ts-expect-error
import sheetString from "../../actions/SpreadsheetAi.aia";

function loadSpreadsheetActions() {
  const f = new File(application_path + "/SpreadsheetAi_auto.aia");
  f.open("w");
  f.write(sheetString);
  f.close();
  app.loadAction(f); //LINE 75
  f.remove();
}

function removeSpreadsheetAction() {
  app.unloadAction("SpreadsheetAi", "");
}

export { loadSpreadsheetActions, removeSpreadsheetAction };
