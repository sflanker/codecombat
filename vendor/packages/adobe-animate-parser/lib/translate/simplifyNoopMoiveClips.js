"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.replaceMovieClipReferenceWithContainerReference = replaceMovieClipReferenceWithContainerReference;exports.simplifyMovieClipPass = simplifyMovieClipPass;exports["default"] = simplyNoopMovieClips;











var _AnimateNode = _interopRequireDefault(require("../parse/AnimateNode"));
var _AnimateNodeReference = _interopRequireDefault(require("../parse/AnimateNodeReference"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}

function replaceMovieClipReferenceWithContainerInNativeObject(schema, nativeObject, movieClip, container) {
  var resolvedMovieClip = movieClip.node;
  var resolvedNativeObject = nativeObject.node;

  var nativeObjectData = resolvedNativeObject.data.object;

  for (var _i = 0, _Object$entries = Object.entries(nativeObjectData); _i < _Object$entries.length; _i++) {var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),key = _Object$entries$_i[0],value = _Object$entries$_i[1];
    if (value instanceof _AnimateNode["default"]) {
      var resolvedValue = value.node;

      // If this is an object we have a complex type that we need to unwind
      if (resolvedValue.type === 'movie_clip') {
        if (resolvedValue.id === resolvedMovieClip.id) {
          // TODO consolidate this with the code below
          var nodeReference = new _AnimateNodeReference["default"](
          resolvedValue.id, // ID will be finalized on the next line,
          container.id,
          { parsed: _defineProperty({}, container.id, container) // Simulate target cache
          });

          nodeReference.finalizeId();
          schema.references.push(nodeReference);

          nativeObjectData[key] = nodeReference;
        }
      } else if (resolvedValue.type === 'container') {
        // noop
      } else if (resolvedValue.type === 'shape') {
        // noop
      } else if (resolvedValue.type === 'native_object') {
        replaceMovieClipReferenceWithContainerInNativeObject(schema, value, movieClip, container);
      } else {
        throw new Error('Invalid target type');
      }
    } else if (Array.isArray(value)) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
        for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var v = _step.value;
          replaceMovieClipReferenceWithContainerInNativeObject(schema, value, movieClip, container);
        }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator["return"] != null) {_iterator["return"]();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
    }
  }
}

function replaceMovieClipReferenceWithContainerReference(schema, movieClip, container) {
  var resolvedMovieClip = movieClip.node;var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

    for (var _iterator2 = schema.animations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var animation = _step2.value;
      var resolvedAnimation = animation.node;var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {

        for (var _iterator3 = resolvedAnimation.data.tweens[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var tween = _step3.value;
          var resolvedTween = tween.node;
          var resolvedTarget = resolvedTween.data.target.node;

          if (resolvedTarget.type === 'movie_clip') {
            if (resolvedTarget.id === resolvedMovieClip.id) {
              var nodeReference = new _AnimateNodeReference["default"](
              'TEMP', // ID will be finalized on the next line,
              container.id,
              { parsed: _defineProperty({}, container.id, container) // Simulate target cache
              });

              nodeReference.finalizeId();
              schema.references.push(nodeReference);

              resolvedTween.data.target = nodeReference;
            }
          } else if (resolvedTarget.type === 'native_object') {
            replaceMovieClipReferenceWithContainerInNativeObject(schema, resolvedTarget, movieClip, container);
          }

          replaceMovieClipReferenceWithContainerInNativeObject(schema, resolvedTween.data.tweenCalls, movieClip, container);
        }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {_iterator3["return"]();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}
    }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {_iterator2["return"]();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
}

function simplifyMovieClipPass(schema) {
  schema.containers = schema.containers || [];

  var keptAnimations = [];
  var replacedMovieClipMappings = new Map();var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {

    for (var _iterator4 = schema.animations[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var animation = _step4.value;
      var resolvedAnimation = animation.node;

      var containerShapes = [];
      var isNoopClip = true;
      var tweens = resolvedAnimation.data.tweens;

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

        if (resolvedTarget.type === 'movie_clip') {
          // Movie clip not currently supported.  If the movie clip is itself made up of noop movie clips
          // this could also be translated.
          isNoopClip = false;
          break;
        } else if (resolvedTarget.type === 'shape') {
          // Only supported if the shape has a single call to wait (or no tween calls at all)
          containerShapes.push(resolvedTarget);

          var shapeTweenCalls = resolvedTween.data.tweenCalls;
          var resolvedShapeTweenCalls = shapeTweenCalls.node;

          var shapeTweenCallData = resolvedShapeTweenCalls.data.object;
          if (!Array.isArray(shapeTweenCallData) && shapeTweenCallData.length <= 1) {
            isNoopClip = false;
            break;
          }

          var shapeTweenCall = shapeTweenCallData[0];
          var resolvedShapeTweenCall = shapeTweenCall.node;
          var shapeTweenCallObject = resolvedShapeTweenCall.data.object;

          if (shapeTweenCallObject.name !== 'wait') {
            isNoopClip = false;
            break;
          }
        } else if (resolvedTarget.type === 'native_object' || resolvedTarget.type === 'container') {
          if (resolvedTarget.type === 'container') {
            containerShapes.push(resolvedTarget);
          }

          // Only supported if it does not contain references to non shape object within its system and
          // the tween calls do not perform movements.  For now we'll use a whitelisted approach to identifying.
          var tweenCalls = resolvedTween.data.tweenCalls;
          var resolvedTweenCalls = tweenCalls.node;

          var tweenCallData = resolvedTweenCalls.data.object;
          if (!Array.isArray(tweenCallData)) {
            throw new Error('Expected array of tween calls');
          }var _iteratorNormalCompletion6 = true;var _didIteratorError6 = false;var _iteratorError6 = undefined;try {

            for (var _iterator6 = tweenCallData[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {var tweenCall = _step6.value;
              var resolvedTweenCall = tweenCall.node;
              var callData = resolvedTweenCall.data.object;var

              name = callData.name;

              if (name === 'wait') {
                // Wait is allowed and supported but we do not need to process.
                continue;
              } else if (name === 'to') {
                // "to" is supported.  For now we only support a "to" call with arguments in the form:
                // { state: [ { t: SHAPE_REF }, { t: SHAPE_REF } ].
                //
                // There are likely other possible formats that we can support, this may need to be extended
                // in the future.

                var resolvedArgs = callData.args.node;
                var argsData = resolvedArgs.data.object;

                if (!Array.isArray(argsData)) {
                  throw new Error('Args should be an array');
                }

                if (argsData.length === 0) {
                  // Args data for "to" is empty.  We don't need to process further
                  continue;
                }

                if (argsData.length > 1) {
                  // If there is more than one arg than the call to "to" contains a delay.  These can be chained
                  // to implement a fast switch between containers.  Consider this a motion tween for now.
                  //
                  // TODO may be worth parsing the top level animation differently - maybe never remove it?
                  isNoopClip = false;
                  break;
                }

                var resolvedArgsData = argsData[0].node;

                var args = resolvedArgsData.data.object;
                var argsKeys = Object.keys(args);

                if (argsKeys.length !== 1 || argsKeys[0] !== 'state') {
                  // For now we only support a top level key with state
                  isNoopClip = false;
                  break;
                }var

                state = args.state;
                var resolvedState = state.node;
                var resolvedStateData = resolvedState.data.object;

                if (!Array.isArray(resolvedStateData)) {
                  // If state is not an array we don't support this format as a noop movie clip.  It might be one
                  // but we do not yet explicitly support it
                  isNoopClip = false;
                  break;
                }var _iteratorNormalCompletion7 = true;var _didIteratorError7 = false;var _iteratorError7 = undefined;try {

                  for (var _iterator7 = resolvedStateData[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {var stateObject = _step7.value;
                    var resolvedStateObject = stateObject.node;
                    var stateObjectData = resolvedStateObject.data.object;
                    var stateObjectDataKeys = Object.keys(stateObjectData);

                    if (stateObjectDataKeys.length !== 1 || stateObjectDataKeys[0] !== 't') {
                      // We only support nodes of the format { t: SHAPE_REF } at this level now so we only support
                      // a single key "t"
                      isNoopClip = false;
                      break;
                    }

                    var tNode = stateObjectData.t;
                    var resolvedTNode = tNode.node;

                    if (resolvedTNode.type !== 'shape' && resolvedTNode.type !== 'container') {
                      isNoopClip = false;
                      break;
                    }

                    containerShapes.push(resolvedTNode);
                  }} catch (err) {_didIteratorError7 = true;_iteratorError7 = err;} finally {try {if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {_iterator7["return"]();}} finally {if (_didIteratorError7) {throw _iteratorError7;}}}
              }
            }} catch (err) {_didIteratorError6 = true;_iteratorError6 = err;} finally {try {if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {_iterator6["return"]();}} finally {if (_didIteratorError6) {throw _iteratorError6;}}}
        } else {
          throw new Error('Invalid target type');
        }
      }

      if (!isNoopClip) {
        keptAnimations.push(animation);
        continue;
      }

      // Adobe animate adds shapes starting with the bottom layer but we need to add them
      // in forward order for containers
      // containerShapes.reverse()

      // Create the container node and save it to the schema
      var containerNode = new _AnimateNode["default"](
      resolvedAnimation.id,
      'container',
      undefined,
      {
        children: containerShapes,
        bounds: resolvedAnimation.data.bounds,
        frameBounds: resolvedAnimation.data.frameBounds,
        transform: resolvedAnimation.data.transform,
        off: resolvedAnimation.data.off });



      if (schema.entryPointName !== containerNode.id) {
        // We don't want to hash the root if it's a container.
        containerNode.finalizeId();
      }

      schema.containers.push(containerNode);
      replacedMovieClipMappings.set(animation, containerNode);
    }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {_iterator4["return"]();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}

  schema.animations = keptAnimations;var _iteratorNormalCompletion5 = true;var _didIteratorError5 = false;var _iteratorError5 = undefined;try {

    for (var _iterator5 = replacedMovieClipMappings[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {var _step5$value = _slicedToArray(_step5.value, 2),movieClip = _step5$value[0],container = _step5$value[1];
      replaceMovieClipReferenceWithContainerReference(schema, movieClip, container);
    }

    // Note this method modifies the input schema and then returns it
    // TODO it should return a copy
  } catch (err) {_didIteratorError5 = true;_iteratorError5 = err;} finally {try {if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {_iterator5["return"]();}} finally {if (_didIteratorError5) {throw _iteratorError5;}}}return schema;
}

function simplyNoopMovieClips(schema) {
  var lastNumAnimations;
  var numAnimations = schema.animations.length;

  while (numAnimations !== lastNumAnimations) {
    lastNumAnimations = numAnimations;

    schema = simplifyMovieClipPass(schema);

    numAnimations = schema.animations.length;
  }

  return schema;
}