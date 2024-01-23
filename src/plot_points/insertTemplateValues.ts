import { AiImage } from "../classes/AiImage";
import { AiTextBox } from "../classes/AiTextBox";
import { AiPageItem } from "../classes/AiPageItem";
import { AiGroupItem } from "../classes/AiGroupItem";
import {
  is_color,
  is_image,
  key_test,
  layer_options,
} from "../tools/regExTests";
import { stringToObj } from "../tools/tools";
import { layer_sheet } from "../globals/globals";
import { AiColorShape } from "../classes/AiColorShape";

export function fillLayer(item: PageItem) {
  const options = layer_options.test(item.name)
    ? stringToObj(item.name.match(layer_options)[1])
    : {};
    
  // If the item name is if found in the spreadsheet
  let newValue: string | undefined;

  for (const key in layer_sheet) {
    if (!Object.prototype.hasOwnProperty.call(layer_sheet, key)) continue;
    
    const key_match = key_test(key);
    if (item.name !== "" && key_match.test(item.name)) {
      newValue = layer_sheet[key];
      break;
    }
  }

  // If the item is a textframe, it might have
  // moustaches to be replaced
  if (item.typename === "TextFrame" && !is_color.test(newValue)) {
    const new_textbox = new AiTextBox(item as TextFrame, newValue, options);
    const moustaches = new_textbox.replaceMoustaches(layer_sheet);
    new_textbox.italicize();
    // If data has changed, then we resize.
    if (moustaches) new_textbox.resizeBox();
    return new_textbox;
  }

  if (newValue) {
    if (is_image.test(newValue)) {
      const new_image = new AiImage(item, newValue, options);
      if (!new_image.hasImage) return;
      return new_image;
    } 
    
    if (is_color.test(newValue)) {
      const new_color = new AiColorShape(item as PathItem, newValue, options);
      return new_color;
    } 
    
    // Missing type handler
    alert(`Missing type handler for: ${item.typename}`);
  }

  
  // If PathItem, check for colors;
  if (item.typename === "PathItem" && options.color) {
    const new_color = new AiColorShape(item as PathItem, undefined, options);
    return new_color;
  }

  return new AiPageItem(item, options);
}

export function fillFromTemplate(layer: Layer | GroupItem, options: string[] = []) {
  const offset = { x: 0, y: 0 };
  layer.pageItems.forEach((item: PageItem) => {
    let currentItem: AiGroupItem | AiPageItem | AiTextBox | AiImage;
    if (item.typename === "GroupItem") {
      const options = layer_options.test(item.name)
        ? stringToObj(item.name.match(layer_options)[1])
        : {};

      const group = new AiGroupItem(item, options);
      fillFromTemplate(item as GroupItem, ["offset"]);
      group.setBackground();
      group.setPosition();

      currentItem = group;
    } else {
      const filled = fillLayer(item);
      if (filled) currentItem = filled;
    }

    if (options && options.includes("offset") && currentItem) {
      // For the moment, only move y
      // TODO: Sort out horizontal shifting
      currentItem.move(0, offset.y);

      offset.x += (currentItem.offset() as { x: number; y: number }).x;
      offset.y += (currentItem.offset() as { x: number; y: number }).y;
    }
  });
}