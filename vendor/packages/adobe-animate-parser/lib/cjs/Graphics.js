"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _CocoSchema2 = _interopRequireDefault(require("./CocoSchema"));

var _shapes = require("../../util/shapes");
var _Rectangle = _interopRequireDefault(require("./Rectangle"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}var

Graphics = /*#__PURE__*/function (_CocoSchema) {_inherits(Graphics, _CocoSchema);
  function Graphics(parent) {var _this;_classCallCheck(this, Graphics);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Graphics).call(this));

    _this.currentX = 0;
    _this.currentY = 0;

    _this.minX = Infinity;
    _this.minY = Infinity;
    _this.maxX = -1 * Infinity;
    _this.maxY = -1 * Infinity;

    _this.parent = parent;return _this;
  }_createClass(Graphics, [{ key: "f", value: function f(


    _f) {
      this.cocoSchema.fc = _f;
      return this;
    } }, { key: "s", value: function s(

    _s) {
      // TODO may be able to call this multiple times.  If so will need to have each
      // call to s() return a new object that collects the data on subsequent calls
      //
      // Collect each of these objects in an array on coco schema
      return this;
    } }, { key: "decodePath", value: function decodePath(

    p) {
      try {
        this.decodingPath = true;
        this.orignalDecodePath(p);
      } finally {
        this.decodingPath = false;
      }

      return this;
    } }, { key: "orignalDecodePath", value: function orignalDecodePath(

    pathString) {
      var instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
      var paramCount = [2, 2, 4, 6, 0];
      var i = 0,l = pathString.length;
      var params = [];
      var base64 = Graphics.BASE_64;
      var x = 0,y = 0;

      while (i < l) {
        var c = pathString.charAt(i);
        var n = base64[c];
        var fi = n >> 3; // highest order bits 1-3 code for operation.
        var f = instructions[fi];

        // check that we have a valid instruction & that the unused bits are empty:
        if (!f || n & 3) {throw "bad path data (@" + i + "): " + c;}

        var pl = paramCount[fi];
        if (!fi) {x = y = 0;} // move operations reset the position.
        params.length = 0;
        i++;

        var charCount = (n >> 2 & 1) + 2; // 4th header bit indicates number size for this operation.
        for (var p = 0; p < pl; p++) {
          var num = base64[pathString.charAt(i)];

          var sign = num >> 5 ? -1 : 1;
          num = (num & 31) << 6 | base64[pathString.charAt(i + 1)];

          if (charCount == 3) {num = num << 6 | base64[pathString.charAt(i + 2)];}

          num = sign * num / 10;
          if (p % 2) {x = num += x;} else
          {y = num += y;}

          params[p] = num;
          i += charCount;
        }

        f.apply(this, params);
      }

      return this;
    } }, { key: "p", value: function p(

    _p) {
      this.cocoSchema.p = _p;

      this.decodePath(_p);
      return this;
    } }, { key: "rf", value: function rf()

    {for (var _len = arguments.length, _rf = new Array(_len), _key = 0; _key < _len; _key++) {_rf[_key] = arguments[_key];}
      this.cocoSchema.rf = _rf;
      return this;
    } }, { key: "lf", value: function lf()

    {for (var _len2 = arguments.length, _lf = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {_lf[_key2] = arguments[_key2];}
      this.cocoSchema.lf = _lf;
      return this;
    } }, { key: "ss", value: function ss()

    {for (var _len3 = arguments.length, _ss = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {_ss[_key3] = arguments[_key3];}
      this.cocoSchema.ss = _ss;
      return this;
    } }, { key: "moveTo", value: function moveTo(

    x, y) {
      if (!this.decodingPath) {
        // Save to coco schema (not currently supported)
      }

      this.currentX = x;
      this.currentY = y;
    } }, { key: "lineTo", value: function lineTo(

    x, y) {
      if (!this.decodingPath) {
        // Save to coco schema (not currently supported)
      }

      this.processBoundingBox(
      (0, _shapes.getRectangleBounds)(
      this.currentX, this.currentY,
      x, y));



      this.currentX = x;
      this.currentY = y;
    } }, { key: "quadraticCurveTo", value: function quadraticCurveTo(

    cpx, cpy, x, y) {
      var curveBounds = (0, _shapes.getCurveBounds)(
      this.currentX, this.currentY,
      cpx, cpy,
      cpx, cpy,
      x, y);


      this.processBoundingBox(curveBounds);

      if (!this.decodingPath) {
        // Save to coco schema (not currently supported)
      }

      this.currentX = x;
      this.currentY = y;
    } }, { key: "bezierCurveTo", value: function bezierCurveTo(

    cp1x, cp1y, cp2x, cp2y, x, y) {
      var curveBounds = (0, _shapes.getCurveBounds)(
      this.currentX, this.currentY,
      cp1x, cp1y,
      cp2x, cp2y,
      x, y);


      this.processBoundingBox(curveBounds);

      if (!this.decodingPath) {
        // Save to coco schema (not currently supported)
      }

      this.currentX = x;
      this.currentY = y;
    } }, { key: "closePath", value: function closePath()

    {
      // Save to coco schema (not currently supported)
      // Also may want to reset currentX and currentY to zero

      if (this.parent) {var

        minX =



        this.minX,minY = this.minY,maxX = this.maxX,maxY = this.maxY;

        if (minX === Infinity || minY === Infinity || maxX === -1 * Infinity || maxY === -1 * Infinity) {
          throw new Error('Unexpected bounds state');
        }

        this.parent.nominalBounds = new _Rectangle["default"](
        minX,
        minY,
        maxX - minX,
        maxY - minY);

      }
    } }, { key: "processBoundingBox", value: function processBoundingBox(

    boundingBox) {
      var minX = boundingBox.x;
      var minY = boundingBox.y;

      var maxX = boundingBox.x + boundingBox.width;
      var maxY = boundingBox.y + boundingBox.height;

      this.minX = Math.min(this.minX, minX);
      this.minY = Math.min(this.minY, minY);

      this.maxX = Math.max(this.maxX, maxX);
      this.maxY = Math.max(this.maxY, maxY);
    } }]);return Graphics;}(_CocoSchema2["default"]);exports["default"] = Graphics;


Graphics.BASE_64 = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43, "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "+": 62, "/": 63 };