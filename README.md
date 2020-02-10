<!-- ix-docs-ignore -->
![imgix logo](https://assets.imgix.net/sdk-imgix-logo.svg)

`imgix-core-js` is a JavaScript library for generating image URLs with [imgix](https://www.imgix.com/) that can be used in browser or server-side settings.

[![NPM Version](https://img.shields.io/npm/v/imgix-core-js.svg)](https://www.npmjs.com/package/imgix-core-js)
[![Build Status](https://travis-ci.org/imgix/imgix-core-js.svg?branch=master)](https://travis-ci.org/imgix/imgix-core-js)
[![Monthly Downloads](https://img.shields.io/npm/dm/imgix-core-js.svg)](https://www.npmjs.com/package/imgix-core-js)
[![Minified Size](https://img.shields.io/bundlephobia/min/imgix-core-js)](https://bundlephobia.com/result?p=imgix-core-js)
[![License](https://img.shields.io/github/license/imgix/imgix-core-js)](https://github.com/imgix/imgix-core-js/blob/master/LICENSE.md)

---
<!-- /ix-docs-ignore -->

- [Installing](#installing)
- [Usage](#usage)
  - [CommonJS](#commonjs)
  - [ES6 Modules](#es6-modules)
  - [In-browser](#in-browser)
- [Srcset Generation](#srcset-generation)
  - [Fixed image rendering](#fixed-image-rendering)
  - [Minimum and Maximum Width Ranges](#minimum-and-maximum-width-ranges)
- [What is the `ixlib` param on every request?](#what-is-the-ixlib-param-on-every-request)
- [Testing](#testing)

## Installing

imgix-core-js can be installed as either via npm or via bower:

```bash
npm install --save imgix-core-js
```

or

```bash
bower install --save imgix-core-js
```

## Usage

Depending on your module system, using imgix-core-js is done a few different ways. The most common entry point will be the `ImgixClient` class. Whenever you provide data to imgix-core-js, make sure it is not already URL-encoded, as the library handles proper encoding internally.

### CommonJS

```js
var ImgixClient = require('imgix-core-js');

var client = new ImgixClient({
  domain: "my-social-network.imgix.net",
  secureURLToken: "<SECURE TOKEN>"
});
var url = client.buildURL("/path/to/image.png", {
  w: 400,
  h: 300
});
console.log(url); // => "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=…"
```

### ES6 Modules

```js
import ImgixClient from 'imgix-core-js'

let client = new ImgixClient({
  domain: 'my-social-network.imgix.net',
  secureURLToken: '<SECURE TOKEN>'
});

let url = client.buildURL('/path/to/image.png', { w: 400, h: 300 });
console.log(url); // => 'https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=…'
```

### In-browser

```js
var client = new ImgixClient({
  domain: 'my-social-network.imgix.net'
  // Do not use signed URLs with `secureURLToken` on the client side,
  // as this would leak your token to the world. Signed URLs should
  // be generated on the server.
});

var url = client.buildURL('/path/to/image.png', { w: 400, h: 300 });
console.log(url); // => "https://my-social-network.imgix.net/users/1.png?w=400&h=300"
```

## Srcset Generation

The imgix-core-js module allows for generation of custom `srcset` attributes, which can be invoked through `buildSrcSet()`. By default, the `srcset` generated will allow for responsive size switching by building a list of image-width mappings.

```js
var client = new ImgixClient({domain:'my-social-network.imgix.net', secureURLToken:'my-token', includeLibraryParam:false});
var srcset = client.buildSrcSet('image.jpg');

console.log(srcset);
```

Will produce the following attribute value, which can then be served to the client:

```html
https://my-social-network.imgix.net/image.jpg?w=100&s=e2e581a39c917bdee50b2f8689c30893 100w,
https://my-social-network.imgix.net/image.jpg?w=116&s=836e0bc15da2ad74af8130d93a0ebda6 116w,
https://my-social-network.imgix.net/image.jpg?w=134&s=688416d933381acda1f57068709aab79 134w,
                                            ...
https://my-social-network.imgix.net/image.jpg?w=7400&s=91779d82a0e1ac16db04c522fa4017e5 7400w,
https://my-social-network.imgix.net/image.jpg?w=8192&s=59eb881b618fed314fe30cf9e3ec7b00 8192w
```

### Fixed image rendering

In cases where enough information is provided about an image's dimensions, `buildSrcSet()` will instead build a `srcset` that will allow for an image to be served at different resolutions. The parameters taken into consideration when determining if an image is fixed-width are `w`, `h`, and `ar`. By invoking `buildSrcSet()` with either a width **or** the height and aspect ratio (along with `fit=crop`, typically) provided, a different `srcset` will be generated for a fixed-size image instead.

```js
var client = new ImgixClient({domain:'my-social-network.imgix.net', secureURLToken:'my-token', includeLibraryParam:false});
var srcset = client.buildSrcSet('image.jpg', {h:800, ar:'3:2',fit:'crop'});

console.log(srcset);
```

Will produce the following attribute value:

```html
https://my-social-network.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=1&s=3d754a157458402fd3e26977107ade74 1x,
https://my-social-network.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=2&s=a984ad1a81d24d9dd7d18195d5262c82 2x,
https://my-social-network.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=3&s=8b93ab83d3f1ede4887e6826112d60d1 3x,
https://my-social-network.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=4&s=df7b67aa0439588edbfc1c249b3965d6 4x,
https://my-social-network.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=5&s=7c4b8adb733db37d00240da4ca65d410 5x
```

For more information to better understand `srcset`, we highly recommend [Eric Portis' "Srcset and sizes" article](https://ericportis.com/posts/2014/srcset-sizes/) which goes into depth about the subject.

### Minimum and Maximum Width Ranges

If the exact number of minimum/maximum physical pixels that an image will need to be rendered at is known, a user can specify them by passing a positive integer via `minWidth` and/or `maxWidth` to the srcset-modifying parameter:

```js
var client = new ImgixClient({
  domain:'sher.img.net',
  includeLibraryParam: false
  })
var srcset = client.buildSrcSet('image.jpg', {}, {minWidth:500, maxWidth: 2000})

console.log(srcset);
```

Will result in a smaller, more tailored srcset.

``` html
https://sher.img.net/image.jpg?w=500 500w,
https://sher.img.net/image.jpg?w=580 580w,
https://sher.img.net/image.jpg?w=672 672w,
https://sher.img.net/image.jpg?w=780 780w,
https://sher.img.net/image.jpg?w=906 906w,
https://sher.img.net/image.jpg?w=1050 1050w,
https://sher.img.net/image.jpg?w=1218 1218w,
https://sher.img.net/image.jpg?w=1414 1414w,
https://sher.img.net/image.jpg?w=1640 1640w,
https://sher.img.net/image.jpg?w=1902 1902w,
https://sher.img.net/image.jpg?w=2000 2000w
```

Remember that browsers will apply a device pixel ratio as a multiplier when selecting which image to download from a `srcset`. For example, even if you know your image will render no larger than 1000px, specifying `options: { max_srcset: 1000 }` will give your users with DPR higher than 1 no choice but to download and render a low-resolution version of the image. Therefore, it is vital to factor in any potential differences when choosing a minimum or maximum range.

Also please note that according to the [imgix API](https://docs.imgix.com/apis/url/size/w), the maximum renderable image width is 8192 pixels.

## What is the `ixlib` param on every request?

For security and diagnostic purposes, we sign all requests with the language and version of library used to generate the URL.

This can be disabled by passing a falsy value for the `includeLibraryParam` option to `new ImgixClient`:

``` javascript
new ImgixClient({
  domain: 'my-source.imgix.net',
  includeLibraryParam: false
});
```

## Testing

imgix-core-js uses mocha for testing. Here’s how to run those tests:

```bash
npm test
```
