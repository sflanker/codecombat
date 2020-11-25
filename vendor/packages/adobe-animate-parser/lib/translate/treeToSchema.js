"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = _default;var _AnimateNode = _interopRequireDefault(require("../parse/AnimateNode"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};var ownKeys = Object.keys(source);if (typeof Object.getOwnPropertySymbols === 'function') {ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {return Object.getOwnPropertyDescriptor(source, sym).enumerable;}));}ownKeys.forEach(function (key) {_defineProperty(target, key, source[key]);});}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}

var blockNameCounter = {};

function getBlockNameVar(targetId) {
  blockNameCounter[targetId] = blockNameCounter[targetId] || 0;

  return "bn_".concat(targetId, "_").concat(blockNameCounter[targetId]++);
}

function generateMovieClipBlockReference(movieClip) {
  var blockName = getBlockNameVar(movieClip.id);

  return {
    bn: blockName,
    gn: movieClip.id,
    a: movieClip.data.constructorArgs,
    t: movieClip.data.transform };

}

function generateShapeBlockReference(shape) {
  var blockName = getBlockNameVar(shape.id);

  return {
    bn: blockName,
    gn: shape.id };

}

function generateContainerBlockReference(container) {
  var blockName = getBlockNameVar(container.id);

  return {
    bn: blockName,
    gn: container.id,
    t: container.data.transform,
    o: container.data.off === true };

}

function translateBounds(boundsData) {
  if (Array.isArray(boundsData)) {
    return boundsData.map(function (bounds) {return translateBounds(bounds);});
  }

  if (boundsData instanceof _AnimateNode["default"]) {
    var resolvedBoundsData = boundsData.node;

    return resolvedBoundsData.data;
  }

  return boundsData;
}

function dereferenceNativeObject(nativeObject) {var movieClipRefs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];var shapeRefs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var containerRefs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var resolvedNativeObject = nativeObject.node;

  var outputObject = Array.isArray(resolvedNativeObject.data.object) ? [] : {};

  for (var _i = 0, _Object$entries = Object.entries(resolvedNativeObject.data.object); _i < _Object$entries.length; _i++) {var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),key = _Object$entries$_i[0],value = _Object$entries$_i[1];
    var dereferencedValue = value;

    if (value instanceof _AnimateNode["default"]) {
      var resolvedValue = value.node;

      // If this is an object we have a complex type that we need to unwind
      if (resolvedValue.type === 'movie_clip') {
        var movieClipRef = generateMovieClipBlockReference(movieClipRefs);
        movieClipRefs.push(movieClipRef);

        // Replace with the ID, it will be properly handled when rebuilt
        dereferencedValue = movieClipRef.bn;
      } else if (resolvedValue.type === 'container') {
        var containerRef = generateContainerBlockReference(resolvedValue);
        containerRefs.push(containerRef);

        // Replace with the ID, it will be properly handled when rebuilt
        dereferencedValue = containerRef.bn;
      } else if (resolvedValue.type === 'shape') {
        var shapeRef = generateShapeBlockReference(resolvedValue);
        shapeRefs.push(shapeRef);

        // Replace with the ID, it will be properly handled when rebuilt
        dereferencedValue = shapeRef.bn;
      } else if (value.type === 'native_object') {
        dereferencedValue = dereferenceNativeObject(resolvedValue, movieClipRefs, shapeRefs, containerRefs);
      } else {
        throw new Error('Invalid target type');
      }
    }

    outputObject[key] = dereferencedValue;
  }

  return outputObject;
}

function _default(schema) {
  var finalShapes = {};var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = schema.shapes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var shape = _step.value;
      var resolvedShape = shape.node;

      var translatedShape = _objectSpread({},
      resolvedShape.data.graphics || {});


      if (resolvedShape.data.transform) {
        translatedShape.t = resolvedShape.data.transform;
      }

      if (resolvedShape.data.bounds) {
        translatedShape.bounds = translateBounds(resolvedShape.data.bounds);
      }

      if (resolvedShape.data.frameBounds) {
        translatedShape.frameBounds = translateBounds(resolvedShape.data.frameBounds);
      }

      finalShapes[resolvedShape.id] = translatedShape;
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}

  var finalContainers = {};var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
    for (var _iterator2 = schema.containers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var container = _step2.value;
      var resolvedContainer = container.node;

      var children = [];var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {

        for (var _iterator4 = resolvedContainer.data.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var child = _step4.value;
          var resolvedChild = child.node;

          var childEntry = void 0;
          if (resolvedChild.type === 'shape') {
            childEntry = resolvedChild.id;
          } else if (resolvedChild.type === 'container') {
            childEntry = {
              gn: resolvedChild.id };


            if (resolvedChild.data.transform) {
              childEntry.t = resolvedChild.data.transform;
            }
          } else {
            throw new Error('Containers only support shapes and child containers');
          }

          children.push(childEntry);
        }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {_iterator4["return"]();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}

      var translatedContainer = {
        c: children };


      if (resolvedContainer.data.bounds) {
        var resolvedBounds = resolvedContainer.data.bounds.node;
        translatedContainer.b = resolvedBounds.data;
      }

      finalContainers[resolvedContainer.id] = translatedContainer;
    }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {_iterator2["return"]();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}

  var finalAnimations = {};var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {
    for (var _iterator3 = schema.animations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var animation = _step3.value;
      var resolvedAnimation = animation.node;

      var containers = [];
      var shapes = [];
      var animations = [];
      var tweens = [];var _iteratorNormalCompletion5 = true;var _didIteratorError5 = false;var _iteratorError5 = undefined;try {

        for (var _iterator5 = resolvedAnimation.data.tweens[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {var tween = _step5.value;
          var finalTween = [];

          var resolvedTween = tween.node;
          var resolvedTarget = resolvedTween.data.target.node;

          switch (resolvedTarget.type) {
            case 'movie_clip':
              var movieClipRef = generateMovieClipBlockReference(resolvedTarget);
              animations.push(movieClipRef);

              finalTween.push({
                n: 'get',
                a: [movieClipRef.bn] });


              break;

            case 'container':
              var containerRef = generateContainerBlockReference(resolvedTarget);
              containers.push(containerRef);

              finalTween.push({
                n: 'get',
                a: [containerRef.bn] });


              break;

            case 'shape':
              var shapeRef = generateShapeBlockReference(resolvedTarget);

              shapes.push(shapeRef);

              finalTween.push({
                n: 'get',
                a: [shapeRef.bn] });


              break;

            case 'native_object':
              finalTween.push({
                n: 'get',
                a: [resolvedTarget.data.object] });


              break;

            default:
              throw new Error('Invalid target type');}



          var dereferencedTweenCalls = dereferenceNativeObject(
          resolvedTween.data.tweenCalls, animations, shapes, containers);var _iteratorNormalCompletion6 = true;var _didIteratorError6 = false;var _iteratorError6 = undefined;try {


            for (var _iterator6 = dereferencedTweenCalls[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {var methodCall = _step6.value;
              finalTween.push({
                n: methodCall.name,
                a: methodCall.args });

            }} catch (err) {_didIteratorError6 = true;_iteratorError6 = err;} finally {try {if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {_iterator6["return"]();}} finally {if (_didIteratorError6) {throw _iteratorError6;}}}

          tweens.push(finalTween);
        }} catch (err) {_didIteratorError5 = true;_iteratorError5 = err;} finally {try {if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {_iterator5["return"]();}} finally {if (_didIteratorError5) {throw _iteratorError5;}}}

      var translatedAnimation = {
        animations: animations,
        shapes: shapes,
        tweens: tweens,
        containers: containers,
        graphics: [],
        bounds: resolvedAnimation.bounds,
        frameBounds: resolvedAnimation.frameBounds };


      if (resolvedAnimation.data.bounds) {
        translatedAnimation.bounds = translateBounds(resolvedAnimation.data.bounds);
      }

      if (resolvedAnimation.data.frameBounds) {
        translatedAnimation.frameBounds = translateBounds(resolvedAnimation.data.frameBounds);
      }

      finalAnimations[resolvedAnimation.id] = translatedAnimation;
    }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {_iterator3["return"]();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}

  var result = {
    shapes: finalShapes,
    animations: finalAnimations,
    containers: finalContainers


    // TODO fix code to not insert undefineds
    // Remove undefineds
  };return JSON.parse(JSON.stringify(result));
}