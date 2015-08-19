'use strict';

var getFromRouter = require('./lib/structure');

function getAsStructure(router, base) {
  base = base || '';

  var structure = {};
  getFromRouter(router, base, structure);

  return structure;
}

module.exports = {
  getAsStructure: getAsStructure,
};
