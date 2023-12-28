import { document, templatePath } from "../globals/document";
import { isStringLocation, parseLocation } from "../tools/classTools";

interface AiImageOptions {
  size?: string;
  location?: string;
}

class AiImage {
  obj: PlacedItem;
  hasImage: boolean;
  options: AiImageOptions;
  original: Box;
  parent: GroupItem;
  model: PageItem;

  constructor(item: PageItem, url, options: AiImageOptions) {
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
    this.options = options;
    this.original = { height: 0, width: 0 };

    for (let i = 0; i < file_urls.length; i++) {
      if (!this.hasImage) {
        this.attachImage(file_urls[i]);
      }
    }

    if (this.hasImage) {
      this.options.size ? this.setSize(this.options.size) : this.setSize();
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
      this.getDimensions();
      if (callback) callback();
    } catch (e) {
      if (onFail) onFail(e);
    }
  }

  height() {
    return this.obj.height;
  }

  width() {
    return this.obj.width;
  }

  getDimensions() {
    this.original.height = this.height();
    this.original.width = this.width();
    this.original.ratio = this.width() / this.height();
  }

  setSize(option?: string) {
    const modelRatio = this.model.width / this.model.height;
    option = option ? option : "contain";

    const keyDim = this.original.ratio > modelRatio ? "width" : "height";
    const keyIsWidth = keyDim === "width";
    const secondDim = keyIsWidth ? "height" : "width";

    switch (option) {
    case "contain":
      this.obj[keyDim] = this.model[keyDim];
      this.obj[secondDim] = keyIsWidth
        ? this.obj[keyDim] / this.original.ratio
        : this.obj[keyDim] * this.original.ratio;
      break;

    case "cover":
      this.obj[secondDim] = this.model[secondDim];
      this.obj[keyDim] = keyIsWidth
        ? this.obj[secondDim] * this.original.ratio
        : this.obj[secondDim] / this.original.ratio;
      break;

    case "original":
      this.obj[keyDim] = this.original[keyDim];
      this.obj[secondDim] = this.original[secondDim];
      break;

    default:
      break;
    }
  }

  toggleClip(force?: boolean) {
    const val = typeof force === "boolean" ? force : !this.parent.clipped;
    this.parent.clipped = val;
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
    if (!y && isStringLocation(x)) {
      const location = parseLocation(x);
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

export { AiImage };
