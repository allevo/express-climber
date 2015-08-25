'use strict';

module.exports = function(structure) {
  var urls = { };
  var url, method;
  for (url in structure) {
    for (method in structure[url]) {
      if (!structure[url][method].name) { continue; }

      urls[url] = urls[url] || {};
      urls[url][method] = {
        name: structure[url][method].name,
        middlewares: structure[url][method].middlewares.slice(),
      };
      for (var otherUrl in structure) {
        if (otherUrl === url) { continue; }
        if (url.indexOf(otherUrl) !== 0) { continue; }
        if (!structure[otherUrl][method]) { continue; }

        urls[url][method].middlewares = urls[url][method].middlewares.concat(structure[otherUrl][method].middlewares);
      }
    }
  }

  var arrUrl = [];
  for(url in urls) {
    for (method in urls[url]) {
      arrUrl.push({
        name: urls[url][method].name,
        url: url,
        method: method,
        middlewares: urls[url][method].middlewares,
      });
    }
  }
  return arrUrl;
};
