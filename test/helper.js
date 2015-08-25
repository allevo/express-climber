'use strict';


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

module.exports = {
  doNothing: doNothing,
  middleware1: middleware1,
  middleware2: middleware2,
  middleware3: middleware3,
  getFooHandle: getFooHandle,
  postFooHandle: postFooHandle,
  deleteBarHandle: deleteBarHandle,
  postFooData: postFooData,
  getFooData: getFooData,
  deleteBarData: deleteBarData,
  middleware1Data: middleware1Data,
  middleware2Data: middleware2Data,
  middleware3Data: middleware3Data,
  queryData: queryData,
  expressInitData: expressInitData,
};
