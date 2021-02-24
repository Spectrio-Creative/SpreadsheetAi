import {clean} from './tools/tools';

function convertObj(obj) {
    var keys = obj[0].split(','),
        newObj = [];

    keys = clean(keys);

    for (var x = 1; x < obj.length; x++) {
        var tempObj = {},
            tempArr = obj[x].split(',');
        
        for (var i = 0; i < keys.length; i++) {
            var tempValue = tempArr[i].replace(/\\;/g, ',').replace(/\\m/g, '\n');
            tempObj[keys[i].toLowerCase()] = /^\".*[\n]*.*\"$/.test(tempValue) ? tempValue.slice(1,-1) : tempValue;
        }

        newObj.push(tempObj)
    }

    return newObj;
}

export default convertObj;