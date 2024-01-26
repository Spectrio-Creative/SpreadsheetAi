import { layer_options } from "./regExTests";
import { stringToObj } from "./tools";

export const locationsAsSingleString = /^([\w.]+) ([\w.]+)/;

export const isStringLocation = (location: string) => {
  return locationsAsSingleString.test(location);
};

export const parseLocation = (location: string) => {
  const stringVals = location.match(locationsAsSingleString),
    val1 = stringVals[1],
    val2 = stringVals[2];

  let x: string, y: string;

  if (/top|bottom|center/.test(val1) && !/top|bottom/.test(val2)) y = val1;
  if (/left|right|center/.test(val1) && !/left|right/.test(val2)) x = val1;
  if (/top|bottom|center/.test(val2) && !/top|bottom/.test(val1)) y = val2;
  if (/left|right|center/.test(val2) && !/left|right/.test(val1)) x = val2;

  if (x || y) return { x: x ? x : "center", y: y ? y : "center" };

  if (isNaN(parseFloat(val1)) || isNaN(parseFloat(val2))) {
    return { x: "center", y: "center" };
  }

  return { x: parseFloat(val1), y: parseFloat(val2) };
};

export const getGroupAlignment = (group: GroupItem) => {
  if (group.pageItems.length > 2) return { x: "center", y: "center" };
  let textAlignment = "center";

  group.pageItems.forEach((item) => {
    const options = layer_options.test(item.name)
      ? stringToObj(item.name.match(layer_options)[1])
      : {};
    $.write(options);
    if (item.typename === "TextFrame")
      textAlignment = (item as TextFrame).textRange.paragraphAttributes.justification
        .toString()
        .toLowerCase()
        .replace("justification.", "")
        .replace("fulljustify", "");
  });

  const groupAlignment = /^(left|right|center)$/.test(textAlignment)
    ? textAlignment
    : "center";

  return { x: groupAlignment, y: "center" };
};

export const getFontFamily = (textFont: TextFont) => {
  return app.textFonts.filter((tf) => tf.family === textFont.family);
};