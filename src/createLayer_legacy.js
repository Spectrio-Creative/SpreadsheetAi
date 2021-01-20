import {priceCheck, reduceGroup, reduceText, arrIncludes} from './tools';
import {isOverset, isOversetSingle} from './oversetCheck';

const masterLayer = app.activeDocument.layers[0],
applicationPath = app.activeDocument.path;

function createLayer(obj, num) {
    var newLayer = app.activeDocument.layers.add();
    newLayer.name = obj["layer name"];

    var aDoc = app.activeDocument;
    redraw();
    var aLay = aDoc.layers.getByName(obj["layer template"]); // your existing layer name
    var pI = aLay.pageItems;
    var lL = aLay.layers;
    
    for (k = pI.length - 1; k >= 0; k--) {
        pI[k].duplicate(newLayer, ElementPlacement.PLACEATBEGINNING);
    }
    
    for (k = lL.length - 1; k >= 0; k--) {
        var subLayer = lL[k],
            newSub = newLayer.layers.add(),
            subI = subLayer.pageItems;
        
        newSub.name = subLayer.name;
        for(var x=subI.length-1; x >= 0; x--){
            subI[x].duplicate(newSub, ElementPlacement.PLACEATBEGINNING);
        }
    }
    
    var widthAdj = 0;
    var verticalAObj = {'image':0, 'product id': 0, 'product name': 0, 'company name': 0},
        verticalAdj = 0,
        deletion = [],
        priceS = priceCheck(obj['price']),
        pastLayers = {};
    
//    if(obj["layer template"] === 'INSTANT SAVINGS') return;
    
//    alert('length: ' + newLayer.pageItems.length);
    for (var i = 0; i < newLayer.pageItems.length; i++) {
        var thisItem = newLayer.pageItems[i],
            name = thisItem.name.toLowerCase();
        pastLayers[name] = newLayer.pageItems[i];
        
        if(thisItem.typename === 'TextFrame'){
            if(name in obj){ //Don't Edit Any Extra Text Layers
                for(var z=0; z<thisItem.paragraphs.length; z++){
                    thisItem.paragraphs[z].paragraphAttributes.minimumHyphenatedWordSize = 20;
                }
//                alert(obj[name]);
//                if(name === 'company name') continue;
//                if(name === 'product id') continue;
                thisItem.contents = obj[name];
                
                var subCol = thisItem.LastSubCol;
                
                if (name === 'company name') {
                    while(isOversetSingle(thisItem)){
                        verticalAObj[name] += (.3 + reduceText(thisItem, 'reduce'));
                    }
                }
                
                if(name === 'limit'){
                    if(obj['limit'] !== '' && obj['product id'].match(/\S*/g).length > 1) {
                        thisItem.position = [65, (thisItem.position[1] + 30)]
                        verticalAObj[name] = 30;
                    };
                }

                if (name === 'product name' || isOverset(thisItem)) {
                    var orHeight = thisItem.textPath.height;
                    
                    var linesN = thisItem.lines.length;
                    
                    verticalAObj[name] += reduceText(thisItem, undefined, ((name === 'product id') ? true : false));
                    
                    if(name === 'product name' && linesN === 1){
                        verticalAObj['textbg'] = 15;
                        verticalAObj['product id'] += 20;
                        verticalAObj['product name'] += 10;
                    } else if(name === 'product id' && linesN > 1 && verticalAObj['product id'] > 0){
                        verticalAObj['product id'] -= 10;
                    };
                    
                    
                    
                    if(name === 'product id'){
                        var maxHeight = (verticalAObj['product name'] < 0) ? 148 : 78;
                        
                        if(obj['limit'] !== '' && obj['product id'].match(/\S*/g).length > 1) {
                            maxHeight -= 60;
                        };
//                        alert(verticalAObj['product name'])
                        if(thisItem.textPath.height > maxHeight && verticalAObj['product id'] < 0){
                            verticalAObj['textbg'] -= 15;
                            verticalAObj['product id'] -= 10;
                            verticalAObj['product name'] -= 10;
                        }
                        while(thisItem.textPath.height > maxHeight) {
                            if(thisItem.textRange.characterAttributes.size > 23){
                                verticalAObj[name] += reduceText(thisItem, 'reduce', true);
                            } else {
                                var product = reduceText(pastLayers['product name'], 'reduce'),
                                    company = reduceText(pastLayers['company name'], 'reduce');
                                
                                verticalAObj['product name'] += product;
                                verticalAObj['company name'] += company;
                                maxHeight -= (product + company);
//                                alert(maxHeight);
                            }
                        }
//                        alert(verticalAObj[name]);
                    }
                    
                }
            }
        } else if(thisItem.typename === 'PlacedItem') {
            if(name === 'image'){
                try{
                    var fileObj = new File(applicationPath + '/Links/' + obj['product id'].match(/^[0-9]+/g)[0] + '.jpg');
                    thisItem.relink(fileObj);
                    
                    var ratio = thisItem.width / thisItem.height;
                    
                    if(ratio <= 1){
                        thisItem.height = -(app.activeDocument.artboards[0].artboardRect[3]);
                        thisItem.width = thisItem.height * ratio;
                        thisItem.top = 0;
                    } else {
                        thisItem.width = 1250;
                        thisItem.height = thisItem.width / ratio;
                        thisItem.left = 780;
                    }
                } catch(e) {
                    alert(e);
                }
            }
        } else if(name === 'savings'){
            thisItem.hidden = false;
                
            var bounds = thisItem.pageItems.getByName("bounds");

            var dollars = thisItem.pageItems.getByName("Savings"),
                cents = thisItem.pageItems.getByName("Cents"),
                OFF = thisItem.pageItems.getByName("OFF"),
                centBreak = obj['savings'].match(/\.[0-9]{1,2}/),
                dollarOW = dollars.width;
//            alert(centBreak);
            centBreak = (centBreak !== null && centBreak.length > 0) ? centBreak[0].slice(1) : '';

            dollars.contents = obj['savings'].match(/\$([0-9]+\,*)+\.*/g)[0].replace(/[\$\.]/g, '');

            widthAdj += dollars.width - dollarOW;

            
            if(centBreak === ''){
                cents.remove();
            } else {
                var contentObj = centBreak;
                if(centBreak.length === 1) contentObj = centBreak + '0';
                cents.contents = contentObj;
                cents.position = [(dollars.position[0] + dollars.width + 10), cents.position[1]];
                cents.hidden = false;
                widthAdj += cents.width;
            };
            
            
            OFF.position = [OFF.position[0] + widthAdj, OFF.position[1]];
            bounds.width = bounds.width + widthAdj;
            
            if(thisItem.width > 1100){
                widthAdj -= reduceGroup(thisItem, 1100);
            };
            
            
            
        } else if(/price \(/.test(name)){

            if(name === priceS){
                thisItem.hidden = false;
                
                var bounds = thisItem.pageItems.getByName("bounds");
                
                if(priceS === 'price ($each)'){
                    var dollars = thisItem.pageItems.getByName("Dollars"),
                        cents = thisItem.pageItems.getByName("Cents"),
                        each = thisItem.pageItems.getByName("under each"),
                        dollarOW = dollars.width;

                    dollars.contents = obj['price'].match(/\$[0-9]*[\,]*[0-9]*[\.]*/g)[0].replace(/[\$\.]/g, '');
                    cents.contents = obj['price'].match(/[\.][0-9]{2}/g)[0].replace(/[\$\.]/g, '');

                    widthAdj = dollars.width - dollarOW;

                    cents.position = [cents.position[0] + widthAdj, cents.position[1]];
                    each.position = [each.position[0] + widthAdj, each.position[1]];
                    bounds.width = bounds.width + widthAdj;

                    if(thisItem.width > 1000){
                        widthAdj -= reduceGroup(thisItem, 1000);
                    };
                } else if(priceS === 'price (xfor$)'){
                    var dollars = thisItem.pageItems.getByName("Dollars"),
                        cents = thisItem.pageItems.getByName("Cents"),
                        $$ = thisItem.pageItems.getByName("$Sign"),
                        FOR = thisItem.pageItems.getByName("FOR"),
                        X = thisItem.pageItems.getByName("X"),
                        dollarOW = dollars.width,
                        xOW = X.width,
                        centsMatch = obj['price'].match(/[\.][0-9]{0,2}/g);
//                    alert(centsMatch);
                    if(centsMatch !== null && centsMatch.length > 0){
                        centsMatch = centsMatch[0].replace(/[\$\.]/g, '');
                    } else {
                        centsMatch = '00';
                    }

                    dollars.contents = obj['price'].match(/\$[0-9]*[\,]*[0-9]*[\.]*/g)[0].replace(/[\$\.]/g, '');
                    cents.contents = ((centsMatch.length > 1) ? centsMatch : (centsMatch + '0'));
                    X.contents = obj['price'].match(/[0-9]+/g)[0];

                    widthAdj += X.width - xOW;
                    
                    FOR.position = [FOR.position[0] + (widthAdj/2), FOR.position[1]];
                    $$.position = [$$.position[0] + widthAdj, $$.position[1]];
                    dollars.position = [dollars.position[0] + widthAdj, dollars.position[1]];
                    
                    widthAdj += dollars.width - dollarOW;
                    
                    if(widthAdj > 270 && centsMatch === '00'){
                        cents.remove();
                        widthAdj -= 270;
                    } else {
                        cents.position = [cents.position[0] + widthAdj, cents.position[1]];
                    }

                    bounds.width = bounds.width + widthAdj;

                    if(thisItem.width > 1000){
                        widthAdj -= reduceGroup(thisItem, 1000);
                    };
                } else if(priceS === 'price (getxfree)'){
                    var amount = thisItem.pageItems.getByName("Amount"),
                        Y = thisItem.pageItems.getByName("GET Y"),
                        OFFER = thisItem.pageItems.getByName("Offer Price"),
                        BUY = thisItem.pageItems.getByName("BUY"),
                        amountOW = amount.width,
                        yOW = Y.width,
                        offerOW = OFFER.width,
                        offerText = obj['price'].split(/get \S*/i)[1];
                    
                    amount.contents = obj['price'].match(/[0-9]+/gi)[0];
                    Y.contents = obj['price'].match(/get \S*/gi)[0].toUpperCase();
                    OFFER.contents = (offerText !== undefined) ? offerText.replace(/^[ \t]+|[ \t]+$/g, '').toUpperCase() : OFFER.contents;
                    
//                    alert(OFFER.contents);
//                    alert(offerText.replace(/^[ \t]+|[ \t]+$/g, ''));
                    
                    widthAdj += amount.width - amountOW;
                    
                    BUY.position = [BUY.position[0] + (widthAdj/2), BUY.position[1]];
                    Y.position = [Y.position[0] + widthAdj, Y.position[1]];
                    OFFER.position = [OFFER.position[0] + widthAdj, OFFER.position[1]];
                    
                    yOW = Y.width - offerOW;
                    offerOW = OFFER.width - offerOW;
                    widthAdj += (yOW > offerOW) ? yOW : offerOW;
                    bounds.width = bounds.width + widthAdj;

                    if(thisItem.width > 1100){
                        widthAdj -= reduceGroup(thisItem, 1100);
                    };
                } else if(priceS === 'price (special)'){
                    var firstLine = thisItem.pageItems.getByName("SPECIAL FIRST LINE"),
                        secondLine = thisItem.pageItems.getByName("SPECIAL SECOND LINE"),
                        big$ = thisItem.pageItems.getByName("$Sign"),
                        small$ = thisItem.pageItems.getByName("$Sign Small"),
                        firstLineOW = firstLine.width,
                        secondLineOW = secondLine.width,
                        bothLines = obj['price'].split(/\n/),
                        topDollar = bothLines[0].split(/\$/g),
                        bottomDollar = (bothLines.length > 1) ? bothLines[1].split(/\$/g) : [],
                        positionFinder;
                    
                    firstLine.contents = bothLines[0].replace(/\$/g, ' ');
                    secondLine.contents = (bothLines.length > 1) ? bothLines[1].replace(/\$/g, ' ') : '';
                    
                    if(bottomDollar.length < 2){
                        big$.remove()
                    } else {
                        dollarReplace(bottomDollar, secondLine, big$);
                    };
                    
                    if(topDollar.length < 2){
                        small$.remove()
                    } else {
                        dollarReplace(topDollar, firstLine, small$);
                    };
                    
                    function dollarReplace(dollarArr, textObj, $$){
                        var contentObj = '';
                        positionFinder = textObj.duplicate();
                        
                        for(var i=0; i<(dollarArr.length - 1); i++){
                            var new$ = $$.duplicate();
                            
                            contentObj += (i===0) ? dollarArr[i] : ' ' + dollarArr[i];
                            
                            positionFinder.contents = contentObj;
                            new$.position = [(positionFinder.position[0] + positionFinder.width), new$.position[1]];
                            new$.hidden = false;
                        }
                    
                        positionFinder.remove();
                        $$.remove();
                    }
                    
                    firstLineOW = firstLine.width - secondLineOW;
                    secondLineOW = secondLine.width - secondLineOW;
                    widthAdj += (firstLineOW > secondLineOW) ? firstLineOW : secondLineOW;
                    bounds.width = bounds.width + widthAdj;

                    if(thisItem.width > 1400){
                        widthAdj -= reduceGroup(thisItem, 1400);
                    };
                }

                bounds.hidden = true;
            } else {
                deletion.push(i);
            }
                
                
        } else {
            if(name === "textbg") {
                var pOptionW = {'price ($each)': 0, 'price (getxfree)': -60, 'price (special)': 400, 'price (xfor$)': -10},
                    minW = (obj["layer template"] === 'INSTANT SAVINGS') ? -40 : -140;
                
                if(widthAdj < minW) widthAdj = minW;
                
                thisItem.position = [thisItem.position[0] + widthAdj + pOptionW[priceS], thisItem.position[1]];
            }
            
        }
        
    }
    
    for (var i = (newLayer.pageItems.length - 1); i >= 0; i--) { //Loop again to Adjust for the vertical change
        var thisItem = newLayer.pageItems[i],
            dontReflow = ['Image', 'Left Side Elements', 'RED HOT BUYS', 'ACE LOGO'],
            name = thisItem.name.toLowerCase();
        
        if(verticalAObj[name] !== undefined) verticalAdj += verticalAObj[name];
        
        if(arrIncludes(deletion, i)){
            thisItem.remove();
            continue;
        } else if(arrIncludes(dontReflow, thisItem.name)){
            continue;
        };
        
        thisItem.position = [thisItem.position[0], (thisItem.position[1] + verticalAdj)];
    }

}

export {createLayer};