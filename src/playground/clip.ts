export function clip() {
  const layers = app.activeDocument.layers;

  layers.forEach((layer) => {
    layer.groupItems.forEach((group) => {
      if (group.name === "Image Group") {
        group.groupItems.forEach((item) => {
          if (item.name === "unclip") {
            item.clipped = false;
          }
        });
      }
    });
  });

  app.beep();
}
