import { recursiveLayerLoop } from "../tools/tools";
import { findTemplate } from "../tools/templateTools";
import { fillFromTemplate } from "./insertTemplateValues";
import { document } from "../globals/document";
import { layer_sheet_cc } from "../globals/globals";
import { duplicateLayer } from '../tools/duplicate';

function createLayer(num: number) {
  // TODO: Add logic for variable template ref
  const templateTitle: string = layer_sheet_cc["template"] || layer_sheet_cc["layerTemplate"]; 

  // If no template column, alert and exit
  if (templateTitle === undefined) {
    const alertMessage = `No template column in spreadsheet.
    Please add a "template" column on your spreadsheet.`;
    alert(alertMessage);
    return;
  }

  const template = findTemplate(templateTitle);

  if (template === undefined) {
    alert(`Template "${templateTitle}" not found in document.`);
    return;
  }

  // Make the template active so we can copy it
  document.activeLayer = template;

  // Script is finished running when template's parent
  // has one more child.

  const newLayer = duplicateLayer(template, document);

  newLayer.visible = true;
  newLayer.locked = false;

  // Move layer to the top / out of the template directory
  // @ts-ignore
  newLayer.move(app.activeDocument, ElementPlacement.PLACEATBEGINNING);

  newLayer.name = layer_sheet_cc["layerName"]
    ? layer_sheet_cc["layerName"]
    : "layer " + (num + 1) + " [" + template.name + "]";

  recursiveLayerLoop(newLayer, (layer: Layer) => {
    fillFromTemplate(layer, undefined);
  });

  // redraw();
}

export { createLayer };
