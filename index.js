'use strict';


function getUrlFromRegexp(k) {
  return k.replace(/^\/\^/, '')
    .replace(/\?\(\?=\\\/\|\$\)\/\w?$/, '')
    .replace(/\?\$\/\w?$/, '')
    .replace(new RegExp('\\\\/', 'g'), '/')
    .replace(/\/$/, '');
}

function getFromRouter(router, base, structure) {
  if (router.name !== 'router') {
    console.log(router);
    throw new Error('unkown router type');
  }

  router.stack.forEach(function(el) {
    if (el.constructor.name !== 'Layer') {
      console.log(el);
      throw new Error('unkown layer type');
    }
    var url = base + getUrlFromRegexp(el.regexp.toString());

    // sub router
    if (el.handle.name === 'router') {
      return getFromRouter(el.handle, url, structure);
    }

    // should be a middleware attached to router directly
    if (!el.route) {
      url = url || '/';
      ['get', 'post', 'put', 'delete'].forEach(function(method) {
        structure[url] = structure[url] || {};
        structure[url][method] = structure[url][method] || {};
        structure[url][method].middlewares = structure[url][method].middlewares || [];
        structure[url][method].middlewares.push(el.handle.name);
      });
      return;
    }

    structure[url] = structure[url] || {};
    for (var method in el.route.methods) {
      if (!el.route.methods[method]) { continue; }

      structure[url][method] = structure[url][method] || {};

      structure[url][method].middlewares = el.route.stack.map(function(i) {
        return i.name;
      });
      structure[url][method].name = structure[url][method].middlewares.pop();
    }
  });
}

function getAsStructure(router, base) {
  base = base || '';

  var structure = {};
  getFromRouter(router, base, structure);

  return structure;
}

module.exports = {
  getAsStructure: getAsStructure,
};
