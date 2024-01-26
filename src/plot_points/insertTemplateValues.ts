import { AiImage } from "../classes/AiImage";
import { AiTextBox } from "../classes/AiTextBox";
import { AiPageItem } from "../classes/AiPageItem";
import { AiGroupItem } from "../classes/AiGroupItem";
import { layer_sheet } from "../globals/globals";
import { getOrMakeItemClass } from '../tools/classes';

export function fillLayer(item: PageItem) {
  const newItem = getOrMakeItemClass(item);

  if (newItem instanceof AiTextBox) {
    const moustaches = newItem.replaceMoustaches(layer_sheet);
    newItem.italicize();
    if (moustaches) newItem.resizeBox();
  }
  
  return newItem;
}

export function fillFromTemplate(layer: Layer | GroupItem, options: string[] = []) {
  const offset = { x: 0, y: 0 };
  const items: AiPageItem[] = [];
  layer.pageItems.forEach((item: PageItem) => {
    let currentItem: AiGroupItem | AiPageItem | AiTextBox | AiImage;
    if (item.typename === "GroupItem") {
      const group = getOrMakeItemClass(item as GroupItem, "AiGroupItem");
      // This may actually reference AiImageItems since they are grouped in order to be clipped
      if (!(group instanceof AiGroupItem)) return;

      const children = fillFromTemplate(item as GroupItem, ["offset"]);
      group.setBackground();
      group.setAlignment();

      children.forEach((child) => {
        if (child instanceof AiImage) {
          // child.resizeBox();
        }
      });

      currentItem = group;
    } else {
      const filled = fillLayer(item);
      if (filled) currentItem = filled;
    }

    items.push(currentItem);

    if (options && options.includes("offset") && currentItem) {
      // For the moment, only move y
      // TODO: Sort out horizontal shifting
      currentItem.move(0, offset.y);

      offset.x += (currentItem.offset() as { x: number; y: number }).x;
      offset.y += (currentItem.offset() as { x: number; y: number }).y;
    }
  });

  return items;
}