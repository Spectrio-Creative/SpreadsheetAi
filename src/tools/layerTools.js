function matchSize(new_item, item, options) {
  const new_ratio = new_image.width / new_image.height,
    old_ratio = new_image.width / new_image.height;

  new_item.height = item.height;
  new_item.width = item.width;
}

function matchLocation(new_item, item, options) {
  const new_ratio = new_image.width / new_image.height,
    old_ratio = new_image.width / new_image.height;

  new_item.top = item.top;
  new_item.left = item.left;
}

export { matchSize, matchLocation };
