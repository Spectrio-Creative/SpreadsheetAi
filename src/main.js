// Illustrator reserves the keyword 'version', but we need it for our own version;
let aiVersion = version;
import { setUpArrayMethods } from "./tools/extensions/arrayMethods";
import { extendExtendscript } from "./tools/extensions/jsxMethods";
import convertObj from "./tools/convertObj";
import { createLayer } from "./base/createLayer";
import { setLayerSheet } from "./globals/globals";
import { version as scriptVersion } from "../package.json";
import {
  loadSpreadsheetActions,
  removeSpreadsheetAction,
} from "./tools/actionTools";
import { forceInclusions } from "./tools/forceInclusions";

const main = () => {
  alert(`SpreadsheetAi (v${scriptVersion})`);
  loadSpreadsheetActions();

  const myFile = File.openDialog(`Please select CSV Spreadsheet.`);
  setUpArrayMethods();
  extendExtendscript();
  forceInclusions();

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
