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

function fillLayer(item) {
  const options = layer_options.test(item.name)
  ? stringToObj(item.name.match(layer_options)[1])
  : {};
  // If the item name is if found in the spreadsheet
  for (key in layer_sheet) {
    const key_match = key_test(key);

    if (key_match.test(item.name)) {
      const value = layer_sheet[key];
      if (item.typename === "TextFrame") {
        if (is_color.test(value)) continue;
        const new_textbox = new AiTextBox(item, value, options);
        new_textbox.replaceMoustaches(layer_sheet);
        new_textbox.italicize();
        new_textbox.resizeBox();
        return new_textbox;
      } else if (is_image.test(value)) {
        const new_image = new AiImage(item, value, options);
        if (!new_image.hasImage) return;
        return new_image;
      } else if (is_color.test(value)) {
        const new_color = new AiColorShape(item, value, options);
        // if (!new_image.hasImage) return;
        return new_color;
      } else {
        alert(item.typename);
      }
    }
  }

  // If the item is a textframe, it might have
  // moustaches to be replaced
  if (item.typename === "TextFrame") {
    const new_textbox = new AiTextBox(item, undefined, options);
    let moustaches = new_textbox.replaceMoustaches(layer_sheet);
    new_textbox.italicize();
    // If data has changed, then we resize.
    if (moustaches) new_textbox.resizeBox();
    return new_textbox;
  } else if(item.typename === "PathItem" && options.color) {
    const new_color = new AiColorShape(item, undefined, options);
    return new_color;
  }

  return new AiPageItem(item, options);
}

function fillFromTemplate(layer, options, parent) {
  let offset = { x: 0, y: 0 };
  layer.pageItems.forEach((item) => {
    if (item.typename === "GroupItem") {
      const options = layer_options.test(item.name)
        ? stringToObj(item.name.match(layer_options)[1])
        : {};

      const group = new AiGroupItem(item, options);
      fillFromTemplate(item, ["offset"], group);
      group.setBackground();
      group.setPosition();
    } else {
      let filled = fillLayer(item);
      if (filled) {
        if (options && options.includes("offset")) {
          // For the moment, only move y
          // ToDo: Sort out horizontal shifting
          filled.move(0, offset.y);

          offset.x += filled.offset().x;
          offset.y += filled.offset().y;
        }
      }
    }
  });
}

export { fillFromTemplate };
