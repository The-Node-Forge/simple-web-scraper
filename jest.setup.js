// Polyfill Object.hasOwn for older Node versions
if (!Object.hasOwn) {
  Object.hasOwn = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
}

// Polyfill File for undici (used by cheerio)
// This is needed because undici expects browser-like globals
if (typeof File === 'undefined') {
  global.File = class File {
    constructor(bits, name, options) {
      this.bits = bits;
      this.name = name;
      this.options = options;
    }
  };
}

// Polyfill FormData if needed
if (typeof FormData === 'undefined') {
  global.FormData = class FormData {
    constructor() {
      this.data = new Map();
    }
    append(key, value) {
      this.data.set(key, value);
    }
  };
}
