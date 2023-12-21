import { AiImage } from "../classes/classImage";
import { AiTextBox } from "../classes/classTextBox";
import { AiPageItem } from "../classes/classPageItem";
import { AiGroupItem } from "../classes/classGroup";
import {
  is_color,
  is_image,
  key_test,
  layer_options,
} from "../tools/regExTests";
import { stringToObj } from "../tools/tools";
import { layer_sheet } from "../globals/globals";
import { AiColorShape } from "../classes/classColorShape";

function fillLayer(item: PageItem) {
  const options = layer_options.test(item.name)
    ? stringToObj(item.name.match(layer_options)[1])
    : {};
  // If the item name is if found in the spreadsheet
  for (const key in layer_sheet) {
    if (!Object.prototype.hasOwnProperty.call(layer_sheet, key)) continue;
    // alert(`key: ${key}\nkey type: ${typeof key}\nvalue: ${layer_sheet[key]}`);
    const key_match = key_test(key);

    if (key_match.test(item.name)) {
      const value = layer_sheet[key];
      if (item.typename === "TextFrame") {
        if (is_color.test(value)) continue;
        const textBox = new AiTextBox(item as TextFrame, value, options);
        textBox.replaceMoustaches(layer_sheet);
        textBox.italicize();
        textBox.resizeBox();
        return textBox;
      } else if (is_image.test(value)) {
        const new_image = new AiImage(item, value, options);
        if (!new_image.hasImage) return;
        return new_image;
      } else if (is_color.test(value)) {
        const new_color = new AiColorShape(item as PathItem, value, options);
        return new_color;
      } else {
        alert(item.typename);
      }
    }
  }

  // If the item is a textframe, it might have
  // moustaches to be replaced
  if (item.typename === "TextFrame") {
    const new_textbox = new AiTextBox(item as TextFrame, undefined, options);
    const moustaches = new_textbox.replaceMoustaches(layer_sheet);
    new_textbox.italicize();
    // If data has changed, then we resize.
    if (moustaches) new_textbox.resizeBox();
    return new_textbox;
  }
  
  // If PathItem, check for colors;
  if (item.typename === "PathItem" && options.color) {
    const new_color = new AiColorShape(item as PathItem, undefined, options);
    return new_color;
  }

  return new AiPageItem(item, options);
}

function fillFromTemplate(layer, options: string[] = []) {
  const offset = { x: 0, y: 0 };
  layer.pageItems.forEach((item: PageItem) => {
    let currentItem: AiGroupItem | AiPageItem | AiTextBox | AiImage;
    if (item.typename === "GroupItem") {
      const options = layer_options.test(item.name)
        ? stringToObj(item.name.match(layer_options)[1])
        : {};

      const group = new AiGroupItem(item, options);
      fillFromTemplate(item, ["offset"]);
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

export { fillFromTemplate };
