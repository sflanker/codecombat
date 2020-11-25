"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _lodash = _interopRequireDefault(require("lodash.clone"));

var _MovieClip = _interopRequireDefault(require("../cjs/MovieClip"));
var _Shadow = _interopRequireDefault(require("../cjs/Shadow"));
var _Shape = _interopRequireDefault(require("../cjs/Shape"));
var _Tween = _interopRequireDefault(require("../cjs/Tween"));
var _AnimateNode = _interopRequireDefault(require("./AnimateNode"));
var _AnimateNodeReference = _interopRequireDefault(require("./AnimateNodeReference"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _typeof(obj) {if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var

AnimateParser = /*#__PURE__*/function () {
  function AnimateParser() {_classCallCheck(this, AnimateParser);
    this.targetCache = {
      original: {},
      parsed: {} };


    this.schema = {
      shapes: [],
      animations: [],
      references: [],
      nativeObjects: [] };


    this.idCounter = 0;
  }_createClass(AnimateParser, [{ key: "nextId", value: function nextId()

    {
      return "temp_".concat(this.idCounter++);
    } }, { key: "markParsed", value: function markParsed(

    target) {
      if (this.haveParsed(target)) {
        return;
      }

      var tempId = this.nextId();
      this.applyParsedId(target, tempId);

      this.targetCache.original[tempId] = target;

      return tempId;
    } }, { key: "haveParsed", value: function haveParsed(

    target) {
      return typeof this.getParsedId(target) !== 'undefined';
    } }, { key: "getParsedId", value: function getParsedId(

    target) {
      return target._cocoId;
    } }, { key: "applyParsedId", value: function applyParsedId(

    target, id) {
      target._cocoId = id;
      return target;
    } }, { key: "updatedId", value: function updatedId(

    oldId, animateNode) {
      this.targetCache.original[animateNode.id] = this.targetCache.original[oldId];
      delete this.targetCache.original[oldId];

      this.targetCache.parsed[animateNode.id] = this.targetCache.parsed[oldId];
      delete this.targetCache.parsed[oldId];

      // TODO inefficient for animation trees with large numbers of references
      this.schema.references.forEach(function (reference) {
        if (reference.nodeId === animateNode.id) {
          reference.nodeId = animateNode.id;
        }
      });
    } }, { key: "getReference", value: function getReference(

    entityOrReference) {
      if (entityOrReference instanceof _AnimateNodeReference["default"]) {
        return entityOrReference;
      }

      var referencedNodeId;
      if (entityOrReference instanceof _AnimateNode["default"]) {
        referencedNodeId = entityOrReference.id;
      } else {
        referencedNodeId = this.getParsedId(entityOrReference);
      }

      var reference = new _AnimateNodeReference["default"]('', referencedNodeId, this.targetCache);
      var tempId = this.markParsed(reference);
      reference.id = tempId;

      this.schema.references.push(reference);
      return reference;
    } }, { key: "resolveEntity", value: function resolveEntity(

    entityOrReference) {
      if (entityOrReference instanceof _AnimateNodeReference["default"]) {var
        nodeId = entityOrReference.nodeId;

        var animateNode = this.targetCache.parsed[nodeId];
        if (!animateNode) {
          throw new Error('Animate node not found from reference');
        }

        return animateNode.original;
      }

      if (entityOrReference instanceof _AnimateNode["default"]) {
        return entityOrReference.original;
      }

      return entityOrReference;
    } }, { key: "parseRectangle", value: function parseRectangle(

    rectangle) {
      if (!rectangle) {
        return undefined;
      }

      var tempId = this.markParsed(rectangle);
      var result = new _AnimateNode["default"](
      tempId,
      'rectangle',
      rectangle,
      rectangle.cocoSchema.rectangleConfig);


      var originalId = result.finalizeId();
      this.updatedId(originalId, result);

      return result;
    } }, { key: "parseShape", value: function parseShape(

    shape) {
      if (this.haveParsed(shape)) {
        return this.getReference(shape);
      }

      var tempId = this.markParsed(shape);var


      frameBounds =

      shape.frameBounds,nominalBounds = shape.nominalBounds;

      var result = new _AnimateNode["default"](
      tempId,
      'shape',
      shape,
      {
        transform: shape.cocoSchema.transform,
        graphics: (shape.graphics || {}).cocoSchema });



      if (frameBounds) {
        result.data.frameBounds = this.parseRectangle(frameBounds);
      }

      if (nominalBounds) {
        result.data.bounds = this.parseRectangle(nominalBounds);
      }

      var originalId = result.finalizeId();
      this.updatedId(originalId, result);

      this.schema.shapes.push(result);
      this.targetCache.parsed[result.id] = result;

      return result;
    } }, { key: "parseMovieClip", value: function parseMovieClip(

    movieClip) {var _this = this;
      if (this.haveParsed(movieClip)) {
        return this.getReference(movieClip);
      }

      var tempId = this.markParsed(movieClip);var


      frameBounds =

      movieClip.frameBounds,nominalBounds = movieClip.nominalBounds;var

      tweens = movieClip.timeline.tweens;

      var parsedFrameBounds;
      if (frameBounds) {
        parsedFrameBounds = frameBounds.map(function (fb) {return _this.parseRectangle(fb);});
      }

      var parsedTweens = tweens.map(function (t) {return _this.parseTween(t);});

      var result = new _AnimateNode["default"](
      tempId,
      'movie_clip',
      movieClip, _objectSpread({

        constructorArgs: movieClip.cocoSchema.constructorArgs,
        transform: movieClip.cocoSchema.transform,

        bounds: this.parseRectangle(nominalBounds),
        frameBounds: parsedFrameBounds,

        tweens: parsedTweens },

      movieClip.cocoSchema.off && { off: movieClip.cocoSchema.off }));



      var originalId = result.finalizeId();
      this.updatedId(originalId, result);

      this.schema.animations.push(result);
      this.targetCache.parsed[result.id] = result;

      return result;
    } }, { key: "parseTween", value: function parseTween(

    tween) {
      if (this.haveParsed(tween)) {
        return this.getReference(tween);
      }

      var tempId = this.markParsed(tween);var

      target = tween.target;

      var parsedTarget;
      if (target instanceof _MovieClip["default"]) {
        parsedTarget = this.parseMovieClip(target);
      } else if (target instanceof _Shape["default"]) {
        parsedTarget = this.parseShape(target);
      } else if (target.constructor === Object) {
        // If tween target is a plain object make sure to handle it in code
        parsedTarget = this.parseNativeJsObject(target);
      } else {
        throw new Error('Invalid tween target');
      }

      var tweenCalls = this.parseNativeJsObject(tween.cocoSchema.methodCalls);

      var result = new _AnimateNode["default"](
      tempId,
      'tween',
      tween,
      {
        target: this.getReference(parsedTarget),
        tweenCalls: tweenCalls });



      var originalId = result.finalizeId();
      this.updatedId(originalId, result);

      this.targetCache.parsed[result.id] = result;
      return result;
    }

    // This function only supports simple JSON objects but does not exactly check for them
  }, { key: "parseNativeJsObject", value: function parseNativeJsObject(object) {
      if (this.haveParsed(object)) {
        return this.getReference(object);
      }

      // We shallow clone so we can capture the object without the parsing metadata.  We
      // may need to deep clone at some point.
      var shallowClone = (0, _lodash["default"])(object);

      var tempId = this.markParsed(object);

      var parsedObject = Array.isArray(shallowClone) ? [] : {};
      for (var _i = 0, _Object$entries = Object.entries(shallowClone); _i < _Object$entries.length; _i++) {var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),key = _Object$entries$_i[0],value = _Object$entries$_i[1];
        var parsedTarget = value;

        if (_typeof(value) === 'object') {
          // TODO can we find a way to make this dyanmic so we dont have to remember to add support for each new cjs object we add

          if (value instanceof _MovieClip["default"]) {
            parsedTarget = this.parseMovieClip(value);
          } else if (value instanceof _Shape["default"]) {
            parsedTarget = this.parseShape(value);
          } else if (value instanceof _Tween["default"]) {
            parsedTarget = this.parseTween(value);
          } else if (value instanceof _Tween["default"]) {
            // TODO throwing to be safe here - we have not tested tween support in native JS objects
            throw new Error('Do no support tween here');
          } else if (value.constructor === Object || Array.isArray(value)) {
            parsedTarget = this.parseNativeJsObject(value);
          } else {
            throw new Error('Unexpected value type');
          }
        }

        parsedObject[key] = parsedTarget;
      }

      var result = new _AnimateNode["default"](
      tempId,
      'native_object',
      parsedObject,
      {
        // This is redundant but allows finalizeId to create a unique ID because
        // it is currently based on the data contents and type only
        object: parsedObject });




      var originalId = result.finalizeId();
      this.updatedId(originalId, result);

      this.targetCache.parsed[result.id] = result;

      return result;
    } }]);return AnimateParser;}();exports["default"] = AnimateParser;