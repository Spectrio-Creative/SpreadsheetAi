import {clean} from "./tools";

function convertObj(obj) {
  let keys = obj[0].split(",");
  const newObj = [];

  keys = clean(keys);

  for (let x = 1; x < obj.length; x++) {
    const tempObj = {},
      tempArr = obj[x].split(",");
        
    for (let i = 0; i < keys.length; i++) {
      const tempValue = tempArr[i].replace(/\\;/g, ",").replace(/\\m/g, "\n");
      tempObj[keys[i].toLowerCase()] = /^".*[\n]*.*"$/.test(tempValue) ? tempValue.slice(1,-1) : tempValue;
    }

    newObj.push(tempObj);
  }

  return newObj;
}

export default convertObj;