import { document, templatePath } from "../globals/document";
import { addItemClassToGlobal, calculatePosition, parseAlignment } from "../tools/classes";
import { oppositeDimension } from "../tools/tools";
import { PositionOptionLimited } from './AiGroupItem';
import { AiPageItem, AiPageItemOptions } from "./AiPageItem";

export interface AiImageOptions extends AiPageItemOptions {
  size?: SizeOption;
  location?: string;
  align?: Alignment | DoubleAlignment;
  clipped?: boolean;
}

export class AiImage extends AiPageItem {
  uuid: string;
  obj: PlacedItem;
  hasImage: boolean;
  options: AiImageOptions;
  original: Box;
  parent: GroupItem;
  modelItem: PageItem;
  model: Box;
  clipped: boolean;

  constructor(item: PageItem, path?: string) {
    super(item);

    this.original = { height: 0, width: 0 };

    if (this.alreadSetUp(item)) return;

    if (!path) throw new Error("No path provided to AiImage");

    addItemClassToGlobal(this);

    const file_paths = [
      path,
      templatePath + "/" + path,
      templatePath + "/links/" + path,
      templatePath + "/images/" + path,
      templatePath + "/images/spreadsheet/" + path,
    ];

    this.modelItem = item;
    this.model = {
      top: item.top,
      left: item.left,
      width: item.width,
      height: item.height,
      ratio: item.width / item.height,
    };

    document.selection = [item];
    app.executeMenuCommand("group");

    this.obj = (item.parent as GroupItem).placedItems.add();
    this.parent = this.obj.parent as GroupItem;
    this.parent.name = "Image Group (" + (item.name || "").replace(/\s*\{.*\}\s*$/g, "") + ")";
    addItemClassToGlobal(this, this.parent.uuid);

    this.obj.move(this.parent, ElementPlacement.PLACEATEND);

    this.hasImage = false;

    for (let i = 0; i < file_paths.length; i++) {
      if (!this.hasImage) {
        this.tryToAttachImage(file_paths[i]);
      }
    }

    if (this.hasImage) {
      if (!this.options.size) this.options.size = "contain";

      this.setImageSize(this.options.size);
      this.alignImage(
        this.options.align ||
          (this.options.location as Alignment | DoubleAlignment) ||
          "center"
      );

      const clip = this.options.clipped ?? this.options.size !== "contain";

      this.toggleClip(clip);
    }
    
  }

  alreadSetUp(item: PageItem) {
    // Check if item is already set up
    // If the item is not a group, return false
    if (item.typename !== "GroupItem") return false;

    // If the group has no children, we assume it is not set up
    const children = (item as GroupItem).pageItems;
    if (children.length < 1) return false;

    // Group has at least one PlacedItem child
    let hasPlacedItem = false;
    for (let i = 0; i < children.length; i++) {
      if (children[i].typename === "PlacedItem") {
        hasPlacedItem = true;
        break;
      }
    }

    // If no PlacedItem children, return false
    if (!hasPlacedItem) return false;

    this.obj = children.filter((child) => child.typename === "PlacedItem")[0] as PlacedItem;
    this.parent = this.obj.parent as GroupItem;

    addItemClassToGlobal(this, this.parent.uuid);

    this.hasImage = true;

    // Find model layer
    if (this.parent.clipped) {
      this.modelItem = this.parent.pageItems[0];
      this.model = {
        top: this.modelItem.top,
        left: this.modelItem.left,
        width: this.modelItem.width,
        height: this.modelItem.height,
        ratio: this.modelItem.width / this.modelItem.height,
      };

      return true;
    }

    // If not clipped, find set model from parent
    this.model = {
      top: this.parent.top,
      left: this.parent.left,
      width: this.parent.width,
      height: this.parent.height,
      ratio: this.parent.width / this.parent.height,
    };

    return true;
  }

  tryToAttachImage(
    url: string,
    callback?: () => unknown,
    onFail?: (e: unknown) => unknown
  ) {
    const file = new File(url);
    if (!file.exists) return;
    try {
      this.obj.file = file;
      this.hasImage = true;
      this.resetOriginalDimensions();
      if (callback) callback();
    } catch (e) {
      if (onFail) onFail(e);
    }
  }

  setImageSize(option: SizeOption = "contain") {
    if (option === "original") {
      this.obj.height = this.original.height;
      this.obj.width = this.original.width;
      return;
    }

    let keyDimension: DimensionType =
      this.original.ratio > this.model.ratio ? "width" : "height";

    if (option === "cover") keyDimension = oppositeDimension(keyDimension);

    this.obj[keyDimension] = this.model[keyDimension];
    this.obj[oppositeDimension(keyDimension)] =
      keyDimension === "width"
        ? this.obj[keyDimension] / this.original.ratio
        : this.obj[keyDimension] * this.original.ratio;
  }

  toggleClip(force?: boolean) {
    const val = typeof force === "boolean" ? force : !this.parent.clipped;
    // If image is clipped make sure the model exists and is at the top of the group
    if (val && this.modelItem === undefined) {
      this.modelItem = this.parent.pathItems.add();
      this.modelItem.top = this.obj.top;
      this.modelItem.left = this.obj.left;
      this.modelItem.width = this.obj.width;
      this.modelItem.height = this.obj.height;
      this.modelItem.move(this.parent, ElementPlacement.PLACEATBEGINNING);
    }

    this.parent.clipped = val;
    this.clipped = val;

    if (!val) {
      this.modelItem.hidden = false;
      this.modelItem.remove();
      this.modelItem = undefined;
      return;
    }

  }

  offset(axis?: "x" | "y") {
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

  alignImage(x: Alignment | DoubleAlignment = "left", y?: VerticalAlignment) {
    [x, y] = parseAlignment(x, y);

    const [newX, newY] = calculatePosition(this.model, this.obj)[`${x} ${y}`]();

    this.obj.top = newY;
    this.obj.left = newX;
  }

  getPosition(position?: PositionOptionLimited) {
    if (!position) return [this.getPosition("top"), this.getPosition("left")];
    
    if (this.clipped) {
      return this.model[position];
    }

    return this.obj[position];
  }

  top() {
    return this.getPosition("top");
  }

  left() {
    return this.getPosition("left");
  }

  getDimension(dimension?: DimensionType) {
    if (!dimension) return [this.getDimension("width"), this.getDimension("height")];

    if (this.clipped) {
      return this.model[dimension];
    }

    return this.obj[dimension];
  }

  width() {
    return this.getDimension("width");
  }

  height() {
    return this.getDimension("height");
  }

  setDimension(dimension: DimensionType, value: number) {
    if (this.clipped) {
      this.model[dimension] = value;
      this.modelItem[dimension] = value;
      return;
    }

    const ratio = this.obj.width / this.obj.height;

    this.obj[dimension] = value;
    this.obj[oppositeDimension(dimension)] = dimension === "width" ? value / ratio : value * ratio;
  }

  setPosition(x: number, y: number) {
    // alert(`Setting position to ${x}, ${y}`);
    this.obj.top = y;
    this.obj.left = x;
    this.model.top = y;
    this.model.left = x;
    if (this.modelItem) {
      this.modelItem.top = y;
      this.modelItem.left = x;
    }
  }

  setHeight(height: number) {
    this.setDimension("height", height);
  }

  setWidth(width: number) {
    this.setDimension("width", width);
  }

  setSize(width: number, height: number) {
    // If image isn't clipped, clip it and then set the image size as cover
    if (!this.clipped) {
      this.toggleClip(true);
    }

    this.setHeight(height);
    this.setWidth(width);

    this.setImageSize("cover");
  }

  hideSelf(): void {
    this.parent.hidden = true;
    this.parent.pageItems.forEach((item) => {
      if (item !== this.obj) item.hidden = true;
    });
  }

  unHideSelf(): void {
    this.parent.hidden = false;
    this.parent.pageItems.forEach((item) => {
      if (item !== this.obj) item.hidden = false;
    });
  }
}
