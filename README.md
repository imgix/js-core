# imgix-core-js

[![Build Status](https://travis-ci.org/imgix/imgix-core-js.png?branch=master)](https://travis-ci.org/imgix/imgix-core-js)

imgix-core-js is an npm and bower package that provides the common boilerplate for [imgix](https://www.imgix.com) server-side and client-side JavaScript-based functionality. For a turn-key imgix solution, please see [imgix.js](https://www.imgix.com/imgix-js).

imgix-core-js adheres to the [imgix-blueprint](https://github.com/imgix/imgix-blueprint) for definitions of its functionality.

## Installing

imgix-core-js can be installed as either via npm or via bower:

```
$ npm install --save imgix-core-js
```

or

```
$ bower install --save imgix-core-js
```

## ES6

imgix-core-js and its tests are written in ES6 JavaScript. [Babel](https://babeljs.io/) is used for transpilation into the `lib/` directory.

## Using

Depending on your module system, using imgix-core-js is done a few different ways. The most common entry point will be the `Client` class. Whenever you provide data to imgix-core-js, make sure it is not already URL-encoded, as the library handles proper encoding internally.

### CommonJS

```javascript
var ImgixClient = require('imgix-core-js');

var client = new ImgixClient({
  host: "my-social-network.imgix.net",
  secureURLToken: "<SECURE TOKEN>"
});
var url = client.buildURL("/path/to/image.png", {
  w: 400,
  h: 300
});
console.log(url); // => "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=…"
```

### ES6 Modules

```javascript
import Client from "imgix/client";

let imgixClient = new Client("my-social-network.imgix.net", "<SECURE TOKEN>");
let url = imgixClient.path("/path/to/image.png").toUrl({ w: 400, h: 300 }).toString();
console.log(url); // => "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=…"
```

### In the browser

```javascript
// Include dist/imgix-core-js.umd.js somewhere on the head

let imgixClient = new Client("my-social-network.imgix.net", "<SECURE TOKEN>");
let url = imgixClient.path("/path/to/image.png").toUrl({ w: 400, h: 300 }).toString();
console.log(url); // => "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=…"
```

## What is the `ixlib` param on every request?

For security and diagnostic purposes, we sign all requests with the language and version of library used to generate the URL.

This can be disabled by passing a falsy value for the `librarySignature` param to either `new Path` or `new Client`:

``` javascript
// `librarySignature` is the last param in both examples

new Path('my-image.png', 'my-source.imgix.net', null, true, null);
new Client('my-source.imgix.net', null, true, null);
```

## Testing

imgix-core-js uses mocha for testing. Here’s how to run those tests:

```
npm test
```

## Publishing a new version

Publishing a new version needs to be done for both NPM and Bower. To publish a new version of the NPM package:

```bash
$ npm publish
```

To publish a new version of the Bower package:

```bash
$ npm run compile_umd # dist/imgix-core-js.umd.js is the entry point for Bower
$ git add -f dist/imgix-core-js.umd.js
$ git tag -a vX.Y.Z
$ git push origin --tags master
```
