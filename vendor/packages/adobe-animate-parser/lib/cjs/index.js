"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports["default"] = void 0;var _lodash = _interopRequireDefault(require("lodash.create"));

var _CocoSchema = _interopRequireDefault(require("./CocoSchema"));

var _Shape = _interopRequireDefault(require("./Shape"));
var _Rectangle = _interopRequireDefault(require("./Rectangle"));
var _MovieClip = _interopRequireDefault(require("./MovieClip"));
var _Stage = _interopRequireDefault(require("./Stage"));
var _Tween = _interopRequireDefault(require("./Tween"));
var _Shadow = _interopRequireDefault(require("./Shadow"));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}

// function extend (subclass, superclass) {
// 	"use strict";
//
// 	function o() { this.constructor = subclass; }
// 	o.prototype = superclass.prototype;
// 	return (subclass.prototype = new o());
// }


function extend(subclass, superclass) {
  function ExtendedClass() {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
    superclass.call.apply(superclass, [this].concat(args));
  }

  ExtendedClass.prototype = (0, _lodash["default"])(superclass.prototype, {
    constructor: ExtendedClass });


  return new ExtendedClass();
}var _default =

{
  extend: extend,

  Shape: _Shape["default"],
  Rectangle: _Rectangle["default"],
  MovieClip: _MovieClip["default"],
  Stage: _Stage["default"],
  Tween: _Tween["default"],

  Shadow: _Shadow["default"] };exports["default"] = _default;