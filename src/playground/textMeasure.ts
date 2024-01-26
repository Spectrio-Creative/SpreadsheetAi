import { hexToRgb } from "../tools/colors";

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function makeRectangle(
  layer: Layer,
  dimensions: Rectangle,
  color: string
) {
  const rect = layer.pathItems.rectangle(
    dimensions.y,
    dimensions.x,
    dimensions.width,
    dimensions.height
  );
  rect.filled = true;
  const fillColor = new RGBColor();
  const rgb = hexToRgb(color);
  fillColor.red = rgb.r;
  fillColor.green = rgb.g;
  fillColor.blue = rgb.b;
  rect.fillColor = fillColor;
  rect.stroked = false;
  rect.name = "Rectangle";
  rect.move(layer, ElementPlacement.PLACEATBEGINNING);
}

export function textMeasure() {
  const layers = app.activeDocument.layers;

  layers.forEach((layer) => {
    layer.textFrames.forEach((textFrame) => {
      if (textFrame.name === "Product Name") {
        const leading = textFrame.textRange.characterAttributes.leading;
        const lines = textFrame.lines.length;
        makeRectangle(
          layer,
          {
            x: textFrame.left,
            y: textFrame.top,
            width: textFrame.width,
            height: leading * lines,
          },
          "#00eeff"
        );
        makeRectangle(
          layer,
          {
            x: textFrame.left,
            y: textFrame.top,
            width: textFrame.width,
            height: textFrame.height,
          },
          "#ff0000"
        );
      }
    });
  });

  app.beep();
}
