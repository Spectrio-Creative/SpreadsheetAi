import { recursiveLayerLoop } from "./tools/tools";
import { findTemplate } from "./tools/templateTools";
import { fillFromTemplate } from "./insertTemplateValues";
import { active_document } from "./document";
import { layer_sheet } from "./tools/globals";

function createLayer(num) {
  const project_layers = active_document.layers;
  const template_title = layer_sheet["template"]; // Add logic for variable template ref
  const template = findTemplate(project_layers, template_title);

  if (template === undefined) {
    alert(`Template "${template_title}" not found in document.`);
    return;
  }

  // Make the template active so we can copy it
  active_document.activeLayer = template;
  // Copy the layer

  // Script is finished running when template's parent
  // has one more child.
  const original_length = template.parent.layers.length;
  app.doScript("Duplicate Layer", "SpreadsheetAi");

  let callback_timeout = 0;
  function afterDuplication() {
    if (template.parent.layers.length === original_length) {
      callback_timeout++;

      if (callback_timeout > 10) {
        !createLayer.circleBack
          ? (createLayer.circleBack = [layer_sheet])
          : createLayer.circleBack.includes(layer_sheet)
          ? alert(
              `Failed to create layer ${
                layer_sheet["layer name"]
                  ? layer_sheet["layer name"]
                  : "layer " + (num + 1) + " [" + template.name + "]"
              }
            We’re not sure what went wrong, but you might also try running the script again with a different template selected (strange, I know).
            `
            )
          : createLayer.circleBack.push(layer_sheet);
        return;
      }

      $.setTimeout(() => {
        afterDuplication();
      }, 300);

      return;
    }

    const parentLayers = template.parent.layers;
    let layer_index;
    // Find newly created layer
    for (let i = 0; i < parentLayers.length; i++) {
      if (parentLayers[i] === template) layer_index = i - 1;
    }
    const new_layer = parentLayers[layer_index];

    // Move layer to the top / out of the template directory
    new_layer.move(app.activeDocument, ElementPlacement.PLACEATBEGINNING);

    new_layer.name = layer_sheet["layer name"]
      ? layer_sheet["layer name"]
      : "layer " + (num + 1) + " [" + template.name + "]";

    recursiveLayerLoop(new_layer, (layer) => {
      fillFromTemplate(layer);
    });
  }

  afterDuplication();
  // redraw();
}

export { createLayer };
