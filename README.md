# imgix-core-js

[![Build Status](https://travis-ci.org/imgix/imgix-core-js.png?branch=master)](https://travis-ci.org/imgix/imgix-core-js)

imgix-core-js is an npm and Bower package that provides the common boilerplate for [imgix](https://imgix.com) server and client-side JavaScript-based functionality.

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


## Usage

Depending on your module system, using imgix-core-js is done a few different ways. The most common entry point will be the `Client` class. Whenever you provide data to imgix-core-js, make sure it is not already URL-encoded, as the library handles proper encoding internally.

### CommonJS

``` javascript
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

``` javascript
import ImgixClient from 'imgix-core-js'

let client = new ImgixClient({
  host: 'my-social-network.imgix.net',
  secureURLToken: '<SECURE TOKEN>'
});

let url = client.buildURL('/path/to/image.png', { w: 400, h: 300 });
console.log(url); // => 'https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=…'
```

### In-browser

``` javascript
var client = new ImgixClient({
  host: 'my-social-network.imgix.net'
  // Do not use signed URLs with `secureURLToken` on the client side,
  // as this would leak your token to the world. Signed URLs should
  // be generated on the server.
});

var url = client.buildURL('/path/to/image.png', { w: 400, h: 300 });
console.log(url); // => "https://my-social-network.imgix.net/users/1.png?w=400&h=300"
```


## What is the `ixlib` param on every request?

For security and diagnostic purposes, we sign all requests with the language and version of library used to generate the URL.

This can be disabled by passing a falsy value for the `includeLibraryParam` option to `new ImgixClient`:

``` javascript
new ImgixClient({
  host: 'my-source.imgix.net',
  includeLibraryParam: false
});
```


## Testing

imgix-core-js uses mocha for testing. Here’s how to run those tests:

```
npm test
```


## Publishing a new version

To publish a new version of the NPM package:

```bash
$ npm publish
```

The Bower package will be automatically updated when you create a new release in GitHub.
