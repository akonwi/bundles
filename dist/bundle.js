"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
var Bundle = {
  name: undefined,
  links: [],
  open: false
};

function create(attrs) {
  if (attrs.name === undefined) throw new Error("Cannot create a bundle without a name.");
  return Object.assign(Bundle, attrs);
}
//# sourceMappingURL=bundle.js.map
