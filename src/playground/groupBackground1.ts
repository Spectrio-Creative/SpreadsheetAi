// import { AiGroupItem } from "../classes/AiGroupItem";
import { AiImage } from "../classes/AiImage";
import { playgroundCounter } from "./global";
import { makeRectangle } from "./textMeasure";

function recursiveLoop(layer: Layer | GroupItem) {
  for (let i = 0; i < layer.groupItems.length; i++) {
    const group = layer.groupItems[i];

    // if (/^Image Group/.test(group.name)) {
    if (/clipper/.test(group.name)) {
      alert(`Found Image Group: ${group.name}`);
      return group;
    }

    const result = recursiveLoop(group);
    if (result) return result;
  }

  return null;
}

export function groupBackground() {
  const layers = app.activeDocument.layers;

  layers.forEach((layer) => {
    const group = recursiveLoop(layer);

    if (!group) return;

    const aiImage = new AiImage(group);

    const bounds = group.geometricBounds;

    const visibleBounds = group.visibleBounds;

    const controlBounds = group.controlBounds;

    makeRectangle(
      layer,
      {
        x: aiImage.left(),
        y: aiImage.top(),
        width: aiImage.width(),
        height: aiImage.height(),
      },
      "#0000ff"
    );

    makeRectangle(
      layer,
      {
        x: controlBounds[0],
        y: controlBounds[1],
        width: controlBounds[2] - controlBounds[0],
        height: controlBounds[1] - controlBounds[3],
      },
      "#ff00ff"
    );

    makeRectangle(
      layer,
      {
        x: bounds[0],
        y: bounds[1],
        width: bounds[2] - bounds[0],
        height: bounds[1] - bounds[3],
      },
      "#00eeff"
    );
    makeRectangle(
      layer,
      {
        x: group.left,
        y: group.top,
        width: group.width,
        height: group.height,
      },
      "#ff0000"
    );
    makeRectangle(
      layer,
      {
        x: visibleBounds[0],
        y: visibleBounds[1],
        width: visibleBounds[2] - visibleBounds[0],
        height: visibleBounds[1] - visibleBounds[3],
      },
      "#00ff00"
    );
  });

  alert(`Playground Counter: \n${JSON.stringify(playgroundCounter)}`);

  app.beep();
}
