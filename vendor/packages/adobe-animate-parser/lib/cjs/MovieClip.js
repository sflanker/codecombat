"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _CocoSchema3 = _interopRequireDefault(require("./CocoSchema"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}var

Timeline = /*#__PURE__*/function (_CocoSchema) {_inherits(Timeline, _CocoSchema);
  function Timeline() {var _this;_classCallCheck(this, Timeline);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Timeline).call(this));

    _this.cocoSchema.tweens = [];return _this;
  }_createClass(Timeline, [{ key: "addTween", value: function addTween(

    tween) {
      this.cocoSchema.tweens.push(tween);
    }

    // Override Tween property
  }, { key: "tweens", get: function get() {
      return this.cocoSchema.tweens;
    } }]);return Timeline;}(_CocoSchema3["default"]);var


MovieClip = /*#__PURE__*/function (_CocoSchema2) {_inherits(MovieClip, _CocoSchema2);
  function MovieClip() {var _this2;_classCallCheck(this, MovieClip);
    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(MovieClip).call(this));for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}

    _this2.cocoSchema.constructorArgs = args;return _this2;
  }_createClass(MovieClip, [{ key: "initialize", value: function initialize()

    {
    } }, { key: "on", value: function on()

    {} }, { key: "setTransform", value: function setTransform()

    {for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}
      this.cocoSchema.transform = args;

      return this;
    } }, { key: "_off", set: function set(

    bool) {
      this.cocoSchema.off = bool;
    }

    // Lazily create timeline to make sure that each instance of a movie clip has
    // its own timeline.  Due to the way that animate chains prototypes setting this
    // in the constructor results in shared state across multiple instances of the
    // movie clip subclass
  }, { key: "timeline", get: function get() {
      if (!this._timeline) {
        this._timeline = new Timeline();
      }

      return this._timeline;
    } }]);return MovieClip;}(_CocoSchema3["default"]);exports["default"] = MovieClip;