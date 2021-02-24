import { application_path } from "../globals/document";
import sheetString from "../../actions/SpreadsheetAi.aia";

function loadSpreadsheetActions() {
  var f = new File(application_path + "/SpreadsheetAi_auto.aia");
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
