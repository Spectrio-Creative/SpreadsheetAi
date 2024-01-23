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

export const oppositeDimension = (dim: dimension) => {
  return dim === "width" ? "height" : "width";
};