function extendExtendscript() {
  // @ts-expect-error
  $.setTimeout = function (func: () => unknown, time: number) {
    $.sleep(time);
    func();
  };
}

export { extendExtendscript };
