function extendExtendscript() {
  // @ts-expect-error
  $.setTimeout = function (func: () => unknown, time: number) {
    $.sleep(time);
    func();
  };
}

export const $setTimeout = (func: () => unknown, time: number) => {
  $.sleep(time);
  func();
};

export { extendExtendscript };
