import { loopBackwards, replaceMoustaches } from "./tools";

function insertTemplateValues(parent_layer, key, value) {
  function replaceValues(layer) {
    key_match = new RegExp(
      "[\\s]*" + key.replace(" ", "[\\s]{0,1}") + "[\\s]*",
      "i"
    );

    loopBackwards(layer.pageItems, (item) => {
      replaceMoustaches(item, key, value);

      if(key_match.test(item.name)){
          // If it's a text layer, replace the 
          // text with the spreadsheet value
          if(item.contents){
              item.contents = value;
          } else {
              alert(typeof item);
          }


      }
    });

    loopBackwards(layer.layers, replaceValues);
  }

  replaceValues(parent_layer);
}

export { insertTemplateValues };
