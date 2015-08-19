'use strict';

var assert = require('assert');

var Router = require('express').Router;

var utilities = require('../lib/utilities');

function doNothing() { }
function handle(req, res) { doNothing(req, res); }

describe('utilities', function () {
  describe('getUrlFromRegexp', function () {
    it('should clean /foo/blabla', function() {
      var router = new Router();
      router.get('/foo/blabla', handle);
      var regexp = router.stack[0].regexp;

      var cleaned = utilities.getUrlFromRegexp(regexp);

      assert.equal(cleaned, '/foo/blabla');
    });

    it('should clean /:id/method', function() {
      var router = new Router();
      router.get('/:id/method', handle);
      var regexp = router.stack[0].regexp;

      var cleaned = utilities.getUrlFromRegexp(regexp);

      assert.equal(cleaned, '/(?:([^/]+?))/method');
    });
  });

  describe('getUrlFromLayer', function () {
    it('should clean /:id/method', function() {
      var router = new Router();
      router.get('/:id/method', handle);

      var layer = router.stack[0];

      var cleaned = utilities.getUrlFromLayer(layer);

      assert.equal(cleaned, '/:id/method');
    });

    it('should clean /:id/method/:subid', function() {
      var router = new Router();
      router.get('/:id/method/:subid', handle);

      var layer = router.stack[0];

      var cleaned = utilities.getUrlFromLayer(layer);

      assert.equal(cleaned, '/:id/method/:subid');
    });
  });
});
