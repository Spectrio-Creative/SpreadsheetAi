// Illustrator reserves the keyword 'version', but we need it for our own version;
let aiVersion = version;
import { setUpArrayMethods } from "./arrayMethods";
import { extendExtendscript } from "./jsxMethods";
import convertObj from "./convertObj";
import { createLayer } from "./createLayer";
import { setLayerSheet } from "./tools/globals";
import { version as scriptVersion } from "../package.json";
import {
  loadSpreadsheetActions,
  removeSpreadsheetAction,
} from "./tools/actionTools";

const main = () => {
  alert(`SpreadsheetAi (v${scriptVersion})`);
  loadSpreadsheetActions();

  const myFile = File.openDialog(`Please select CSV Spreadsheet.`);
  setUpArrayMethods();
  extendExtendscript();

  if (myFile != null) {
    // open file
    var fileOK = myFile.open("r"),
      fileObj = [],
      fileObj2 = "";
    if (fileOK) {
      var text;
      while (!myFile.eof) {
        text = myFile.readln();
        fileObj2 += text + "\\n";
      }

      fileObj = fileObj2
        .slice(0, -2)
        .replace(/,(?!(?:[^"]|"[^"]*")*$)/g, "\\;")
        .replace(/\\n(?!(?:[^"]|"[^"]*")*$)/g, "\\m")
        .split(/\\n/g);

      fileObj = convertObj(fileObj);

      for (var i = 0; i < fileObj.length; i++) {
        setLayerSheet(fileObj[i]);
        createLayer(i);
      }

      createLayer.circleBack = createLayer.circleBack
        ? createLayer.circleBack
        : [];
      for (var i = 0; i < createLayer.circleBack.length; i++) {
        setLayerSheet(createLayer.circleBack[i]);
        createLayer(i);
      }

      myFile.close();
    } else {
      alert("File open failed!");
    }
  } else {
    alert("No CSV file selected.");
  }

  removeSpreadsheetAction();
};

main();
