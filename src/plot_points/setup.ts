import { active_document } from "../globals/document";
import { loadSpreadsheetActions, removeSpreadsheetAction } from "../tools/actionTools";
let layerHelper: Layer | undefined;

const prepare = () => {
  // If a layer is selected but not highlighted
  // it cannot be copied and the whole script fails.

  // So we can assure that this doesn't happen by
  // first turning off the originally selected layer, then
  // creating and selecting a new layer, before
  // finally turning back on the original layer and
  // reselecting it. Thus rendering it both selected *and* highlighted

  const layerOrigin = active_document.activeLayer;

  layerHelper = active_document.layers.add();
  layerHelper.name = "SpreadsheetAi - Helper";

  layerOrigin.visible = false;
  active_document.activeLayer = layerHelper;
  app.redraw();

  layerOrigin.visible = true;
  app.redraw();

  active_document.activeLayer = layerOrigin;
  app.redraw();

  // There is a specific action that we
  // need to load to duplicate the layer

  loadSpreadsheetActions();
};

const cleanUp = () => {
  // Remove helper layer
  if (layerHelper) layerHelper.remove();

  // and remove specially loaded actions
  removeSpreadsheetAction();

  active_document.selection = null;
};

export { prepare, cleanUp };
