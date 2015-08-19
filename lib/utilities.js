'use strict';


function getUrlFromRegexp(k) {
  return k.toString().replace(/^\/\^/, '')
    .replace(/\?\(\?=\\\/\|\$\)\/\w?$/, '')
    .replace(/\?\$\/\w?$/, '')
    .replace(new RegExp('\\\\/', 'g'), '/')
    .replace(/\/$/, '');
}

function getUrlFromLayer(layer) {
  var url = getUrlFromRegexp(layer.regexp.toString());
  var i = 0;
  while(/\(\?:\(\[\^\/\]\+\?\)\)/.test(url)) {
    url = url.replace(/\(\?:\(\[\^\/\]\+\?\)\)/, ':' + layer.keys[i].name);
    i++;
  }
  return url;
}

module.exports = {
  getUrlFromRegexp: getUrlFromRegexp,
  getUrlFromLayer: getUrlFromLayer,
};
