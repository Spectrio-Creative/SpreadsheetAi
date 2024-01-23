import { AiGroupItem } from "../classes/AiGroupItem";
import { playgroundCounter } from './global';
import { makeRectangle } from "./textMeasure";

export function groupMeasure() {
  const layers = app.activeDocument.layers;

  layers.forEach((layer) => {
    layer.groupItems.forEach((group) => {
      if (group.name === "Image Group") {
        const groupItem = new AiGroupItem(group, { align: "center" });

        const bounds = group.geometricBounds;

        const visibleBounds = group.visibleBounds;

        const controlBounds = group.controlBounds;

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
      }
    });
  });

  alert(`Playground Counter: \n${JSON.stringify(playgroundCounter)}`);

  app.beep();
}
