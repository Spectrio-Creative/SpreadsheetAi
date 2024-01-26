import { AiGroupItem } from "../classes/AiGroupItem";
import { playgroundCounter } from './global';
import { makeRectangle } from "./textMeasure";

export function groupMeasure() {
  const layers = app.activeDocument.layers;

  layers.forEach((layer) => {
    layer.groupItems.forEach((group) => {
      if (/^Image Group/.test(group.name)) {
        const groupItem = new AiGroupItem(group);

        const bounds = group.geometricBounds;

        makeRectangle(
          layer,
          {
            x: groupItem.left(),
            y: groupItem.top(),
            width: groupItem.width(),
            height: groupItem.height(),
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
          "#00eeff"
        );

        makeRectangle(
          layer,
          {
            x: groupItem.left(true),
            y: groupItem.top(true),
            width: groupItem.width(true),
            height: groupItem.height(true),
          },
          "#00ff00"
        );
      }
    });
  });

  alert(`Playground Counter: \n${JSON.stringify(playgroundCounter)}`);

  app.beep();
}
