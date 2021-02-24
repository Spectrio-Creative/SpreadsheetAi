import { AiImage } from "./classes/classImage";
import { AiTextBox } from "./classes/classTextBox";
import { AiPageItem } from "./classes/classPageItem";
import { AiGroupItem } from "./classes/classGroup";
import { importImage } from "./importImage";
import { matchSize, matchLocation } from "./tools/layerTools";
import { is_image } from "./tools/regExTests";
import { loopBackwards, replaceMoustaches, stringToObj } from "./tools/tools";
import { getLayerSheet, layer_sheet } from "./tools/globals";

function fillLayer(item) {
  // If the item name is if found in the spreadsheet
  for (key in layer_sheet) {
    const key_match = new RegExp(
      "^[\\s]*" + key.replace(" ", "[\\s]{0,1}") + "[\\s]*(\\{.*\\})*[\\s]*$",
      "i"
    );

    if (key_match.test(item.name)) {
      const value = layer_sheet[key],
        options_str = item.name.match(key_match)[1],
        options = options_str ? stringToObj(options_str) : {};
        
      if (item.typename === "TextFrame") {
        const new_textbox = new AiTextBox(item, value, options);
        new_textbox.resizeBox();
        new_textbox.replaceMoustaches(layer_sheet);
        return new_textbox;
      } else if (is_image.test(value)) {
        const new_image = new AiImage(item, value, options);
        if (!new_image.hasImage) return;
        return new_image;
      } else {
        alert(item.typename);
      }
    }
  }

  // If the item is a textframe, it might have
  // moustaches to be replaced
  if (item.typename === "TextFrame") {
    const new_textbox = new AiTextBox(item);
    new_textbox.replaceMoustaches(layer_sheet);
    return new_textbox;
  }

  return new AiPageItem(item);
}

function fillFromTemplate(layer, options) {
  let offset = { x: 0, y: 0 };
  layer.pageItems.forEach((item) => {
    if (item.typename === "GroupItem") {
      const group = new AiGroupItem(item);
      fillFromTemplate(item, ["offset"]);
      group.setPosition("center");
    } else {
      let filled = fillLayer(item);
      if (filled) {
        if (options && options.includes("offset")) {
          filled.move(offset.x, offset.y);

          offset.x += filled.offset().x;
          offset.y += filled.offset().y;
        }
      }
    }
  });
}

export { fillFromTemplate };
