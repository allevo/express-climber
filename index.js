'use strict';

var getFromRouter = require('./lib/structure');
var getArrayFromStructure = require('./lib/array');

function getAsStructure(router, base) {
  var structure = {};
  getFromRouter(router, base || '', structure);
  return structure;
}

function getAsArray(router, base) {
  var structure = getAsStructure(router, base || '');
  return getArrayFromStructure(structure);
}

module.exports = {
  getAsStructure: getAsStructure,
  getAsArray: getAsArray,
};
