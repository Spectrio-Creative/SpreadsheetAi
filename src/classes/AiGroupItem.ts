import {
  addItemClassToGlobal,
  calculatePosition,
  getGroupAlignment,
  getOrMakeItemClass,
  parseAlignment,
  parseOptions,
} from "../tools/classes";
import { AiImage } from "./AiImage";
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
  align?: Alignment | DoubleAlignment | "original";
  position?: "original";
}

export class AiGroupItem extends AiPageItem {
  background: AiPageItem;
  obj: GroupItem;
  options: AiGroupItemOptions;

  constructor(item: GroupItem) {
    super(item);
    addItemClassToGlobal(this);
    this.background = undefined;
    this.findBackground();
    if (this.background) this.setBackgroundPadding();
  }

  measurableChildren(ignoreBackground: boolean = false) {
    // let pageItems: (PageItem | AiPageItem)[] = [...this.obj.pageItems];
    let pageItems = [...this.obj.pageItems];

    // Filter out groups
    pageItems = pageItems.filter((item) => {
      if (item.typename === "GroupItem") return false;
      if (item.hidden) return false;
      if (ignoreBackground && item.uuid === this.background.uuid) return false;
      return true;
    });

    // Filter out clipped items if clipped is true
    if (this.obj.clipped)
      pageItems = pageItems.filter((item) => !!(item as PathItem)?.clipping);

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

  getPosition(
    position?: PositionOptionLimited,
    ignoreBackground: boolean = false
  ): number | [number, number] {
    if (!position) {
      return [
        -this.getPosition("top", ignoreBackground),
        this.getPosition("left", ignoreBackground),
      ] as [number, number];
    }

    if (ignoreBackground && (!this.background || !this.background.uuid)) {
      ignoreBackground = false;
    }

    let min = Number.POSITIVE_INFINITY;
    this.obj.groupItems.forEach((groupItem) => {
      const group = getOrMakeItemClass(groupItem, "AiGroupItem") as AiGroupItem;
      // Check if group is background
      if (ignoreBackground && group.uuid === this.background.uuid) return;
      let groupPosition = group.getPosition(
        position,
        ignoreBackground
      ) as number;
      if (position === "top") groupPosition = -groupPosition;
      if (groupPosition < min) min = groupPosition;
    });

    const pageItems = this.measurableChildren(ignoreBackground);
    pageItems.forEach((pageItem) => {
      let pageItemPosition = pageItem[position];
      if (position === "top") pageItemPosition = -pageItemPosition;
      if (pageItemPosition < min) min = pageItemPosition;
    });

    return min;
  }

  getDimension(
    dimension?: DimensionOption,
    ignoreBackground: boolean = false
  ): number | [number, number] {
    if (!dimension) {
      return [
        this.getDimension("width", ignoreBackground),
        this.getDimension("height", ignoreBackground),
      ] as [number, number];
    }

    if (ignoreBackground && (!this.background || !this.background.uuid)) {
      ignoreBackground = false;
    }

    const position: PositionOptionLimited =
      dimension === "width" ? "left" : "top";

    let max = 0;
    let coordinates: Coordinates[] = [];
    this.obj.groupItems.forEach((groupItem) => {
      const group = getOrMakeItemClass(groupItem, "AiGroupItem") as AiGroupItem;
      if (ignoreBackground && group.uuid === this.background.uuid) return;
      coordinates.push({
        [position]: group[position](ignoreBackground),
        [dimension]: group[dimension](ignoreBackground),
      });
    });

    const pageItems = this.measurableChildren(ignoreBackground);
    pageItems.forEach((pageItem) => {
      coordinates.push({
        name: pageItem.name,
        [position]: pageItem[position],
        [dimension]: pageItem[dimension],
      });
    });

    coordinates = coordinates.map((coor) => {
      if (position === "left") return coor;
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

    const minPosition = coordinates[0]
      ? coordinates[0][position]
      : Number.POSITIVE_INFINITY;

    const groupsDimension =
      coordinates.length > 0
        ? coordinates[coordinates.length - 1][dimension] +
          coordinates[coordinates.length - 1][position] -
          minPosition
        : 0;
    if (groupsDimension > max) max = groupsDimension;

    return max;
  }

  top(ignoreBackground: boolean = false) {
    return -this.getPosition("top", ignoreBackground) as number;
  }

  left(ignoreBackground: boolean = false) {
    return this.getPosition("left", ignoreBackground) as number;
  }

  width(ignoreBackground: boolean = false) {
    return this.getDimension("width", ignoreBackground) as number;
  }

  height(ignoreBackground: boolean = false) {
    return this.getDimension("height", ignoreBackground) as number;
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

  setAlignment(x: Alignment | DoubleAlignment = "left", y?: VerticalAlignment) {
    const { align, position } = this.options;
    if (align === "original" || position === "original") return;

    if (align) {
      x = align;
    }

    if (!x && !y) {
      const groupAlignment = getGroupAlignment(this.obj);

      x = groupAlignment.x;
      y = groupAlignment.y;
    }

    [x, y] = parseAlignment(x, y);

    const [width, height] = this.getDimension() as [number, number];
    const [newX, newY] = calculatePosition(this.original, { height, width })[
      `${x} ${y}`
    ]();

    this.setTop(newY);
    this.setLeft(newX);

    // super.setPosition(x, y);
  }

  findBackground() {
    function recursiveSearch(pageItems: PageItem[]): AiPageItem {
      let bg: AiPageItem;
      pageItems.forEach((item) => {
        if (bg) return;
        const options = parseOptions(item.name);
        if (options.groupBackground) bg = getOrMakeItemClass(item);
        if (item.typename === "GroupItem") {
          bg = recursiveSearch((item as GroupItem).pageItems);
        }
      });
      return bg;
    }

    const bg = recursiveSearch(this.obj.pageItems);

    if (bg && bg instanceof AiImage) {
      // alert(`Found background image: ${bg.name}`);
    }

    this.background = bg;
  }

  setBackgroundPadding() {
    const outer = {
      top: this.top(),
      left: this.left(),
      width: this.width(),
      height: this.height(),
    };

    const inner = {
      top: this.top(true),
      left: this.left(true),
      width: this.width(true),
      height: this.height(true),
    };

    const top = outer.top - inner.top;
    const left = inner.left - outer.left;
    const right = (outer.left + outer.width) - (inner.left + inner.width);
    const bottom = (inner.top - inner.height) - (outer.top - outer.height);

    const calculatedPadding = [top, right, bottom, left];

    const padding = this.background.options.padding
      ? this.background.options.padding
      : calculatedPadding;

    this.background.setPadding(padding);
  }

  setBackground() {
    if (!this.background) return;

    const actual = {
      top: this.top(true),
      left: this.left(true),
      width: this.width(true),
      height: this.height(true),
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
