// import { AiGroupItem } from "../classes/AiGroupItem";
import { AiGroupItem } from '../classes/AiGroupItem';
import { AiImage } from "../classes/AiImage";
import { playgroundCounter } from "./global";
import { makeRectangle } from "./textMeasure";

function recursiveLoop(layer: Layer | GroupItem): AiGroupItem | null {
  for (let i = 0; i < layer.groupItems.length; i++) {
    const group = layer.groupItems[i];

    // if (/^Image Group/.test(group.name)) {
    if (/clipper/.test(group.name)) {
      alert(`Found Image Group: ${group.name}`);
      const aiImage = new AiImage(group);
      const groupItem = new AiGroupItem(layer as GroupItem);
      groupItem.background = aiImage;
      return groupItem;
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

    const bounds = group.obj.geometricBounds;

    makeRectangle(
      layer,
      {
        x: group.left(),
        y: group.top(),
        width: group.width(),
        height: group.height(),
      },
      "#0000ff"
    );

    makeRectangle(
      layer,
      {
        x: bounds[0],
        y: bounds[1],
        width: bounds[2] - bounds[0],
        height: bounds[1] - bounds[3],
      },
      "#ff00ff"
    );

    makeRectangle(
      layer,
      {
        x: group.left(true),
        y: group.top(true),
        width: group.width(true),
        height: group.height(true),
      },
      "#00eeff"
    );
  });

  alert(`Playground Counter: \n${JSON.stringify(playgroundCounter)}`);

  app.beep();
}
