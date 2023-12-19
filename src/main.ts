// Illustrator reserves the keyword 'version', but we need it for our own version;
const version = 1;
const aiVersion = version;
$.write(aiVersion);

import { setUpArrayMethods } from "./tools/extensions/arrayMethods";
import { extendExtendscript } from "./tools/extensions/jsxMethods";
import { createLayer } from "./plot_points/createLayer";
import { circleBack, setLayerSheet } from "./globals/globals";
import { version as scriptVersion } from "../package.json";
import { forceInclusions } from "./tools/forceInclusions";
import { cleanUp, prepare } from "./plot_points/setup";
import { fromCSV } from './tools/csv';
import { setUpStringMethods } from './tools/extensions/string';

const main = () => {
  // Things work better when we've deselected
  // active_document.selection = null;

  alert(`SpreadsheetAi (v${scriptVersion})`);

  // @ts-ignore
  alert(ElementPlacement.PLACEATBEGINNING);
  prepare();

  const myFile = File.openDialog("Please select CSV Spreadsheet.");
  setUpStringMethods();
  setUpArrayMethods();
  extendExtendscript();
  forceInclusions();

  if (myFile != null) {
    try {
      // open file
      const fileOK = myFile.open("r");
      let fileString = "";
      if (fileOK) {
        while (!myFile.eof) {
          // read each line of text
          fileString += myFile.readln() + "\n";
        }

        const fileObj = fromCSV({data: fileString, separator: ","}).toJSON() as SpreadsheetRow[];

        fileObj.forEach((row, index) => {
          alert(index + "\n" + JSON.stringify(row));
        });

        for (let i = 0; i < fileObj.length; i++) {
          setLayerSheet(fileObj[i]);
          createLayer(i);
        }

        // createLayer.circleBack = createLayer.circleBack ? createLayer.circleBack : [];
        for (let i = 0; i < circleBack.length; i++) {
          setLayerSheet(circleBack[i]);
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
