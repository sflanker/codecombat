"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = alignBoundsToCoco;function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * Reset the bounds of the top level animation to so that the game engine
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * properly understands the bounding box of the asset.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * This requires that all animations be exported from Adobe Animate with
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * the stage bounds equal to the width and height of the bounding box of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * the asset.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */
function alignBoundsToCoco(schema) {var _schema$properties =



  schema.properties,width = _schema$properties.width,height = _schema$properties.height;

  var entryPoint = [].concat(_toConsumableArray(schema.animations), _toConsumableArray(schema.containers)).
  find(function (a) {return a.id === schema.entryPointName;});

  if (!entryPoint) {
    throw new Error('No entryPoint found when aligning bounds');
  }var


  boundsNode =
  entryPoint.data.bounds;

  var resolvedBoundsNode = boundsNode.node;
  resolvedBoundsNode.data = [
  0, 0,
  width, height];


  return schema;
}