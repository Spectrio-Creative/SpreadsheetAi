import { parseName, parseOptions } from "./classes";

export const hasMutableChildren = (
  item: PageItem | Layer,
  keyList: string[],
) => {
  function isOrHasMutable(item: PageItem | Layer, top = false) {
    if (item.typename === "Layer") {
      for (const inner of (item as Layer).layers) {
        return isOrHasMutable(inner);
      }
    } else if (!top && isMutableItem(item as PageItem, keyList)) return true;

    if (item.typename === "Layer" || item.typename === "GroupItem") {
      for (const inner of (item as GroupItem).pageItems) {
        return isOrHasMutable(inner);
      }
    }
    return false;
  }

  return isOrHasMutable(item, true);
};

export function isMutableItem(item: PageItem, keyList: string[]) {
  const name = parseName(item.name);
  const options = parseOptions(item.name);

  if (keyList.includes(name)) return true;
  if (Object.keys(options).length) return true;

  return false;
}
