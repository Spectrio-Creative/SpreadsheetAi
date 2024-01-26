import {
  getGroupAlignment,
  isStringLocation,
  parseLocation,
} from "../tools/classes";
import { layer_options } from "../tools/regExTests";
import { stringToObj } from "../tools/tools";
import { AiPageItem, AiPageItemOptions } from "./AiPageItem";

export type PositionOption = "top" | "bottom" | "left" | "right" | "center";

export type PositionOptionLimited = "top" | "left";

export type DimensionOption = "width" | "height";

export interface Coordinates {
  name?: string;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

export interface AiGroupItemOptions extends AiPageItemOptions {
  align?: string;
}

export class AiGroupItem extends AiPageItem {
  background: AiPageItem;
  obj: GroupItem;

  constructor(item: GroupItem) {
    super(item);
    this.background = undefined;
    this.findBackground();
    if (this.background) this.setBackgroundPadding();
  }

  measurableChildren() {
    // let pageItems: (PageItem | AiPageItem)[] = [...this.obj.pageItems];
    let pageItems = [...this.obj.pageItems];

    // Filter out groups
    pageItems = pageItems.filter((item) => item.typename !== "GroupItem");

    // Filter out clipped items if clipped is true
    if (this.obj.clipped) pageItems = pageItems.filter((item) => !!(item as PathItem)?.clipping);

    // Convert textFrameItems to AiTextBoxes
    // pageItems = pageItems.map((item) => {
    //   if (item.typename === "TextFrame") {
    //     const options = layer_options.test(item.name)
    //       ? stringToObj(item.name.match(layer_options)[1])
    //       : {};
    //     return new AiTextBox((item as TextFrame), undefined, options);
    //   }
    //   return item;
    // });

    return pageItems;
  }

  getPosition(position?: PositionOptionLimited) {
    if (!position) return [this.getPosition("top"), this.getPosition("left")];

    let min = Number.POSITIVE_INFINITY;
    this.obj.groupItems.forEach((groupItem) => {
      const group = new AiGroupItem(groupItem, {});
      const groupPosition = group.getPosition(position);
      if (groupPosition < min) min = groupPosition;
    });

    const pageItems = this.measurableChildren();
    pageItems.forEach((pageItem) => {
      const pageItemPosition = position === "top" ? -pageItem[position] : pageItem[position];
      if (pageItemPosition < min) min = pageItemPosition;
    });

    return min;
  }

  getDimension(dimension?: DimensionOption) {
    if (!dimension)
      return [this.getDimension("width"), this.getDimension("height")];

    const position: PositionOptionLimited = dimension === "width" ? "left" : "top";

    let max = 0;
    let coordinates: Coordinates[] = [];
    this.obj.groupItems.forEach((groupItem) => {
      const group = new AiGroupItem(groupItem, {});
      coordinates.push({
        [position]: group[position](),
        [dimension]: group[dimension](),
      });
    });

    const pageItems = this.measurableChildren();
    pageItems.forEach((pageItem) => {
      coordinates.push({
        name: pageItem.name,
        [position]: pageItem[position],
        [dimension]: pageItem[dimension],
      });
    });

    coordinates = coordinates.map((coor) => {
      if(position === "left") return coor;
      return {
        ...coor,
        [position]: -coor[position],
      };
    });

    coordinates.sort((a, b) => {
      const positionDifference = a[position] - b[position];
      if (positionDifference === 0) return a[dimension] - b[dimension];
      return positionDifference;
    });

    let lastAccepted: Coordinates | null = null;
    coordinates = coordinates.filter((coor) => {
      if (!lastAccepted || coor[position] < lastAccepted[position]) {
        lastAccepted = coor;
        return true;
      }

      if (
        lastAccepted[position] + lastAccepted[dimension] >
        coor[position] + coor[dimension]
      )
        return false;

      return true;
    });

    const minPosition = coordinates[0] ? coordinates[0][position] : Number.POSITIVE_INFINITY;

    const groupsDimension =
      coordinates.length > 0
        ? coordinates[coordinates.length - 1][dimension] +
          coordinates[coordinates.length - 1][position] -
          minPosition
        : 0;
    if (groupsDimension > max) max = groupsDimension;

    return max;
  }

  top() {
    return -this.getPosition("top");
  }

  left() {
    return this.getPosition("left");
  }

  width() {
    return this.getDimension("width");
  }

  height() {
    return this.getDimension("height");
  }

  setTop(top: number) {
    const thisTop = this.top();
    const offset = top - thisTop;
    this.obj.top = this.obj.top + offset;
    return top;
  }

  setLeft(left: number) {
    const thisLeft = this.left();
    const offset = left - thisLeft;
    this.obj.left = this.obj.left + offset;
    return left;
  }

  setPosition(x?: number | string, y?: number | string) {
    if (!x && !y) {
      const groupAlignment = getGroupAlignment(this.obj);

      x = groupAlignment.x;
      y = groupAlignment.y;
      if (this.options.align) {
        x = this.options.align;
        y = undefined;
      }
    }
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

      const [width, height] = this.getDimension();
      // const [top, left] = this.getPosition();

      const whys = {
        top: this.original.top,
        center:
          (-1 * (this.original.height - height)) / 2 +
          this.original.top,
        bottom: this.original.top - (this.original.height - height),
      };

      const exes = {
        left: this.original.left,
        center: (this.original.width - width) / 2 + this.original.left,
        right: this.original.left + (this.original.width - width),
      };

      this.setTop(y in whys ? whys[y] : this.obj.top);
      this.setLeft(x in exes ? exes[x] : this.obj.left);
      return;
    }

    super.setPosition(x, y);
  }

  findBackground() {
    let bg: AiPageItem;
    this.obj.pageItems.forEach((item) => {
      const options = layer_options.test(item.name)
        ? stringToObj(item.name.match(layer_options)[1])
        : {};
      if (options.groupBackground) bg = new AiPageItem(item, options);
    });

    this.background = bg;
  }

  setBackgroundPadding() {
    const prior = {
      top: this.obj.top,
      left: this.obj.left,
      width: this.obj.width,
      height: this.obj.height,
    };

    this.background.hide();

    const padding = this.background.options.padding
      ? this.background.options.padding
      : [
        -(this.obj.top - prior.top),
        -(this.obj.left + this.obj.width - (prior.left + prior.width)),
        this.obj.top - this.obj.height - (prior.top - prior.height),
        this.obj.left - prior.left,
      ];

    this.background.setPadding(padding);
    this.background.unHide();
  }

  setBackground() {
    if (!this.background) return;

    this.background.hide();
    const actual = {
      top: this.obj.top,
      left: this.obj.left,
      width: this.obj.width,
      height: this.obj.height,
    };
    const padding = this.background.padding;

    this.background.setPosition(
      actual.left - padding[3],
      actual.top + padding[0]
    );
    this.background.setSize(
      actual.width + (padding[1] + padding[3]),
      actual.height + (padding[0] + padding[2])
    );
  }
}
