'use strict';

module.exports = function(structure) {
  var urls = { };
  var url, method;
  for (url in structure) {
    for (method in structure[url]) {
      if (!structure[url][method].handle) { continue; }

      urls[url] = urls[url] || {};
      urls[url][method] = {
        handle: structure[url][method].handle,
        middlewares: structure[url][method].middlewares.slice(),
      };
      for (var otherUrl in structure) {
        if (otherUrl === url) { continue; }
        if (url.indexOf(otherUrl) !== 0) { continue; }
        /* istanbul ignore if */
        if (!structure[otherUrl][method]) { continue; }

        urls[url][method].middlewares = structure[otherUrl][method].middlewares.concat(urls[url][method].middlewares);
      }
    }
  }

  var arrUrl = [];
  for(url in urls) {
    for (method in urls[url]) {
      arrUrl.push({
        handle: urls[url][method].handle,
        url: url,
        method: method,
        middlewares: urls[url][method].middlewares,
      });
    }
  }
  return arrUrl;
};
