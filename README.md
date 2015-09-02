# express-climber
[![Build Status](https://travis-ci.org/allevo/express-climber.svg?branch=master)](https://travis-ci.org/allevo/express-climber)
[![Coverage Status](https://coveralls.io/repos/allevo/express-climber/badge.svg?branch=master&service=github)](https://coveralls.io/github/allevo/express-climber?branch=master)

```
npm install --save express-climber
```

This package aims to list all your routes declared in a Router or in an Application. It is tested with express at version `4.13.3`. Please tell me if with another version this module fails.
Middleware or router handler have a name, a description and a long_description.
The name is the function name. To fill description and long_description, add those properties to the function like this:
``` javascript
function myHandle(req, res) {
  ...
}
myHandle.description = 'This is the description';
myHandle.long_description = 'This is the long description where you can describe better the behaviour for this handler.';
```

If you want to hide a middleware, add `hideInClimber` property to the function like this:
```javasccript
function myMiddleware(req, res, next) {
  ...
}
myMiddleware.hideInClimber = true;
```
And `myMiddleware` will be not listed.

### getAsStructure
Return a complex structure.
In the structure the keys are the routes and the values are a description of what is attached there
Example of output:
```javascript
{
  '/': {
    get: { middlewares: [ ... ] },
    post: { middlewares: [ ... ] },
    put: { middlewares: [ ... ] },
    delete: { middlewares: [ ... ] }
  },
  '/foo': {
    get: { handle: { ... }, middlewares: [ ... ] },
    post: { handle: { ... }, middlewares: [ ... ] }
  }
}
```
See the tests for more informations.

### getAsArray
This returns na array that contains all routes defined.
Example of output:
```javascript
[
  {
    method: 'get',
    middlewares: [ ... ],
    handle: { ... },
    url: '/foo'
  },
  {
    method: 'post',
    middlewares: [ ... ],
    handle: { ... },
    url: '/foo'
  },
  {
    method: 'delete',
    middlewares: [ ... ],
    handle: { ... },
    url: '/bar'
  }
]
```

## Contributing
Any suggestion are accepted. Please open an issue or make a PR.

