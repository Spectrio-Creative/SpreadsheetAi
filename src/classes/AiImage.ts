import { document, templatePath } from "../globals/document";
import { isStringLocation, parseLocation } from "../tools/classes";
import { oppositeDimension } from '../tools/tools';
import { AiPageItem, AiPageItemOptions } from './AiPageItem';

export type SizeOption = "contain" | "cover" | "original";

export type Alignment = "left" | "right" | "center" | "top" | "bottom";

export type DoubleAlignment = "left top" | "left center" | "left bottom" | "right top" | "right center" | "right bottom" | "center top" | "center center" | "center bottom";

export interface AiImageOptions extends AiPageItemOptions {
  size?: SizeOption;
  location?: string;
  align?: Alignment | DoubleAlignment;
}

export class AiImage extends AiPageItem {
  uuid: string;
  obj: PlacedItem;
  hasImage: boolean;
  options: AiImageOptions;
  original: Box;
  parent: GroupItem;
  model: PageItem;
  clipped: boolean;

  constructor(item: PageItem, path?: string) {
    super(item);

    const file_urls = [
      url,
      templatePath + "/" + url,
      templatePath + "/links/" + url,
      templatePath + "/images/sorcerer/" + url,
    ];

    this.model = item;
    document.selection = [item];
    app.executeMenuCommand("group");

    this.obj = (item.parent as GroupItem).placedItems.add();
    this.hasImage = false;
    this.original = { height: 0, width: 0 };

    for (let i = 0; i < file_urls.length; i++) {
      if (!this.hasImage) {
        this.attachImage(file_urls[i]);
      }
    }

    if (this.hasImage) {
      this.options.size ? this.setImageSize(this.options.size) : this.setImageSize();
      this.options.location
        ? this.setLocation(this.options.location)
        : this.setLocation("center");

      this.parent = this.obj.parent as GroupItem;
      // @ts-ignore
      this.obj.move(this.parent, ElementPlacement.PLACEATEND);
      this.toggleClip(true);
    }
  }

  attachImage(url: string, callback?: () => unknown, onFail?: (e: unknown) => unknown) {
    const file = new File(url);
    try {
      this.obj.file = file;
      this.hasImage = true;
      this.resetOriginalDimensions();
      if (callback) callback();
    } catch (e) {
      if (onFail) onFail(e);
    }
  }

  height() {
    if (this.clipped) return this.parent.height;
    return this.obj.height;
  }

  width() {
    if (this.clipped) return this.parent.width;
    return this.obj.width;
  }

  setImageSize(option: SizeOption = 'contain') {

    if(option === "original") {
      this.obj.height = this.original.height;
      this.obj.width = this.original.width;
      return;
    }

    const modelRatio = this.model.width / this.model.height;
    let keyDimension: dimension = this.original.ratio > modelRatio ? "width" : "height";

    if (option === "cover") keyDimension = oppositeDimension(keyDimension);

    this.obj[keyDimension] = this.model[keyDimension];
    this.obj[oppositeDimension(keyDimension)] = keyDimension === "width"
      ? this.obj[keyDimension] / this.original.ratio
      : this.obj[keyDimension] * this.original.ratio;
  }

  toggleClip(force?: boolean) {
    const val = typeof force === "boolean" ? force : !this.parent.clipped;
    this.parent.clipped = val;
    this.clipped = val;
  }

  offset(axis?: 'x' | 'y') {
    const offset = {
      y: 0, //(this.obj.textPath.height - this.original.height),
      x: 0, //(this.obj.textPath.width - this.original.width),
    };

    if (axis) return offset[axis];
    return offset;
  }

  move(x: number, y: number) {
    // Check for NaN
    if (x !== x) x = 0;
    if (y !== y) y = 0;

    this.obj.top -= y;
    this.model.top -= y;

    this.obj.left -= x;
    this.model.left -= x;
  }

  setLocation(x?: number | string, y?: number | string) {
    if (!y && isStringLocation(`${x}`)) {
      const location = parseLocation(`${x}`);
      x = location.x;
      y = location.y;
    }

    if (typeof x === "string") {
      if (/^(top|bottom)$/.test(x)) {
        y = x;
        x = "center";
      }

      x = x || "left";
      y = y || (x === "center" ? "center" : "top");

      const whys = {
        top: this.model.top,
        center:
          (-1 * (this.model.height - this.obj.height)) / 2 + this.model.top,
        bottom: this.model.top - (this.model.height - this.obj.height),
      };

      const exes = {
        left: this.model.left,
        center: (this.model.width - this.obj.width) / 2 + this.model.left,
        right: this.model.left + (this.model.width - this.obj.width),
      };

      this.obj.top = y in whys ? whys[y] : this.obj.top;
      this.obj.left = x in exes ? exes[x] : this.obj.left;
      return;
    }

    this.obj.top = typeof y === "number" ? y : this.obj.top;
    this.obj.left = x;
  }
}