// Illustrator reserves the keyword 'version', but we need it for our own version;
let version = 1;
let aiVersion = version;
console.log(aiVersion);
import { setUpArrayMethods } from "./tools/extensions/arrayMethods";
import { extendExtendscript } from "./tools/extensions/jsxMethods";
import convertObj from "./tools/convertObj";
import { createLayer } from "./plot_points/createLayer";
import { setLayerSheet } from "./globals/globals";
import { version as scriptVersion } from "../package.json";
import { forceInclusions } from "./tools/forceInclusions";
import { cleanUp, prepare } from "./plot_points/setup";

const main = () => {
  // Things work better when we've deselected
  // active_document.selection = null;

  alert(`SpreadsheetAi (v${scriptVersion})`);
  prepare();

  const myFile = File.openDialog("Please select CSV Spreadsheet.");
  setUpArrayMethods();
  extendExtendscript();
  forceInclusions();

  if (myFile != null) {
    try {
      // open file
      const fileOK = myFile.open("r");
      let fileObj = [],
        fileObj2 = "";
      if (fileOK) {
        let text;
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

        for (let i = 0; i < fileObj.length; i++) {
          setLayerSheet(fileObj[i]);
          createLayer(i);
        }

        createLayer.circleBack = createLayer.circleBack
          ? createLayer.circleBack
          : [];
        for (let i = 0; i < createLayer.circleBack.length; i++) {
          setLayerSheet(createLayer.circleBack[i]);
          createLayer(i);
        }

        myFile.close();
      } else {
        alert("File open failed!");
      }
    } catch (e) {
      alert(`${e.name}
      ${e.message}
      (line #${e.line} in ${$.stack.match(/\[(.*?)\]/)[1]})`);
    }
  } else {
    alert("No CSV file selected.");
  }

  cleanUp();
  app.beep();
};

main();
