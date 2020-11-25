"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _objectHash = _interopRequireDefault(require("object-hash"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

AnimateNode = /*#__PURE__*/function () {
  function AnimateNode(id, type, original) {var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};_classCallCheck(this, AnimateNode);
    this.id = id;
    this.type = type;
    this.data = data;

    // TODO node should not contain original
    this._original = original;
  }_createClass(AnimateNode, [{ key: "finalizeId", value: function finalizeId()









    {
      var originalId = this.id;

      this.id = (0, _objectHash["default"])(_objectSpread({
        type: this.type },

      this.data));


      return originalId;
    } }, { key: "id", set: function set(id) {this._id = id;}, get: function get() {return this._id;} }, { key: "node", get: function get()

    {
      return this;
    } }, { key: "original", get: function get()

    {
      return this.node._original;
    } }]);return AnimateNode;}();exports["default"] = AnimateNode;