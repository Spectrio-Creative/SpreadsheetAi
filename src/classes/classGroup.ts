import {
  getGroupAlignment,
  isStringLocation,
  parseLocation,
} from "../tools/classTools";
import { layer_options } from "../tools/regExTests";
import { stringToObj } from "../tools/tools";
import { AiPageItem } from "./classPageItem";

class AiGroupItem extends AiPageItem {
  background: AiPageItem;
  obj: GroupItem;

  constructor(item, options) {
    super(item, options);
    this.background = undefined;
    this.findBackground();
    if (this.background) this.setBackgroundPadding();
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
        top: this.original.top,
        center:
          (-1 * (this.original.height - this.obj.height)) / 2 +
          this.original.top,
        bottom: this.original.top - (this.original.height - this.obj.height),
      };

      const exes = {
        left: this.original.left,
        center: (this.original.width - this.obj.width) / 2 + this.original.left,
        right: this.original.left + (this.original.width - this.obj.width),
      };

      this.obj.top = y in whys ? whys[y] : this.obj.top;
      this.obj.left = x in exes ? exes[x] : this.obj.left;
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

    this.background.setPosition(actual.left - padding[3], actual.top + padding[0]);
    this.background.setSize(
      actual.width + (padding[1] + padding[3]),
      actual.height + (padding[0] + padding[2])
    );
  }
}

export { AiGroupItem };
