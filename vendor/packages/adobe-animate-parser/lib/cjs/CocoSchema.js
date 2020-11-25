"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var CocoSchema = /*#__PURE__*/function () {function CocoSchema() {_classCallCheck(this, CocoSchema);}_createClass(CocoSchema, [{ key: "deleteCocoSchema", value: function deleteCocoSchema()












    {
      delete this._cocoSchema;
    } }, { key: "cocoSchema", get: function get() {// Because of the way CreateJS does extends its objects / constructs prototypes we need to
      // handle _cocoSchema definitions in a non standard way.  Doing a simple (if _cocoSchema) check
      // will search the prototype chain and end up in a shared cocoSchema amongst objects of the
      // same type
      if (!this.hasOwnProperty('_cocoSchema')) {Object.defineProperty(this, '_cocoSchema', { value: {} });}return this._cocoSchema;} }]);return CocoSchema;}();exports["default"] = CocoSchema;