"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _sandboxedFunction = _interopRequireDefault(require("../util/sandboxedFunction"));
var _cjs = _interopRequireDefault(require("./cjs"));

var _parse = _interopRequireDefault(require("./parse"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

AdobeAnimation = /*#__PURE__*/function () {
  function AdobeAnimation(animationFile) {_classCallCheck(this, AdobeAnimation);
    this.animateFile = animationFile || '';

    this.library = {};
    this.movieClips = {};
    this.animationTrees = {};

    if (this.animateFile.trim().length === 0) {
      throw new Error('Invalid file format - animate file is empty');
    }
  }_createClass(AdobeAnimation, [{ key: "parse", value: function parse()

    {
      this["import"]();
      this.findAndMonitorLibraryMovieClips();
      this.buildAnimationTrees();

      this.findEntryPoint();

      this.parseTree();
    } }, { key: "import", value: function _import()























    {
      this.library = {};
      var animate = {};

      var compiledAnimateFile = (0, _sandboxedFunction["default"])("\n      createjs = cocoCjs;\n     \n      try {\n          lib = cocoLibrary;\n      } catch (e) {} // If lib is defined overwrite it\n   \n      try {\n          AdobeAn = cocoAnimate;\n      } catch (e) {} // If lib is defined overwrite it\n      \n      ".concat(










      this.animateFile, "\n    "));


      try {
        compiledAnimateFile({
          cocoLibrary: this.library,
          cocoAnimate: animate,
          cocoCjs: _cjs["default"],
          console: console });

      } catch (e) {
        throw new Error('Failed parsing animate file', e);
      }

      // If animate compositions is present, extract library from it, otherwise assume script will set it
      if (animate.compositions) {
        var animateCompositions = animate.compositions;
        var compositionKeys = Object.keys(animateCompositions);

        if (compositionKeys.length !== 1) {
          throw new Error('Unexpected number of compositions');
        }

        this.library = animateCompositions[compositionKeys[0]].getLibrary();
      }

      if (Object.keys(this.library).length === 0) {
        throw new Error('Nothing in library');
      }

      this.findAndMonitorLibraryMovieClips();

      this.imported = true;
    }

    /**
       * Find every top level movie clip exposed from the library and mod
       */ }, { key: "findAndMonitorLibraryMovieClips", value: function findAndMonitorLibraryMovieClips()
    {var _this = this;
      this.constructorCallCounts = {};
      var constructorCallCounts = this.constructorCallCounts;var _loop = function _loop() {var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),

        key = _Object$entries$_i[0],value = _Object$entries$_i[1];
        if (value.prototype instanceof _cjs["default"].MovieClip) {
          var wrappedLibraryFunction = function wrappedLibraryFunction() {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
            this.cocoSchema.constructorArgs = args;

            constructorCallCounts[key] = constructorCallCounts[key] || 0;
            constructorCallCounts[key] += 1;

            return value.call.apply(value, [this].concat(args));
          };

          wrappedLibraryFunction.prototype = value.prototype;

          _this.library[key] = wrappedLibraryFunction;
          _this.movieClips[key] = wrappedLibraryFunction;
        }};for (var _i = 0, _Object$entries = Object.entries(this.library); _i < _Object$entries.length; _i++) {_loop();
      }
    } }, { key: "buildAnimationTrees", value: function buildAnimationTrees()

    {
      for (var _i2 = 0, _Object$entries2 = Object.entries(this.movieClips); _i2 < _Object$entries2.length; _i2++) {var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),key = _Object$entries2$_i[0],value = _Object$entries2$_i[1];
        this.animationTrees[key] = new value();
      }
    }

    /**
       * We track the number of times each library movie clip is constructed and select
       * the one that was constructed the smallest number of times.
       */ }, { key: "findEntryPoint", value: function findEntryPoint()
    {
      var minKey;
      var minCount = Infinity;
      var numOccurrencesOfMin;

      for (var _i3 = 0, _Object$entries3 = Object.entries(this.constructorCallCounts); _i3 < _Object$entries3.length; _i3++) {var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),key = _Object$entries3$_i[0],value = _Object$entries3$_i[1];
        if (value < minCount) {
          minCount = value;
          minKey = key;
          numOccurrencesOfMin = 1;
        } else if (value === minCount) {
          numOccurrencesOfMin += 1;
        }
      }

      if (typeof minKey === 'undefined') {
        throw new Error('No minimum found');
      }

      // If more than one movie clip had the minimum number of constructions we
      // are in an unexpected state.
      if (numOccurrencesOfMin > 1) {
        throw new Error('No clear entry point');
      }

      this.entryPointName = minKey;
      return this.entryPointName;
    } }, { key: "parseTree", value: function parseTree()

    {var _this2 = this;
      this.animateParser = new _parse["default"]();
      this._parsedEntryPoint = this.animateParser.parseMovieClip(this.animationTrees[this.entryPointName]);

      // For now assume top level is a movie clip and the top level has
      // a self referencing tween that we do not support.
      // We assume this self referencing tween is always the first tween.
      this._parsedEntryPoint.data.tweens = this._parsedEntryPoint.data.tweens.filter(function (tween) {
        return _this2._parsedEntryPoint.id !== tween.node.id;
      });

      this.libraryProperties = this.library.properties || {};
      this._parsedEntryPoint.id = this.entryPointName;

      this.treeParsed = true;
    } }, { key: "entryPoint", get: function get() {if (!this.imported) {throw new Error('Animate file not imported');}return this.movieClips[this.entryPointName];} // TODO needs a better name
  }, { key: "parsedEntryPoint", get: function get() {if (!this.treeParsed) {throw new Error('Entry point not parsed');}return _objectSpread({}, this.animateParser.schema, { entryPointName: this.entryPointName, properties: this.libraryProperties });} }]);return AdobeAnimation;}();exports["default"] = AdobeAnimation;