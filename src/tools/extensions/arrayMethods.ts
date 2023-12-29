export function setUpArrayMethods() {
  Array.prototype.indexOf = function (item) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };

  Array.prototype.includes = function (item) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === item) return true;
    }
    return false;
  };

  Array.prototype.forEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
      callback(this[i], i, this);
    }
  };
}