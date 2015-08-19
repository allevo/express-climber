'use strict';

var getUrlFromRegexp = require('./utilities').getUrlFromRegexp;

module.exports = function getFromRouter(router, base, structure) {
  // should be an express app
  if (router._router) {
    router = router._router;
  }
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
        if (!el.handle.hideInClimber) {
          structure[url][method].middlewares.push({
            name: el.name,
            description: el.handle.description,
            long_description: el.handle.long_description,
          });
        }
      });
      return;
    }

    structure[url] = structure[url] || {};
    for (var method in el.route.methods) {
      if (!el.route.methods[method]) { continue; }

      structure[url][method] = structure[url][method] || {};

      structure[url][method].middlewares = el.route.stack
        .filter(function(i) { return !i.handle.hideInClimber; })
        .map(function(i) { return {
            name: i.name,
            description: i.handle.description,
            long_description: i.handle.long_description,
          };
        });
      structure[url][method].name = structure[url][method].middlewares.pop();
    }
  });
};
