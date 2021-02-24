import { active_document, application_path } from "../globals/document";

class AiImage {
  constructor(item, url, options) {
    const file_urls = [
      url,
      application_path + "/" + url,
      application_path + "/links/" + url,
      application_path + "/images/" + url,
    ];

    this.model = item;
    this.obj = item.parent.placedItems.add();
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
      
      active_document.selection = [this.obj, this.model];
      app.executeMenuCommand("group");
      this.parent = this.obj.parent;
      this.obj.move(this.parent, ElementPlacement.PLACEATEND);
      this.toggleClip(true);
    }
  }

  attachImage(url, callback, onFail) {
    let file = new File(url);
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

  setSize(option) {
    const modelRatio = this.model.width / this.model.height;
    option = option ? option : "contain";

    let keyDim = this.original.ratio > modelRatio ? "width" : "height",
      keyIsWidth = keyDim === "width",
      secondDim = keyIsWidth ? "height" : "width";

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

      default:
        break;
    }
  }

  toggleClip(force) {
    let val = typeof force === "boolean" ? force : !this.parent.clipped;
    this.parent.clipped = val;
  }

  offset(axis) {
    let offset = {
      y: 0, //(this.obj.textPath.height - this.original.height),
      x: 0, //(this.obj.textPath.width - this.original.width),
    };

    if (axis) return offset[axis];
    return offset;
  }

  move(x, y) {
    this.obj.top -= y;
    this.model.top -= y;

    this.obj.left -= x;
    this.model.left -= x;
  }

  setLocation(x, y) {
    x = x || "top";
    y = y || x === "center" ? "center" : "left";

    const exes = {
      top: this.model.top,
      center: (this.obj.height - this.model.height) / 2 + this.model.top,
      bottom: this.model.top + (this.obj.height - this.model.height),
    };

    const whys = {
      left: this.model.left,
      center: (this.model.width - this.obj.width) / 2 + this.model.left,
      bottom: this.model.left + (this.obj.width - this.model.width),
    };

    this.obj.top = exes[x] ? exes[x] : this.obj.top;
    this.obj.left = whys[y] ? whys[y] : this.obj.left;

    // switch (y) {
    //   case "left":
    //     this.obj.left = this.model.left;
    //     break;

    //   case "center":
    //     this.obj.left =
    //       this.model.left + (this.model.width - this.obj.width) / 2;
    //     break;

    //   default:
    //     break;
    // }

    // x = x ? x : "top";
    // y = y ? y : x === "center" ? "center" : "left";

    // exes = {
    //   top: this.model.top,
    //   center: this.model.top + (this.obj.height - this.model.height) / 2,
    //   bottom: this.model.top + (this.obj.height - this.model.height),
    // };
    // whys = {
    //   left: this.model.left,
    //   center: this.model.left + (this.obj.width - this.model.width) / 2,
    //   bottom: this.model.left + (this.obj.width - this.model.width),
    // };

    // this.obj.top = exes[x] ? exes[x] : this.obj.top;
    // this.obj.left = whys[y] ? whys[y] : this.obj.left;
  }
}

export { AiImage };
