'use strict';

var assert = require('assert');
var express = require('express');
var Router = express.Router;

var climber = require('..');

function doNothing() { }

function middleware1(req, res, next) { doNothing(req, res, next); }
function middleware2(req, res, next) { doNothing(req, res, next); }
function middleware3(req, res, next) { doNothing(req, res, next); }

function getFooHandle(req, res) { doNothing(req, res); }
function postFooHandle(req, res) { doNothing(req, res); }
function deleteBarHandle(req, res) { doNothing(req, res); }

var postFooData = {
  description: undefined,
  long_description: undefined,
  name: 'postFooHandle',
};
var getFooData = {
  description: undefined,
  long_description: undefined,
  name: 'getFooHandle',
};
var deleteBarData = {
  description: undefined,
  long_description: undefined,
  name: 'deleteBarHandle',
};
var middleware1Data = {
  description: undefined,
  long_description: undefined,
  name: 'middleware1',
};
var middleware2Data = {
  description: undefined,
  long_description: undefined,
  name: 'middleware2',
};
var middleware3Data = {
  description: undefined,
  long_description: undefined,
  name: 'middleware3',
};
var queryData = {
  description: undefined,
  long_description: undefined,
  name: 'query',
};
var expressInitData = {
  description: undefined,
  long_description: undefined,
  name: 'expressInit',
};

describe('structure', function () {
  describe('router', function () {
    it('simple', function() {
      var router = new Router();
      router.get('/foo', getFooHandle);
      router.post('/foo', postFooHandle);
      router.delete('/bar', deleteBarHandle);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/foo': {
          get: { name: getFooData, middlewares: [] },
          post: { name: postFooData, middlewares: [] },
        },
        '/bar': {
          delete: { name: deleteBarData, middlewares: [] },
        },
      };
      assert.deepEqual(structure, expected);
    });

    it('with middleware', function() {
      var router = new Router();
      router.get('/foo', middleware1, middleware2, getFooHandle);
      router.post('/foo', middleware3, middleware1, postFooHandle);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/foo': {
          get: { name: getFooData, middlewares: [middleware1Data, middleware2Data] },
          post: { name: postFooData, middlewares: [middleware3Data, middleware1Data] },
        },
      };
      assert.deepEqual(structure, expected);
    });

    it('with router middleware', function() {
      var router = new Router();
      router.use(middleware1);
      router.get('/foo', middleware2, getFooHandle);
      router.post('/foo', middleware3, postFooHandle);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/': {
          get: { middlewares: [middleware1Data] },
          post: { middlewares: [middleware1Data] },
          put: { middlewares: [middleware1Data] },
          delete: { middlewares: [middleware1Data] },
        },
        '/foo': {
          get: { name: getFooData, middlewares: [middleware2Data] },
          post: { name: postFooData, middlewares: [middleware3Data] },
        },
      };
      assert.deepEqual(expected, structure);
    });

    it('with subrouter', function() {
      var router = new Router();
      var childRouter = new Router();

      childRouter.get('/foo', middleware1, middleware2, getFooHandle);
      childRouter.post('/foo', middleware3, middleware1, postFooHandle);

      router.use(childRouter);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/foo': {
          get: {
            middlewares: [
              middleware1Data,
              middleware2Data
            ],
            name: getFooData
          },
          post: {
            middlewares: [
              middleware3Data,
              middleware1Data
            ],
            name: postFooData
          }
        }
      };
      assert.deepEqual(expected, structure);
    });

    it('with subrouter and middleware', function() {
      var router = new Router();
      var childRouter = new Router();

      childRouter.get('/foo', middleware2, getFooHandle);
      childRouter.post('/foo', middleware3, postFooHandle);

      router.use(middleware1, childRouter);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/': {
          delete: {
            middlewares: [
              middleware1Data
            ]
          },
          get: {
            middlewares: [
              middleware1Data
            ]
          },
          post: {
            middlewares: [
              middleware1Data
            ]
          },
          put: {
            middlewares: [
              middleware1Data
            ]
          }
        },
        '/foo': {
          get: {
            middlewares: [
              middleware2Data
            ],
            name: getFooData
          },
          post: {
            middlewares: [
              middleware3Data
            ],
            name: postFooData
          }
        }
      };
      assert.deepEqual(expected, structure);
    });

    it('with a middlewared subrouter', function() {
      var router = new Router();
      var childRouter = new Router();

      childRouter.use(middleware1);
      childRouter.get('/foo', middleware2, getFooHandle);
      childRouter.post('/foo', middleware3, postFooHandle);

      router.use(childRouter);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/': {
          delete: {
            middlewares: [
              middleware1Data
            ]
          },
          get: {
            middlewares: [
              middleware1Data
            ]
          },
          post: {
            middlewares: [
              middleware1Data
            ]
          },
          put: {
            middlewares: [
              middleware1Data
            ]
          }
        },
        '/foo': {
          get: {
            middlewares: [
              middleware2Data
            ],
            name: getFooData
          },
          post: {
            middlewares: [
              middleware3Data
            ],
            name: postFooData
          }
        }
      };
      assert.deepEqual(expected, structure);
    });

    it('with a middlewared subrouter', function() {
      var router = new Router();
      var childRouter = new Router();

      childRouter.use(middleware1);
      childRouter.get('/foo', middleware2, getFooHandle);
      childRouter.post('/foo', middleware3, postFooHandle);

      router.use('/sub', childRouter);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/sub': {
          delete: {
            middlewares: [
              middleware1Data
            ]
          },
          get: {
            middlewares: [
              middleware1Data
            ]
          },
          post: {
            middlewares: [
              middleware1Data
            ]
          },
          put: {
            middlewares: [
              middleware1Data
            ]
          }
        },
        '/sub/foo': {
          get: {
            middlewares: [
              middleware2Data
            ],
            name: getFooData
          },
          post: {
            middlewares: [
              middleware3Data
            ],
            name: postFooData
          }
        }
      };
      assert.deepEqual(expected, structure);
    });

    it.only('with a middlewared subrouter and route', function() {
      var router = new Router();
      var childRouter = new Router();

      childRouter.get('/foo', middleware2, getFooHandle);

      router.use('/sub', middleware1, childRouter);
      router.get('/foo', getFooHandle);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/foo': {
          get: {
            middlewares: [ ],
            name: getFooData
          },
        },
        '/sub': {
          delete: {
            middlewares: [
              middleware1Data
            ]
          },
          get: {
            middlewares: [
              middleware1Data
            ]
          },
          post: {
            middlewares: [
              middleware1Data
            ]
          },
          put: {
            middlewares: [
              middleware1Data
            ]
          }
        },
        '/sub/foo': {
          get: {
            middlewares: [
              middleware2Data
            ],
            name: getFooData
          },
        }
      };
      assert.deepEqual(expected, structure);
    });

    it('with a description', function() {
      var router = new Router();
      function handle(req, res) { doNothing(req, res); }
      handle.description = 'this is the description';
      function mid(req, res, next) { doNothing(req, res, next); }
      mid.description = 'should validate the request';
      router.get('/foo', mid, handle);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/foo': {
          get: {
            middlewares: [
              {
                description: mid.description,
                long_description: undefined,
                name: 'mid',
              }
            ],
            name: {
              description: handle.description,
              long_description: undefined,
              name: 'handle',
            }
          },
        }
      };
      assert.deepEqual(structure, expected);
    });

    it('hideInClimber', function() {
      var router = new Router();
      function handle(req, res) { doNothing(req, res); }
      handle.description = 'this is the description';
      function mid(req, res, next) { doNothing(req, res, next); }
      mid.hideInClimber = true;
      mid.description = 'should validate the request';
      router.get('/foo', mid, handle);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/foo': {
          get: {
            middlewares: [ ],
            name: {
              description: handle.description,
              long_description: undefined,
              name: 'handle',
            }
          },
        }
      };
      assert.deepEqual(structure, expected);
    });

    it('using all methods', function() {
      var router = new Router();
      router.all('/foo', middleware1, getFooHandle);

      var structure = climber.getAsStructure(router);
      var expected = {
        '/foo': {
          delete: {
            middlewares: [ middleware1Data ],
            name: getFooData
          },
          get: {
            middlewares: [ middleware1Data ],
            name: getFooData
          },
          post: {
            middlewares: [ middleware1Data ],
            name: getFooData
          },
          put: {
            middlewares: [ middleware1Data ],
            name: getFooData
          },
        }
      };
      assert.deepEqual(structure, expected);
    });
  });

  describe('app', function () {
    it('simple', function() {
      var app = express();
      app.get('/foo', getFooHandle);

      var structure = climber.getAsStructure(app);
      var expected = {
        '/': {
          delete: {
            middlewares: [
              queryData,
              expressInitData,
            ],
          },
          get: {
            middlewares: [
              queryData,
              expressInitData,
            ],
          },
          post: {
            middlewares: [
              queryData,
              expressInitData,
            ],
          },
          put: {
            middlewares: [
              queryData,
              expressInitData,
            ],
          },
        },
        '/foo': {
          get: {
            middlewares: [],
            name: getFooData
          },
        },
      };

      assert.deepEqual(expected, structure);
    });
  });
});
