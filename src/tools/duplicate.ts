import { last, loopBackwards } from "./arrays";

interface ArtboardInfo {
  name: string;
  rect: Rect;
}

export function duplicateDocument() {
  const templateDocument = app.activeDocument;
  const templateArtboards: ArtboardInfo[] = [];

  templateDocument.artboards.forEach((artboard) => {
    templateArtboards.push({
      name: artboard.name,
      rect: [...artboard.artboardRect],
    });
  });

  const newDocuemnt = app.documents.add();

  // Mark all artboards for deletion
  newDocuemnt.artboards.forEach((artboard) => {
    artboard.name = `DELETE (${artboard.name}})`;
  });

  // Add artboards from template document to new document
  templateArtboards.forEach((artboard) => {
    const newArtboard = newDocuemnt.artboards.add(artboard.rect);
    newArtboard.name = artboard.name;
  });

  // Delete all artboards marked for deletion
  newDocuemnt.artboards.forEach((artboard) => {
    if (/^DELETE/.test(artboard.name)) {
      artboard.remove();
    }
  });

  loopBackwards(templateDocument.layers, (layer: Layer) => {
    duplicateLayer(layer, newDocuemnt);
  });

  return newDocuemnt;
}

export function duplicateLayer(layer: Layer, document: Document | Layer) {
  const newLayer = document.layers.add();

  newLayer.name = layer.name;

  const zOrderItems: number[] = [];
  const zOrderLayers: number[] = [];

  const layers: Layer[] = [];
  const pageItems: PageItem[] = [];

  loopBackwards(layer.layers, (layer: Layer) => {
    const subLayer = duplicateLayer(layer, newLayer);
    zOrderLayers.push(layer.absoluteZOrderPosition);
    layers.push(subLayer);
  });

  loopBackwards(layer.pageItems, (pageItem: PageItem) => {
    pageItem.duplicate(newLayer);

    // position new page item in new document
    const newPageItem = newLayer.pageItems[0];
    newPageItem.position = pageItem.position;

    zOrderItems.push(pageItem.absoluteZOrderPosition);
    pageItems.push(newPageItem);
  });

  for (let i = zOrderItems.length; i >= 0; i--) {
    const next = zOrderItems[i] || Number.POSITIVE_INFINITY;
    const previous = zOrderItems[i - 1] || Number.NEGATIVE_INFINITY;

    while (last(zOrderLayers) >= previous && last(zOrderLayers) <= next) {
      const _order = zOrderLayers.pop();
      const index = zOrderLayers.length;

      const layer = layers[index];
      const previousItem = pageItems[i - 1];
      const nextItem = pageItems[i];

      if (previousItem) {
        layer.move(previousItem, ElementPlacement.PLACEBEFORE);
      } else if (nextItem) {
        layer.move(nextItem, ElementPlacement.PLACEAFTER);
      }
    }
  }

  newLayer.visible = layer.visible;
  newLayer.locked = layer.locked;

  return newLayer;
}
