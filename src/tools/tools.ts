function clean(arr: string[]) {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== "" && arr[i] !== null && arr[i] !== undefined) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

function getTextContent(wordsObj) {
  let fullString = "";
  for (let i = 0; i < wordsObj.length; i++) {
    if (i !== 0) fullString += " ";
    fullString += wordsObj[i].contents;
  }
  return fullString;
}

function camelCase(str) {
  const camArr = str.match(/([a-z]+|[A-Z]\w+)/g);
  camArr[0] = camArr[0].toLowerCase();
  let newStr = "";
  camArr.forEach((v, i) => {
    if (i === 0) {
      newStr += v;
      return;
    }
    newStr += v[0].toUpperCase() + v.substring(1);
  });

  return newStr;
}

function priceCheck(priceString) {
  let priceType = "price (special)";
  //    if(/\$[0-9]*[\,]*[0-9]*[\.]*[0-9]* each/i.test(priceString)) priceType = "price ($each)";
  if (/buy [0-9]+ get [0-9]+/i.test(priceString)) {
    priceType = "price (getxfree)";
  } else if (/[0-9]+ for \$*[0-9]/i.test(priceString)) {
    priceType = "price (xfor$)";
  } else if (/^\$*([0-9]+,*\.*)* *(each)*$/g.test(priceString)) {
    priceType = "price ($each)";
  } else if (/\n/g.test(priceString)) {
    priceType = "price (special)";
  }
  return priceType;
}

function reduceText(textItem, rOption, overflow) {
  const orHeight = textItem.textPath.height;
  if (overflow) textItem.textPath.height = 10000;
  const lineHeight =
      (textItem.paragraphs[0].autoLeadingAmount *
        textItem.textRange.characterAttributes.size) /
      100,
    isolatedLeading = lineHeight - textItem.textRange.characterAttributes.size,
    linesN = textItem.lines.length,
    projectedH = lineHeight * linesN - isolatedLeading;

  if (rOption === "reduce") textItem.textRange.characterAttributes.size -= 1;

  textItem.textPath.height = projectedH;
  //    alert(orHeight - projectedH);
  return projectedH - orHeight;
}

function reduceGroup(groupItem, wLimit) {
  const originalWidth = groupItem.width;
  let difference = 0;

  groupItem.resize(
    (100 * wLimit) / originalWidth,
    (100 * wLimit) / originalWidth
  );
  difference = originalWidth - groupItem.width;

  groupItem.position = [
    groupItem.position[0] - difference / 2,
    groupItem.position[1],
  ];
  return difference;
}

function loopBackwards(arr: unknown[], callback: (input: unknown) => unknown) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (callback) {
      const command = callback(arr[i]);
      if (command === "stop") return;
    }
  }
}

function replaceMoustaches(item: TextFrame, key: string, value: string) {
  const moustache = new RegExp(
    "{{[\\s]*" + key.replace(" ", "[\\s]{0,1}") + "[\\s]*}}",
    "i"
  );
  if (moustache.test(item.contents)) {
    item.contents = item.contents.replace(moustache, value);
  }
}

function recursiveLayerLoop(layer: Layer, doThis: (layer: Layer) => unknown) {
  doThis(layer);
  if (layer.layers)
    loopBackwards(layer.layers, (nextLayer: Layer) =>
      recursiveLayerLoop(nextLayer, doThis)
    );
}

function stringToObj(str: string) {
  // insure that double quotes are used to make sure that
  // JSON.parse doesn't fail
  let jsonStr = str.replace(/'?(\w+)'? ?:/g, function (match, p1) {
    return "\"" + p1 + "\":";
  });

  jsonStr = jsonStr.replace(
    /:\s*?(?:'(.*?)'|([1-9]+)|(true|false)|([\w]+))/g,
    (m, p1, p2, p3, p4) => {
      if (p2 || p3) return m;
      if (p4) return ": \"" + p4 + "\"";
      if (p1) return ": \"" + p1 + "\"";
      return m;
    }
  );
  // jsonStr = jsonStr.replace(/:\s*?'(.*?)'/g, (m, p1) => {
  //   return ': "' + p1 + '"';
  // });

  return JSON.parse(jsonStr);
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export {
  clean,
  getTextContent,
  priceCheck,
  reduceText,
  reduceGroup,
  loopBackwards,
  replaceMoustaches,
  recursiveLayerLoop,
  stringToObj,
  hexToRgb,
  rgbToHex,
  camelCase,
};
