export const is_image = new RegExp(".(gif|jpe?g|tiff?|png|webp|bmp)$", "i");
export const is_color = new RegExp("^#(?:[0-9a-fA-F]{3}){1,2}$", "i");
// const layer_options_slow = /({\s*(?:\w+['"]?\s*:\s*\w+['"]?\s*,\s*)*(?:\w+['"]?\s*:\s*\w+['"]?\s*)\s*})\s*?$/i;
export const layer_options = /(\{.*\})\s*?$/i;

export const key_test = (key: string) => {
  return new RegExp(
    "^\\s*" + key.replace(" ", "\\s{0,1}") + "\\s*(\\{.*\\})*\\s*$",
    "i"
  );
};