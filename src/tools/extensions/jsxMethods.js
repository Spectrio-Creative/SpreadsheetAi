function extendExtendscript() {
  $.setTimeout = function (func, time) {
    $.sleep(time);
    func();
  };
}

export { extendExtendscript };
