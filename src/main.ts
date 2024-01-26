// Illustrator reserves the keyword 'version', but we need it for our own version;
const version = 1;
const aiVersion = version;
$.write(aiVersion);

import { setUpArrayMethods } from "./tools/extensions/arrayMethods";
import { extendExtendscript } from "./tools/extensions/jsxMethods";
import { createLayer } from "./plot_points/createLayer";
import { setLayerSheet } from "./globals/globals";
import { version as scriptVersion } from "../package.json";
import { forceInclusions } from "./tools/forceInclusions";
import { cleanUp, prepare } from "./plot_points/setup";
import { fromCSV } from "./tools/csv";
import { setUpStringMethods } from "./tools/extensions/string";
import { document } from "./globals/document";
import { templates } from "./globals/globals";
import { exit, openCSV } from './tools/fs';

const main = () => {
  alert(`SpreadsheetAi (v${scriptVersion})`);
  const csvFile = openCSV();

  setUpStringMethods();
  setUpArrayMethods();
  extendExtendscript();
  forceInclusions();

  if (csvFile != null) {
    try {
      // open file
      const fileOK = csvFile.open("r");
      let fileString = "";
      if (fileOK) {
        prepare();
        while (!csvFile.eof) {
          fileString += csvFile.readln() + "\n";
        }

        const csvJSON = fromCSV({
          data: fileString,
          separator: ",",
        }).toJSON() as SpreadsheetRow[];
        const purged = JSON.parse(JSON.stringify(csvJSON));
        
        // Save all pre-existing layers as templates
        document.layers.forEach((layer) => {
          templates.push(layer);
          if (/templates/i.test(layer.name)) {
            layer.layers.forEach((subLayer) => {
              templates.push(subLayer);
            });
          }
        });

        for (let i = 0; i < purged.length; i++) {
          setLayerSheet(purged[i]);
          createLayer(i);
          app.redraw();
        }

        csvFile.close();
        
        // Remove template layers
        templates.forEach((layer) => {
          layer.remove();
        });
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
