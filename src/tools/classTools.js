import { layer_options } from "./regExTests";
import { stringToObj } from "./tools";

const locationsAsSingleString = /^([\w.]+) ([\w.]+)/;

const isStringLocation = (location) => {
  return locationsAsSingleString.test(location);
};

const parseLocation = (location) => {
  const stringVals = location.match(locationsAsSingleString),
    val1 = stringVals[1],
    val2 = stringVals[2];

  let x, y;

  if (/top|bottom|center/.test(val1) && !/top|bottom/.test(val2)) y = val1;
  if (/left|right|center/.test(val1) && !/left|right/.test(val2)) x = val1;
  if (/top|bottom|center/.test(val2) && !/top|bottom/.test(val1)) y = val2;
  if (/left|right|center/.test(val2) && !/left|right/.test(val1)) x = val2;

  if (x || y) return { x: x ? x : "center", y: y ? y : "center" };

  if (isNaN(parseFloat(val1)) || isNaN(parseFloat(val2))) {
    return { x: "center", y: "center" };
  } else {
    return { x: parseFloat(val1), y: parseFloat(val2) };
  }
};

const getGroupAlignment = (group) => {
  if (group.pageItems.length > 2) return { x: "center", y: "center" };
  let textAlignment = "center";

  group.pageItems.forEach((item) => {
    const options = layer_options.test(item.name)
      ? stringToObj(item.name.match(layer_options)[1])
      : {};
    console.log(options);
    if (item.typename === "TextFrame")
      textAlignment = item.textRange.paragraphAttributes.justification
        .toString()
        .toLowerCase()
        .replace("justification.", "")
        .replace("fulljustify", "");
  });

  let groupAlignment = /^(left|right|center)$/.test(textAlignment)
    ? textAlignment
    : "center";

  return { x: groupAlignment, y: "center" };
};

const getFontFamily = (textFont) => {
  return app.textFonts.filter((tf) => tf.family === textFont.family);
};

export { isStringLocation, parseLocation, getGroupAlignment, getFontFamily };
