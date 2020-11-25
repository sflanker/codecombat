"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = convertAnimationShapesToContainers;var _AnimateNode = _interopRequireDefault(require("../parse/AnimateNode"));
var _AnimateNodeReference = _interopRequireDefault(require("../parse/AnimateNodeReference"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}

/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * Create a container including the shape using the specified bounds.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * The bounds currently need to be the bounds of the shape's parent.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * This ensures that any transforms are properly contained in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * bounding box.  These bounds are critical for the generation of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * segmented sprites.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * TODO there is likely a way to minimize the bounding box with container transforms or shape transforms
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              */
function createContainerFromShape(shape, bounds) {
  var resolvedShape = shape.node;

  var containerNode = new _AnimateNode["default"](
  'TEMP', // Will be finalized on next line
  'container',
  undefined,
  {
    children: [resolvedShape],
    bounds: bounds,
    frameBounds: resolvedShape.data.frameBounds });



  containerNode.finalizeId();

  return containerNode;
}

function convertShapesToContainersInNativeObject(schema, bounds, nativeObject) {
  var resolvedNativeObject = nativeObject.node;
  var nativeObjectData = resolvedNativeObject.data.object;

  for (var _i = 0, _Object$entries = Object.entries(nativeObjectData); _i < _Object$entries.length; _i++) {var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),key = _Object$entries$_i[0],value = _Object$entries$_i[1];
    if (Array.isArray(value)) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
        for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var v = _step.value;
          convertShapesToContainersInNativeObject(schema, bounds, v);
        }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
    } else if (value instanceof _AnimateNode["default"]) {
      var resolvedValue = value.node;
      if (resolvedValue.type === 'shape') {
        var container = createContainerFromShape(resolvedValue, bounds);

        schema.containers.push(container);

        var containerRef = new _AnimateNodeReference["default"](
        'TEMP', // ID will be finalized on the next line,
        container.id,
        { parsed: _defineProperty({}, container.id, container) // Simulate target cache
        });

        schema.references.push(containerRef);
        nativeObjectData[key] = containerRef;
      } else if (resolvedValue.type === 'native_object') {
        convertShapesToContainersInNativeObject(schema, bounds, resolvedValue);
      }
    }
  }
}

function convertAnimationShapesToContainers(schema) {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
    for (var _iterator2 = schema.animations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var animation = _step2.value;
      var resolvedAnimation = animation.node;var _resolvedAnimation$da =




      resolvedAnimation.data,tweens = _resolvedAnimation$da.tweens,bounds = _resolvedAnimation$da.bounds;

      // In order to preserve layering we need to loop through the tweens in reverse order.
      //
      // Note that this only works for the very specific format that we support right now (tweens
      // created on empty objects that use `.to({ state: [] })` calls with no delay.  This results in
      // the last tween added to the timeline being executed first, resulting in those layers being
      // added to the bottom of the stack.  If we support more complex additions with timing at
      // a later point we'll need a more robust solution.
      for (var i = tweens.length - 1; i >= 0; i--) {
        var tween = tweens[i];

        var resolvedTween = tween.node;
        var resolvedTarget = resolvedTween.data.target.node;

        if (resolvedTarget.type === 'shape') {
          var container = createContainerFromShape(resolvedTarget, bounds);

          schema.containers.push(container);

          var containerRef = new _AnimateNodeReference["default"](
          'TEMP', // ID will be finalized on the next line,
          container.id,
          { parsed: _defineProperty({}, container.id, container) // Simulate target cache
          });

          resolvedTween.data.target = containerRef;
          schema.references.push(containerRef);
        } else if (resolvedTarget.type === 'native_object') {
          convertShapesToContainersInNativeObject(schema, bounds, resolvedTarget);
        }

        convertShapesToContainersInNativeObject(schema, bounds, resolvedTween.data.tweenCalls);
      }
    }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {_iterator2["return"]();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}

  return schema;
}