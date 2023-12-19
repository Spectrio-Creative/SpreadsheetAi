import { recursiveLayerLoop } from "../tools/tools";
import { findTemplate } from "../tools/templateTools";
import { fillFromTemplate } from "./insertTemplateValues";
import { active_document } from "../globals/document";
import { circleBack, layer_sheet, layer_sheet_cc } from "../globals/globals";
import { $setTimeout } from "../tools/extensions/jsxMethods";

function createLayer(num: number) {
  const project_layers = active_document.layers;
  let template_title = layer_sheet_cc["template"]; // Add logic for variable template ref
  template_title = template_title || layer_sheet_cc["layerTemplate"];

  // If no template column, alert and exit
  if (template_title === undefined) {
    alert(
      "No template column in spreadsheet.\nPlease add a \"template\" column on your spreadsheet."
    );
    return;
  }

  const template = findTemplate(project_layers, template_title);

  if (template === undefined) {
    alert(`Template "${template_title}" not found in document.`);
    return;
  }

  // Make the template active so we can copy it
  // alert(active_document.activeLayer);
  active_document.activeLayer = template;
  // dummyLayer.remove();
  // Copy the layer

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
    let layer_index: number;
    // Find newly created layer
    for (let i = 0; i < parentLayers.length; i++) {
      if (parentLayers[i] === template) layer_index = i - 1;
    }
    const new_layer = parentLayers[layer_index];

    // Move layer to the top / out of the template directory
    // @ts-ignore
    new_layer.move(app.activeDocument, ElementPlacement.PLACEATBEGINNING);

    new_layer.name = layer_sheet_cc["layerName"]
      ? layer_sheet_cc["layerName"]
      : "layer " + (num + 1) + " [" + template.name + "]";

    recursiveLayerLoop(new_layer, (layer: Layer) => {
      fillFromTemplate(layer, undefined);
    });
  }

  afterDuplication();
  // redraw();
}

export { createLayer };
