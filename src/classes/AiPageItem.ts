import { playgroundCounter } from '../playground/global';
import { addItemClassToGlobal, getOrMakeItemClass, parseOptions } from '../tools/classes';
import { layer_options } from '../tools/regExTests';
import { PaddingInput, normalizePadding, stringToObj } from '../tools/tools';
// import { AiGroupItem } from './AiGroupItem';

export interface AiPageItemOptions {
  maxHeight?: number;
  color?: string;
  align?: string;
  padding?: [number, number, number, number];
}

export class AiPageItem {
  uuid?: string;
  obj: PageItem;
  original: Box;
  stored: Box;
  options: AiPageItemOptions;
  padding: number[];
  name: string;
  typename: string;
  newValue?: string;

  constructor(item: PageItem) {
    playgroundCounter["AiPageItem"] = playgroundCounter["AiPageItem"] ? playgroundCounter["AiPageItem"] + 1 : 1;

    this.obj = item;
    this.options = parseOptions(item.name);
    this.original = { height: 0, width: 0, ratio: 1, top: 0, left: 0 };
    this.stored = { height: 0, width: 0, top: 0, left: 0 };
    this.resetOriginalDimensions();
    this.resetOriginalPosition();
    this.padding = [0, 0, 0, 0];

    this.name = item.name;
    this.typename = "Ai" + item.typename;

    const uuid = item.uuid;
    if (uuid) this.uuid = uuid;

    addItemClassToGlobal(this);
  }

  top() {
    return this.obj.top;
  }

  left() {
    return this.obj.left;
  }

  height() {
    return this.obj.height;
  }

  width() {
    return this.obj.width;
  }

  typeName() {
    return this.obj.typename;
  }

  setHeight(height: number) {
    this.obj.height = height;
  }

  setWidth(width: number) {
    this.obj.width = width;
  }

  setSize(width: number, height: number) {
    this.setHeight(height);
    this.setWidth(width);
  }

  hideSelf() {
    this.obj.hidden = true;
  }

  hide() {
    const parent = this.obj.parent as PageItem;
    let {top, left, width: _width, height: _height} = parent;

    this.hideSelf();

    if (parent.typename === "GroupItem") {
      const parentItem: AiPageItem = getOrMakeItemClass(parent, "infer");
      top = parentItem.top();
      left = parentItem.left();
      _width = parentItem.width();
      _height = parentItem.height();
    }

    this.storeSizeAndPosition();
    this.setSize(0.1, 0.1);
    this.setPosition(
      left,
      top
    );
  }

  unHideSelf() {
    this.obj.hidden = false;
  }

  unHide() {
    this.unHideSelf();
    this.resetFromStored();
  }

  setPadding(padding: PaddingInput) {
    this.padding = normalizePadding(padding);
  }

  offset(axis?: "x" | "y") {
    const offset = {
      y: this.height() - this.original.height,
      x: this.width() - this.original.width,
    };

    if (axis) return offset[axis];
    return offset;
  }

  move(x: number, y: number) {
    // Check for NaN
    if (x !== x) x = 0;
    if (y !== y) y = 0;

    this.obj.top -= y;
    this.obj.left -= x;
  }

  setPosition(x: number, y: number) {
    this.obj.top = y;
    this.obj.left = x;
  }

  shrink(x: number, y: number) {
    x = x || 0;
    y = y || 0;

    this.obj.height -= y;
    this.obj.width -= x;
  }

  resetOriginalDimensions() {
    try {
      this.original.height = this.height();
      this.original.width = this.width();
      this.original.ratio = this.original.width / this.original.height;

    } catch (error) {
      alert(`Error thrown while getting item dimensions.
      layer: ${this.obj.name}
      layer kind: ${(this.obj as TextFrame)?.kind}
      ${error.name}
      ${error.message}
      (line #${error.line} in ${$.stack.match(/\[(.*?)\]/)[1]})`);
      throw error;
    }
  }

  resetOriginalPosition() {
    this.original.top = this.obj.top;
    this.original.left = this.obj.left;
  }

  storeSizeAndPosition() {
    this.stored.height = this.obj.height;
    this.stored.width = this.obj.width;
    this.stored.top = this.obj.top;
    this.stored.left = this.obj.left;
  }

  resetFromStored() {
    this.obj.height = this.stored.height;
    this.obj.width = this.stored.width;
    this.obj.top = this.stored.top;
    this.obj.left = this.stored.left;
  }
 
  // parseLayerName(layerName: string): string {
  //   // const nameParts = /(.*?)(\{.*\})\s*?$/
  //   // if (nameParts.test(layerName)) {
  //   //   const [_full, name, optionStr] = layerName.match(nameParts);
  //   //   const options: Record<string, any> = stringToObj(optionStr)
  //   //   return [name, options]
  //   // }
  
  //   return layerName
  // }
}