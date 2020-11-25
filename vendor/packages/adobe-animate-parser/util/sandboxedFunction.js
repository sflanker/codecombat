"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = sandboxFunction;function has(target, key) {
  return true;
}

// Taken from https://blog.risingstack.com/writing-a-javascript-framework-sandboxed-code-evaluation/
function sandboxFunction(src) {
  src = 'with (sandbox) {' + src + '}';
  var code = new Function('sandbox', src);

  return function (sandbox) {
    var sandboxProxy = new Proxy(sandbox, { has: has });
    return code(sandboxProxy);
  };
}