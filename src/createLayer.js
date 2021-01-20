import {
  priceCheck,
  reduceGroup,
  reduceText,
  arrIncludes,
  loopBackwards,
} from "./tools";
import { findTemplate } from "./templateTools";
import { isOverset, isOversetSingle } from "./oversetCheck";
import { insertTemplateValues } from "./insertTemplateValues";

const masterLayer = app.activeDocument.layers[0],
  applicationPath = app.activeDocument.path;

function createLayer(obj, num) {
  const active_document = app.activeDocument;
  // Having layers selected before copying layer can cause problems
  app.executeMenuCommand("deselectall");

  const project_layers = active_document.layers;
  const template_title = obj["template"]; // Add logic for variable template ref
  const template = findTemplate(project_layers, template_title);

  // Make the template active so we can copy it
  active_document.activeLayer = template;
  // Copy the layer

  try {
    app.doScript("Duplicate Layer", "SpreadsheetAi");
  } catch (e) {
      throw('You must install the SpreadsheetAi actions file before running this script.');
  }

  const new_layer = active_document.activeLayer;
  // Move layer to the top / out of the template directory
  new_layer.move(app.activeDocument, ElementPlacement.PLACEATBEGINNING);

  for(key in obj){
      if(key == 'template') continue;
      let value = obj[key];

      insertTemplateValues(new_layer, key, value);
  }


}

export { createLayer };
