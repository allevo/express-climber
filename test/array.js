'use strict';

var assert = require('assert');

var express = require('express');
var Router = express.Router;

var climber = require('..');

var helper = require('./helper');

var middleware1 = helper.middleware1;
var middleware2 = helper.middleware2;
var getFooHandle = helper.getFooHandle;
var postFooHandle = helper.postFooHandle;
var deleteBarHandle = helper.deleteBarHandle;
var postFooData = helper.postFooData;
var getFooData = helper.getFooData;
var deleteBarData = helper.deleteBarData;
var middleware1Data = helper.middleware1Data;
var middleware2Data = helper.middleware2Data;

describe('array', function () {
  it('simple', function() {
    var router = new Router();
    router.get('/foo', getFooHandle);
    router.post('/foo', middleware1, postFooHandle);
    router.delete('/bar', middleware2, deleteBarHandle);

    var array = climber.getAsArray(router);
    var expected = [
      {
        method: 'get',
        middlewares: [],
        name: getFooData,
        url: '/foo',
      },
      {
        method: 'post',
        middlewares: [middleware1Data],
        name: postFooData,
        url: '/foo',
      },
      {
        method: 'delete',
        middlewares: [middleware2Data],
        name: deleteBarData,
        url: '/bar',
      }
    ];
    assert.deepEqual(array, expected);
  });
});
