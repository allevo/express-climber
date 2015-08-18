'use strict';

var assert = require('assert');
var express = require('express');
var Router = express.Router;

var climber = require('..');

function doNothing() { }

function middleware1(req, res, next) { doNothing(req, res, next); }
function middleware2(req, res, next) { doNothing(req, res, next); }
function middleware3(req, res, next) { doNothing(req, res, next); }

describe('router', function () {
  it('simple', function() {
    var router = new Router();
    router.get('/foo', function getFooHandle(req, res) { doNothing(req, res); });
    router.post('/foo', function postFooHandle(req, res) { doNothing(req, res); });
    router.delete('/bar', function deleteBarHandle(req, res) { doNothing(req, res); });

    var structure = climber.getAsStructure(router);
    var expected = {
      '/foo': {
        get: { name: 'getFooHandle', middlewares: [] },
        post: { name: 'postFooHandle', middlewares: [] },
      },
      '/bar': {
        delete: { name: 'deleteBarHandle', middlewares: [] },
      },
    };
    assert.deepEqual(expected, structure);
  });

  it('with middleware', function() {
    var router = new Router();
    router.get('/foo', middleware1, middleware2, function getFooHandle(req, res) { doNothing(req, res); });
    router.post('/foo', middleware3, middleware1, function postFooHandle(req, res) { doNothing(req, res); });

    var structure = climber.getAsStructure(router);
    var expected = {
      '/foo': {
        get: { name: 'getFooHandle', middlewares: ['middleware1', 'middleware2'] },
        post: { name: 'postFooHandle', middlewares: ['middleware3', 'middleware1'] },
      },
    };
    assert.deepEqual(expected, structure);
  });

  it('with router middleware', function() {
    var router = new Router();
    router.use(middleware1);
    router.get('/foo', middleware2, function getFooHandle(req, res) { doNothing(req, res); });
    router.post('/foo', middleware3, function postFooHandle(req, res) { doNothing(req, res); });

    var structure = climber.getAsStructure(router);
    var expected = {
      '/': {
        get: { middlewares: ['middleware1'] },
        post: { middlewares: ['middleware1'] },
        put: { middlewares: ['middleware1'] },
        delete: { middlewares: ['middleware1'] },
      },
      '/foo': {
        get: { name: 'getFooHandle', middlewares: ['middleware2'] },
        post: { name: 'postFooHandle', middlewares: ['middleware3'] },
      },
    };
    assert.deepEqual(expected, structure);
  });

  it('with subrouter', function() {
    var router = new Router();
    var childRouter = new Router();

    childRouter.get('/foo', middleware1, middleware2, function getFooHandle(req, res) { doNothing(req, res); });
    childRouter.post('/foo', middleware3, middleware1, function postFooHandle(req, res) { doNothing(req, res); });

    router.use(childRouter);

    var structure = climber.getAsStructure(router);
    var expected = {
      '/foo': {
        get: {
          middlewares: [
            'middleware1',
            'middleware2'
          ],
          name: 'getFooHandle'
        },
        post: {
          middlewares: [
            'middleware3',
            'middleware1'
          ],
          name: 'postFooHandle'
        }
      }
    };
    assert.deepEqual(expected, structure);
  });

  it('with subrouter and middleware', function() {
    var router = new Router();
    var childRouter = new Router();

    childRouter.get('/foo', middleware2, function getFooHandle(req, res) { doNothing(req, res); });
    childRouter.post('/foo', middleware3, function postFooHandle(req, res) { doNothing(req, res); });

    router.use(middleware1, childRouter);

    var structure = climber.getAsStructure(router);
    var expected = {
      '/': {
        delete: {
          middlewares: [
            'middleware1'
          ]
        },
        get: {
          middlewares: [
            'middleware1'
          ]
        },
        post: {
          middlewares: [
            'middleware1'
          ]
        },
        put: {
          middlewares: [
            'middleware1'
          ]
        }
      },
      '/foo': {
        get: {
          middlewares: [
            'middleware2'
          ],
          name: 'getFooHandle'
        },
        post: {
          middlewares: [
            'middleware3'
          ],
          name: 'postFooHandle'
        }
      }
    };
    assert.deepEqual(expected, structure);
  });

  it('with a middlewared subrouter', function() {
    var router = new Router();
    var childRouter = new Router();

    childRouter.use(middleware1);
    childRouter.get('/foo', middleware2, function getFooHandle(req, res) { doNothing(req, res); });
    childRouter.post('/foo', middleware3, function postFooHandle(req, res) { doNothing(req, res); });

    router.use(childRouter);

    var structure = climber.getAsStructure(router);
    var expected = {
      '/': {
        delete: {
          middlewares: [
            'middleware1'
          ]
        },
        get: {
          middlewares: [
            'middleware1'
          ]
        },
        post: {
          middlewares: [
            'middleware1'
          ]
        },
        put: {
          middlewares: [
            'middleware1'
          ]
        }
      },
      '/foo': {
        get: {
          middlewares: [
            'middleware2'
          ],
          name: 'getFooHandle'
        },
        post: {
          middlewares: [
            'middleware3'
          ],
          name: 'postFooHandle'
        }
      }
    };
    assert.deepEqual(expected, structure);
  });
});