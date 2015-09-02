'use strict';

var assert = require('assert');
var express = require('express');
var Router = express.Router;

var climber = require('..');
var helper = require('./helper');

var doNothing = helper.doNothing;
var middleware1 = helper.middleware1;
var middleware2 = helper.middleware2;
var middleware3 = helper.middleware3;
var getFooHandle = helper.getFooHandle;
var postFooHandle = helper.postFooHandle;
var deleteBarHandle = helper.deleteBarHandle;
var postFooData = helper.postFooData;
var getFooData = helper.getFooData;
var deleteBarData = helper.deleteBarData;
var middleware1Data = helper.middleware1Data;
var middleware2Data = helper.middleware2Data;
var middleware3Data = helper.middleware3Data;
var queryData = helper.queryData;
var expressInitData = helper.expressInitData;

function generateRouterBlock(conf) {
  return function() {
    var router = conf.getRouter();

    it('structure should be correct', function () {
      var structure = climber.getAsStructure(router);
      var expected = conf.structure;
      assert.deepEqual(structure, expected);
    });

    it('array should be correct', function () {
      var array = climber.getAsArray(router);
      var expected = conf.array;
      assert.deepEqual(array, expected);
    });
  };
}

describe('express-climber', function () {
  describe('router', function () {
    describe('simple', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        router.get('/foo', getFooHandle);
        router.post('/foo', postFooHandle);
        router.delete('/bar', deleteBarHandle);
        return router;
      },
      structure: {
        '/foo': {
          get: { handle: getFooData, middlewares: [] },
          post: { handle: postFooData, middlewares: [] },
        },
        '/bar': {
          delete: { handle: deleteBarData, middlewares: [] },
        },
      },
      array: [
        {
          method: 'get',
          middlewares: [],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'post',
          middlewares: [],
          handle: postFooData,
          url: '/foo',
        },
        {
          method: 'delete',
          middlewares: [],
          handle: deleteBarData,
          url: '/bar',
        },
      ],
    }));

    describe('with router middleware', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        router.use(middleware1);
        router.get('/foo', middleware2, getFooHandle);
        router.post('/foo', middleware3, postFooHandle);
        return router;
      },
      structure: {
        '/': {
          get: { middlewares: [middleware1Data] },
          post: { middlewares: [middleware1Data] },
          put: { middlewares: [middleware1Data] },
          delete: { middlewares: [middleware1Data] },
        },
        '/foo': {
          get: { handle: getFooData, middlewares: [middleware2Data] },
          post: { handle: postFooData, middlewares: [middleware3Data] },
        },
      },
      array: [
        {
          method: 'get',
          middlewares: [middleware1Data, middleware2Data ],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'post',
          middlewares: [middleware1Data, middleware3Data ],
          handle: postFooData,
          url: '/foo',
        }
      ],
    }));

    describe('with subrouter', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        var childRouter = new Router();

        childRouter.get('/foo', middleware1, middleware2, getFooHandle);
        childRouter.post('/foo', middleware3, middleware1, postFooHandle);

        router.use(childRouter);
        return router;
      },
      structure: {
        '/foo': {
          get: {
            middlewares: [
              middleware1Data,
              middleware2Data
            ],
            handle: getFooData
          },
          post: {
            middlewares: [
              middleware3Data,
              middleware1Data
            ],
            handle: postFooData
          }
        }
      },
      array: [
        {
          method: 'get',
          middlewares: [ middleware1Data, middleware2Data ],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'post',
          middlewares: [ middleware3Data, middleware1Data ],
          handle: postFooData,
          url: '/foo',
        },
      ],
    }));

    describe('with subrouter and middleware', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        var childRouter = new Router();

        childRouter.get('/foo', middleware2, getFooHandle);
        childRouter.post('/foo', middleware3, postFooHandle);

        router.use(middleware1, childRouter);

        return router;
      },
      structure: {
        '/': {
          delete: { middlewares: [ middleware1Data ] },
          get: { middlewares: [ middleware1Data ] },
          post: { middlewares: [ middleware1Data ] },
          put: { middlewares: [ middleware1Data ] }
        },
        '/foo': {
          get: {
            middlewares: [ middleware2Data ],
            handle: getFooData
          },
          post: {
            middlewares: [ middleware3Data ],
            handle: postFooData
          }
        }
      },
      array: [
        {
          method: 'get',
          middlewares: [ middleware1Data, middleware2Data ],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'post',
          middlewares: [ middleware1Data, middleware3Data ],
          handle: postFooData,
          url: '/foo',
        },
      ],
    }));

    describe('with a subrouter and global middleware', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        var childRouter = new Router();

        childRouter.use(middleware1);
        childRouter.get('/foo', middleware2, getFooHandle);
        childRouter.post('/foo', middleware3, postFooHandle);

        router.use(childRouter);
        return router;
      },
      structure: {
        '/': {
          delete: { middlewares: [ middleware1Data ] },
          get: { middlewares: [ middleware1Data ] },
          post: { middlewares: [ middleware1Data ] },
          put: { middlewares: [ middleware1Data ] },
        },
        '/foo': {
          get: {
            middlewares: [ middleware2Data ],
            handle: getFooData
          },
          post: {
            middlewares: [ middleware3Data ],
            handle: postFooData
          }
        }
      },
      array: [
        {
          method: 'get',
          middlewares: [ middleware1Data, middleware2Data ],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'post',
          middlewares: [ middleware1Data, middleware3Data ],
          handle: postFooData,
          url: '/foo',
        },
      ],
    }));

    describe('with a middlewared subrouter in subpath', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        var childRouter = new Router();

        childRouter.use(middleware1);
        childRouter.get('/foo', middleware2, getFooHandle);
        childRouter.post('/foo', middleware3, postFooHandle);

        router.use('/sub', childRouter);
        return router;
      },
      structure: {
        '/sub': {
          delete: { middlewares: [ middleware1Data ] },
          get: { middlewares: [ middleware1Data ] },
          post: { middlewares: [ middleware1Data ] },
          put: { middlewares: [ middleware1Data ] }
        },
        '/sub/foo': {
          get: {
            middlewares: [ middleware2Data ],
            handle: getFooData
          },
          post: {
            middlewares: [ middleware3Data ],
            handle: postFooData
          }
        }
      },
      array: [
        {
          method: 'get',
          middlewares: [ middleware1Data, middleware2Data ],
          handle: getFooData,
          url: '/sub/foo',
        },
        {
          method: 'post',
          middlewares: [ middleware1Data, middleware3Data ],
          handle: postFooData,
          url: '/sub/foo',
        },
      ],
    }));

    describe('with a middlewared subrouter and route', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        var childRouter = new Router();

        childRouter.get('/foo', middleware2, getFooHandle);

        router.use('/sub', middleware1, childRouter);
        router.get('/foo', getFooHandle);

        return router;
      },
      structure: {
        '/foo': {
          get: {
            middlewares: [ ],
            handle: getFooData
          },
        },
        '/sub': {
          delete: { middlewares: [ middleware1Data ] },
          get: { middlewares: [ middleware1Data ] },
          post: { middlewares: [ middleware1Data ] },
          put: { middlewares: [ middleware1Data ] }
        },
        '/sub/foo': {
          get: {
            middlewares: [ middleware2Data ],
            handle: getFooData
          },
        }
      },
      array: [
        {
          method: 'get',
          middlewares: [ middleware1Data, middleware2Data ],
          handle: getFooData,
          url: '/sub/foo',
        },
        {
          method: 'get',
          middlewares: [],
          handle: getFooData,
          url: '/foo',
        },
      ],
    }));

    describe('with a description', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        function handle(req, res) { doNothing(req, res); }
        handle.description = 'this is the description';
        function mid(req, res, next) { doNothing(req, res, next); }
        mid.description = 'should validate the request';
        router.get('/foo', mid, handle);
        return router;
      },
      structure: {
        '/foo': {
          get: {
            middlewares: [
              {
                description: 'should validate the request',
                long_description: undefined,
                name: 'mid',
              }
            ],
            handle: {
              description: 'this is the description',
              long_description: undefined,
              name: 'handle',
            }
          },
        }
      },
      array: [
        {
          method: 'get',
          middlewares: [
            {
              description: 'should validate the request',
              long_description: undefined,
              name: 'mid',
            },
          ],
          handle: {
            description: 'this is the description',
            long_description: undefined,
            name: 'handle',
          },
          url: '/foo',
        },
      ],
    }));

    describe('hideInClimber', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        function handle(req, res) { doNothing(req, res); }
        handle.description = 'this is the description';
        function mid(req, res, next) { doNothing(req, res, next); }
        mid.hideInClimber = true;
        mid.description = 'should validate the request';
        router.get('/foo', mid, handle);
        return router;
      },
      structure: {
        '/foo': {
          get: {
            middlewares: [ ],
            handle: {
              description: 'this is the description',
              long_description: undefined,
              name: 'handle',
            },
          },
        },
      },
      array: [
        {
          method: 'get',
          middlewares: [],
          handle: {
            description: 'this is the description',
            long_description: undefined,
            name: 'handle',
          },
          url: '/foo',
        },
      ],
    }));

    describe('using all methods', generateRouterBlock({
      getRouter: function() {
        var router = new Router();
        router.all('/foo', middleware1, getFooHandle);
        return router;
      },
      structure: {
        '/foo': {
          delete: {
            middlewares: [ middleware1Data ],
            handle: getFooData
          },
          get: {
            middlewares: [ middleware1Data ],
            handle: getFooData
          },
          post: {
            middlewares: [ middleware1Data ],
            handle: getFooData
          },
          put: {
            middlewares: [ middleware1Data ],
            handle: getFooData
          },
        }
      },
      array: [
        {
          method: 'get',
          middlewares: [ middleware1Data ],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'post',
          middlewares: [ middleware1Data ],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'delete',
          middlewares: [ middleware1Data ],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'put',
          middlewares: [ middleware1Data ],
          handle: getFooData,
          url: '/foo',
        },
      ],
    }));
  });

  describe('app', function () {
    describe('simple', generateRouterBlock({
      getRouter: function () {
        var app = express();
        app.get('/foo', getFooHandle);
        return app;
      },
      structure: {
        '/': {
          delete: { middlewares: [ queryData, expressInitData ] },
          get: { middlewares: [ queryData, expressInitData ] },
          post: { middlewares: [ queryData, expressInitData ] },
          put: { middlewares: [ queryData, expressInitData ] },
        },
        '/foo': {
          get: {
            middlewares: [],
            handle: getFooData
          },
        },
      },
      array: [
        {
          method: 'get',
          middlewares: [ queryData, expressInitData ],
          handle: getFooData,
          url: '/foo',
        },
      ],
    }));

    describe('with router mounted at /', generateRouterBlock({
      getRouter: function () {
        var app = express();
        app.get('/foo', getFooHandle);
        var router = new Router();
        router.use(middleware1);
        router.delete('/bar', middleware3, deleteBarHandle);
        app.use('/', middleware2, router);
        return app;
      },
      structure: {
        '/': {
          delete: { middlewares: [ queryData, expressInitData, middleware2Data, middleware1Data ] },
          get: { middlewares: [ queryData, expressInitData, middleware2Data, middleware1Data ] },
          post: { middlewares: [ queryData, expressInitData, middleware2Data, middleware1Data ] },
          put: { middlewares: [ queryData, expressInitData, middleware2Data, middleware1Data ] },
        },
        '/bar': {
          delete: {
            middlewares: [ middleware3Data ],
            handle: deleteBarData,
          },
        },
        '/foo': {
          get: {
            middlewares: [],
            handle: getFooData
          },
        },
      },
      array: [
        {
          method: 'get',
          middlewares: [ queryData, expressInitData, middleware2Data, middleware1Data ],
          handle: getFooData,
          url: '/foo',
        },
        {
          method: 'delete',
          middlewares: [ queryData, expressInitData, middleware2Data, middleware1Data, middleware3Data ],
          handle: deleteBarData,
          url: '/bar',
        },
      ],
    }));
  });
});
