"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * We don't need the runtime for the Animate class.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Make everything on it a noop.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */var

Animate = /*#__PURE__*/function () {function Animate() {_classCallCheck(this, Animate);}_createClass(Animate, [{ key: "cocoGetComposition", value: function cocoGetComposition()
    {
      var compositionKeys = Object.keys(this.compositions || {});
      if (compositionKeys.length !== 1) {
        throw new Error('Unexpected number of compositions');
      }

      var compositionKey = compositionKeys[0];
      if (!compositionKey) {
        throw new Error('Default composition not found');
      }

      return this.getComposition(compositionKey);
    } }, { key: "bootcompsLoaded", value: function bootcompsLoaded()

    {} }, { key: "bootstrapCallback", value: function bootstrapCallback()
    {} }, { key: "compositionLoaded", value: function compositionLoaded()
    {} }, { key: "getComposition", value: function getComposition()
    {} }]);return Animate;}();exports["default"] = Animate;