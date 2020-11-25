"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = translateToCoco;var _alignBoundsToCoco = _interopRequireDefault(require("./alignBoundsToCoco"));
var _simplifyNoopMoiveClips = _interopRequireDefault(require("./simplifyNoopMoiveClips"));
var _treeToSchema = _interopRequireDefault(require("./treeToSchema"));
var _convertAnimationShapesToContainers = _interopRequireDefault(require("./convertAnimationShapesToContainers"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}

function translateToCoco(schema) {
  var simplifiedClipsSchema = (0, _simplifyNoopMoiveClips["default"])(schema);
  var shapesToContainerSchema = (0, _convertAnimationShapesToContainers["default"])(simplifiedClipsSchema);
  var alignedBounds = (0, _alignBoundsToCoco["default"])(shapesToContainerSchema);

  return (0, _treeToSchema["default"])(alignedBounds);
}