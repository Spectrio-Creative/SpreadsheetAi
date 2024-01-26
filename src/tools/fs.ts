import { templatePath } from "../globals/document";
// @ts-expect-error
import sheetString from "../../actions/SpreadsheetAi.aia";
import { cleanUp } from '../plot_points/setup';

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

export function exit(notification: string) {
  alert(notification);
  cleanUp();
  app.beep();
  return;
}

export const openCSV = () => {
  if (File.fs === "Windows") {
    return File.openDialog(
      "Open CSV file",
      "Text: *.csv,All files: *.*",
      false
    );
  }

  return File.openDialog(
    "Open CSV file",
    function (file: File | Folder) {
      if (file instanceof Folder) return true;
      if (file.hidden) return false;
      if (file.name.match(/\.csv$/i)) return true;
      if (file.type == "CSV ") return true;
    },
    false
  );
};