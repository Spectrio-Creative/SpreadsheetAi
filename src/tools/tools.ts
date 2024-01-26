export type PriceType = "price (special)" | "price (getxfree)" | "price (xfor$)" | "price ($each)";

export function priceCheck(priceString: string) {
  let priceType: PriceType = "price (special)";
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

export function stringToObj(str: string) {
  // Wrap keys without quote with valid double quote
  let jsonStr = str.replace(/([\$\w]+)\s*:/g, function (match, key) {
    return "\"" + key + "\":";
  });

  jsonStr = jsonStr.replace(
    /:\s*?(?:'(.*?)'|([0-9]+\.?[0-9]*)|(true|false)|([\w]+[ \w]*))/g,
    (m, singleQuoted, num, bool, unQuoted) => {
      if (num || bool) return m;
      if (unQuoted) return ": \"" + unQuoted.trim() + "\"";
      if (singleQuoted) return ": \"" + singleQuoted.trim() + "\"";
      return m;
    }
  );

  return JSON.parse(jsonStr);
}

export function oppositeDimension(dim: DimensionType) {
  return dim === "width" ? "height" : "width";
}


export type PaddingObject = { top: number, right: number, bottom: number, left: number };
export type PaddingInput = number | number[] | PaddingObject;

export function normalizePadding(padding: PaddingInput): [number, number, number, number] {
  if (typeof padding === "number") return [padding, padding, padding, padding];
  if (padding === undefined) return [0, 0, 0, 0];

  let normalizedPadding = [];
  
  if (Array.isArray(padding)) {
    normalizedPadding = [...padding];
    while (normalizedPadding.length < 4) {
      const length = normalizedPadding.length;
      switch(length) {
        case 1:
        case 2:
          normalizedPadding.push(normalizedPadding[0]);
          break;
        case 3:
          normalizedPadding.push(normalizedPadding[1]);
          break;
        default:
          normalizedPadding.push(0);
          break;
      }
    }
  
    normalizedPadding = normalizedPadding.slice(0, 4) as [number, number, number, number];
  }

  const top = (padding as PaddingObject).top || normalizedPadding[0] || 0;
  const bottom = (padding as PaddingObject).bottom || normalizedPadding[2] || 0;
  const left = (padding as PaddingObject).left || normalizedPadding[3] || 0;
  const right = (padding as PaddingObject).right || normalizedPadding[1] || 0;

  return [top, right, bottom, left];
}