"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _CocoSchema2 = _interopRequireDefault(require("./CocoSchema"));
var _Graphics = _interopRequireDefault(require("./Graphics"));
var _Rectangle = _interopRequireDefault(require("./Rectangle"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}var

Shape = /*#__PURE__*/function (_CocoSchema) {_inherits(Shape, _CocoSchema);
  function Shape() {var _this;_classCallCheck(this, Shape);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Shape).call(this));

    _this.graphics = new _Graphics["default"](_assertThisInitialized(_this));return _this;
  }_createClass(Shape, [{ key: "setTransform", value: function setTransform()

    {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      this.cocoSchema.transform = args;

      return this;
    } }, { key: "getBounds", value: function getBounds()

    {
      if (typeof this.graphics.minX === 'undefined') {
        return undefined;
      }

      return new _Rectangle["default"](
      this.graphics.minX,
      this.graphics.minY,
      this.graphics.maxX - this.graphics.minX,
      this.graphics.maxY - this.graphics.minY);

    } }]);return Shape;}(_CocoSchema2["default"]);exports["default"] = Shape;