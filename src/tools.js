function clean(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] !== '' && arr[i] !== null && arr[i] !== undefined) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

function getTextContent(wordsObj) {
    var fullString = '';
    for (var i = 0; i < wordsObj.length; i++) {
        if (i !== 0) fullString += ' ';
        fullString += wordsObj[i].contents;
    }
    return fullString;
}

function priceCheck(priceString){
    var priceType = "price (special)";
//    if(/\$[0-9]*[\,]*[0-9]*[\.]*[0-9]* each/i.test(priceString)) priceType = "price ($each)";
    if(/buy [0-9]+ get [0-9]+/i.test(priceString)){
        priceType = "price (getxfree)"
    } else if(/[0-9]+ for \$*[0-9]/i.test(priceString)){
        priceType = "price (xfor$)"
    } else if(/^\$*([0-9]+\,*\.*)* *(each)*$/g.test(priceString)){
        priceType = "price ($each)"
    } else if(/\n/g.test(priceString)){
        priceType = "price (special)"
    };
    return priceType;
}

function reduceText(textItem, rOption, overflow){
    var orHeight = textItem.textPath.height;
    if(overflow) textItem.textPath.height = 10000;
    var lineHeight = (textItem.paragraphs[0].autoLeadingAmount * textItem.textRange.characterAttributes.size /100),
        isolatedLeading = lineHeight - textItem.textRange.characterAttributes.size,
        linesN = textItem.lines.length,
        projectedH = lineHeight * linesN - isolatedLeading;
    
        if(rOption === 'reduce') textItem.textRange.characterAttributes.size -= 1;
    
        textItem.textPath.height = projectedH;
//    alert(orHeight - projectedH);
    return (projectedH - orHeight);
}


function reduceGroup(groupItem, wLimit){
    var originalWidth = groupItem.width,
        difference = 0;
    groupItem.resize(((100*wLimit) / originalWidth), ((100*wLimit) / originalWidth));
    difference = originalWidth - groupItem.width;

    groupItem.position = [(groupItem.position[0] - (difference/2)), groupItem.position[1]];
    return difference;
}

function arrIncludes(arr, str){
    for(var i=0; i<arr.length; i++){
        if(arr[i] === str) return true;
    }
    return false;
}

export {clean, getTextContent, priceCheck, reduceText, reduceGroup, arrIncludes};