import { recursiveLayerLoop } from "../tools/tools";
import { findTemplate } from "../tools/templateTools";
import { fillFromTemplate } from "./insertTemplateValues";
import { circleBack, layer_sheet, layer_sheet_cc } from "../globals/globals";
import { $setTimeout } from "../tools/extensions/jsxMethods";
import { document } from "../globals/document";

function createLayer(num: number) {
  // TODO: Add logic for variable template ref
  const template_title: string = layer_sheet_cc["template"] || layer_sheet_cc["layerTemplate"]; 

  // If no template column, alert and exit
  if (template_title === undefined) {
    const alertMessage = `No template column in spreadsheet.
    Please add a "template" column on your spreadsheet.`;
    alert(alertMessage);
    return;
  }

  const template = findTemplate(project_layers, template_title);

  if (template === undefined) {
    alert(`Template "${template_title}" not found in document.`);
    return;
  }

  // Make the template active so we can copy it
  document.activeLayer = template;

  // Script is finished running when template's parent
  // has one more child.
  const original_length = (template.parent as Layer).layers.length;
  app.doScript("Duplicate Layer", "SpreadsheetAi");

  let callback_timeout = 0;
  function afterDuplication() {
    if ((template.parent as Layer).layers.length === original_length) {
      callback_timeout++;

      if (callback_timeout > 10) {
        circleBack.includes(layer_sheet)
          ? alert(
            `Failed to create layer ${
              layer_sheet["layer name"]
                ? layer_sheet["layer name"]
                : "layer " + (num + 1) + " [" + template.name + "]"
            }
            We’re not sure what went wrong, but you might also try running the script again with a different template selected (strange, I know).
            `
          )
          : circleBack.push(layer_sheet);
        return;
      }

      $setTimeout(() => {
        afterDuplication();
      }, 300);

      return;
    }

    const parentLayers = (template.parent as Layer).layers;
    let layerIndex: number;
    // Find newly created layer
    for (let i = 0; i < parentLayers.length; i++) {
      if (parentLayers[i] === template) layerIndex = i - 1;
    }
    const newLayer = parentLayers[layerIndex];

    // Move layer to the top / out of the template directory
    // @ts-ignore
    newLayer.move(app.activeDocument, ElementPlacement.PLACEATBEGINNING);

    newLayer.name = layer_sheet_cc["layerName"]
      ? layer_sheet_cc["layerName"]
      : "layer " + (num + 1) + " [" + template.name + "]";

    recursiveLayerLoop(newLayer, (layer: Layer) => {
      fillFromTemplate(layer, undefined);
    });
  }

  afterDuplication();
  // redraw();
}

export { createLayer };
