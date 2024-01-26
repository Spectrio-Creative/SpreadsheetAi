import { groupBackground } from './playground/groupBackground';
// import { groupMeasure } from './playground/groupMeasure';
// import { groupMeasure } from './playground/groupMeasure';
import { setUpArrayMethods } from './tools/extensions/arrayMethods';
import { extendExtendscript } from './tools/extensions/jsxMethods';
import { setUpStringMethods } from './tools/extensions/string';
import { forceInclusions } from './tools/forceInclusions';


setUpStringMethods();
setUpArrayMethods();
extendExtendscript();
forceInclusions();

groupBackground();
