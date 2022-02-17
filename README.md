<!-- ix-docs-ignore -->

![imgix logo](https://assets.imgix.net/sdk-imgix-logo.svg)

`@imgix/js-core` is a JavaScript library for generating image URLs with [imgix](https://www.imgix.com/) that can be used in browser or server-side settings.

[![NPM Version](https://img.shields.io/npm/v/imgix-core-js.svg)](https://www.npmjs.com/package/@imgix/js-core)
[![Build Status](https://api.travis-ci.com/imgix/js-core.svg?branch=main)](https://travis-ci.com/github/imgix/js-core)
[![Monthly Downloads](https://img.shields.io/npm/dm/imgix-core-js.svg)](https://www.npmjs.com/package/@imgix/js-core)
[![Minified Size](https://img.shields.io/bundlephobia/min/imgix-core-js)](https://bundlephobia.com/result?p=imgix-core-js)
[![License](https://img.shields.io/github/license/imgix/js-core)](https://github.com/imgix/js-core/blob/main/LICENSE.md)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimgix%2Fimgix-core-js.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fimgix%2Fimgix-core-js?ref=badge_shield)

---

<!-- /ix-docs-ignore -->

<!-- NB: Run `npx markdown-toc README.md --maxdepth 4 | sed -e 's/[[:space:]]\{2\}/    /g' | pbcopy` to generate TOC :) -->

<!-- prettier-ignore-start -->

- [Installing](#installing)
- [Usage](#usage)
    * [CommonJS](#commonjs)
    * [ES6 Modules](#es6-modules)
    * [In-browser](#in-browser)
- [Configuration](#configuration)
- [API](#api)
    * [`ImgixClient.buildURL(path, params, options)`](#imgixclientbuildurlpath-params-options)
    * [`ImgixClient.buildSrcSet(path, params, options)`](#imgixclientbuildsrcsetpath-params-options)
        + [Fixed Image Rendering](#fixed-image-rendering)
        + [Custom Widths](#custom-widths)
        + [Width Tolerance](#width-tolerance)
        + [Minimum and Maximum Width Ranges](#minimum-and-maximum-width-ranges)
        + [Variable Qualities](#variable-qualities)
        + [Disable Path Encoding](#disable-path-encoding)
    * [Web Proxy Sources](#web-proxy-sources)
- [What is the `Ixlib` Param on Every Request?](#what-is-the-ixlib-param-on-every-request)
- [Testing](#testing)
- [License](#license)

<!-- prettier-ignore-end -->

## Installing

@imgix/js-core can be installed via npm:

```bash
npm install @imgix/js-core
```

## Usage

Depending on your module system, using @imgix/js-core is done a few different ways. The most common entry point will be the `ImgixClient` class. Whenever you provide data to `ImgixClient`, make sure it is not already URL-encoded, as the library handles proper encoding internally.

### CommonJS

```js
const ImgixClient = require('@imgix/js-core');

const client = new ImgixClient({
  domain: 'testing.imgix.net',
  secureURLToken: '<SECURE TOKEN>',
});

const url = client.buildURL('/path/to/image.png', {
  w: 400,
  h: 300,
});

console.log(url); // => "https://testing.imgix.net/users/1.png?w=400&h=300&s=…"
```

### ES6 Modules

```js
import ImgixClient from '@imgix/js-core';

const client = new ImgixClient({
  domain: 'testing.imgix.net',
  secureURLToken: '<SECURE TOKEN>',
});

const url = client.buildURL('/path/to/image.png', { w: 400, h: 300 });
console.log(url); // => 'https://testing.imgix.net/users/1.png?w=400&h=300&s=…'
```

### In-browser

```js
var client = new ImgixClient({
  domain: 'testing.imgix.net',
  // Do not use signed URLs with `secureURLToken` on the client side,
  // as this would leak your token to the world. Signed URLs should
  // be generated on the server.
});

var url = client.buildURL('/path/to/image.png', { w: 400, h: 300 });
console.log(url); // => "https://testing.imgix.net/users/1.png?w=400&h=300"
```

## Configuration

The following options can be used when creating an instance of `ImgixClient`:

- **`domain`:** String, required. The imgix domain that will be used when constructing URLs. Defaults to `null`.
- **`useHTTPS`:** Boolean. Specifies whether constructed URLs should use the HTTPS protocol. Defaults to `true`.
- **`includeLibraryParam`:** Boolean. Specifies whether the constructed URLs will include an [`ixlib` parameter](#what-is-the-ixlib-param-on-every-request). Defaults to `true`.
- **`secureURLToken`:** String. When specified, this token will be used to sign images. Read more about securing images [on the imgix Docs site](https://docs.imgix.com/setup/securing-images). Defaults to `null`.

## API

### `ImgixClient.buildURL(path, params, options)`

- **`path`:** String, required. A full, unencoded path to the image. This includes any additional directory information required to [locate the image](https://docs.imgix.com/setup/serving-images) within a source.
- **`params`:** Object. Any number of imgix rendering API [parameters](https://docs.imgix.com/apis/url).
- **`options`:** Object. Any number of modifiers, described below:
  - [**`disablePathEncoding`**](#disable-path-encoding)

Construct a single image URL by passing in the image `path` and any rendering API parameters.

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
});

const url = client.buildURL('folder/image.jpg', {
  w: 1000,
});
```

**Returns**: an image URL as a string.

```html
https://testing.imgix.net/folder/image.jpg?w=1000&ixlib=js-...
```

### `ImgixClient.buildSrcSet(path, params, options)`

<!-- prettier-ignore-start -->

- **`path`:** String, required. A full, unencoded path to the image. This includes any additional directory information required to [locate the image](https://docs.imgix.com/setup/serving-images) within a source.
- **`params`:** Object. Any number of imgix rendering API [parameters](https://docs.imgix.com/apis/url).
- **`options`:** Object. Any number of srcset modifiers, described below:
  - [**`widths`**](#custom-widths)
  - [**`widthTolerance`**](#width-tolerance)
  - [**`minWidth`**](#minimum-and-maximum-width-ranges)
  - [**`maxWidth`**](#minimum-and-maximum-width-ranges)
  - [**`disableVariableQuality`**](#variable-qualities)
  - [**`devicePixelRatios`**](#fixed-image-rendering)
  - [**`variableQualities`**](#variable-qualities)
  - [**`disablePathEncoding`**](#disable-path-encoding)

<!-- prettier-ignore-end -->

The @imgix/js-core module allows for generation of custom `srcset` attributes, which can be invoked through `buildSrcSet()`. By default, the `srcset` generated will allow for responsive size switching by building a list of image-width mappings.

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
  secureURLToken: 'my-token',
  includeLibraryParam: false,
});

const srcset = client.buildSrcSet('image.jpg');

console.log(srcset);
```

**Returns**: A `srcset` attribute value as a string.

<!-- prettier-ignore-start -->

```html
https://testing.imgix.net/image.jpg?w=100&s=e2e581a39c917bdee50b2f8689c30893 100w,
https://testing.imgix.net/image.jpg?w=116&s=836e0bc15da2ad74af8130d93a0ebda6 116w,
https://testing.imgix.net/image.jpg?w=134&s=688416d933381acda1f57068709aab79 134w,
                                            ...
https://testing.imgix.net/image.jpg?w=7400&s=91779d82a0e1ac16db04c522fa4017e5 7400w,
https://testing.imgix.net/image.jpg?w=8192&s=59eb881b618fed314fe30cf9e3ec7b00 8192w
```

<!-- prettier-ignore-end -->

#### Fixed Image Rendering

Specifying either a `w` or a `h` parameter to `buildSrcSet()` will create a DPR-based srcset. This DPR-based srcset allows for the fixed-sized image to be served at different resolutions (i.e. at different pixel densities).

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
  secureURLToken: 'my-token',
  includeLibraryParam: false,
});

const srcset = client.buildSrcSet('image.jpg', {
  h: 800,
  ar: '3:2',
  fit: 'crop',
});

console.log(srcset);
```

Will produce the following attribute value:

<!-- prettier-ignore-start -->

```html
https://testing.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=1&s=3d754a157458402fd3e26977107ade74 1x,
https://testing.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=2&s=a984ad1a81d24d9dd7d18195d5262c82 2x,
https://testing.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=3&s=8b93ab83d3f1ede4887e6826112d60d1 3x,
https://testing.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=4&s=df7b67aa0439588edbfc1c249b3965d6 4x,
https://testing.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=5&s=7c4b8adb733db37d00240da4ca65d410 5x
```

<!-- prettier-ignore-end -->

This library generate by default `1` to `5` dpr `srcset`.
You can control generated target ratios with `devicePixelRatios` parameters.

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
  secureURLToken: 'my-token',
  includeLibraryParam: false,
});

const srcset = client.buildSrcSet(
  'image.jpg',
  {
    h: 800,
    ar: '3:2',
    fit: 'crop',
  },
  {
    devicePixelRatios: [1, 2],
  },
);

console.log(srcset);
```

Will result in a smaller srcset.

```html
https://testing.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=1&s=3d754a157458402fd3e26977107ade74
1x,
https://testing.imgix.net/image.jpg?h=800&ar=3%3A2&fit=crop&dpr=2&s=a984ad1a81d24d9dd7d18195d5262c82
2x
```

For more information to better understand `srcset`, we highly recommend [Eric Portis' "Srcset and sizes" article](https://ericportis.com/posts/2014/srcset-sizes/) which goes into depth about the subject.

#### Custom Widths

In situations where specific widths are desired when generating `srcset` pairs, a user can specify them by passing an array of positive integers as `widths` to the third options object:

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
  includeLibraryParam: false,
});

const srcset = client.buildSrcSet(
  'image.jpg',
  {},
  { widths: [100, 500, 1000, 1800] },
);

console.log(srcset);
```

Will generate the following `srcset` of width pairs:

```html
https://testing.imgix.net/image.jpg?w=100 100w,
https://testing.imgix.net/image.jpg?w=500 500w,
https://testing.imgix.net/image.jpg?w=1000 1000w,
https://testing.imgix.net/image.jpg?w=1800 1800w
```

**Note:** that in situations where a `srcset` is being rendered as a [fixed image](#fixed-image-rendering), any custom `widths` passed in will be ignored. Additionally, if both `widths` and a `widthTolerance` are passed to the `buildSrcSet` method, the custom widths list will take precedence.

#### Width Tolerance

The `srcset` width tolerance dictates the maximum tolerated size difference between an image's downloaded size and its rendered size. For example: setting this value to 0.1 means that an image will not render more than 10% larger or smaller than its native size. In practice, the image URLs generated for a width-based srcset attribute will grow by twice this rate. A lower tolerance means images will render closer to their native size (thereby increasing perceived image quality), but a large srcset list will be generated and consequently users may experience lower rates of cache-hit for pre-rendered images on your site.

By default this rate is set to 8 percent, which we consider to be the ideal rate for maximizing cache hits without sacrificing visual quality. Users can specify their own width tolerance by providing a positive scalar value as `widthTolerance` to the third options object:

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
  includeLibraryParam: false,
});

const srcset = client.buildSrcSet('image.jpg', {}, { widthTolerance: 0.2 });

console.log(srcset);
```

In this case, the `width_tolerance` is set to 20 percent, which will be reflected in the difference between subsequent widths in a srcset pair:

<!-- prettier-ignore-start -->

```html
https://testing.imgix.net/image.jpg?w=100 100w,
https://testing.imgix.net/image.jpg?w=140 140w,
https://testing.imgix.net/image.jpg?w=196 196w,
          ...
https://testing.imgix.net/image.jpg?w=8192 8192w
```

<!-- prettier-ignore-end -->

#### Minimum and Maximum Width Ranges

In certain circumstances, you may want to limit the minimum or maximum value of the non-fixed `srcset` generated by the `buildSrcSet()` method. To do this, you can pass in an options object as a third argument, providing positive integers as `minWidth` and/or `maxWidth` attributes:

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
  includeLibraryParam: false,
});

const srcset = client.buildSrcSet(
  'image.jpg',
  {},
  { minWidth: 500, maxWidth: 2000 },
);

console.log(srcset);
```

Will result in a smaller, more tailored srcset.

```html
https://testing.imgix.net/image.jpg?w=500 500w,
https://testing.imgix.net/image.jpg?w=580 580w,
https://testing.imgix.net/image.jpg?w=672 672w,
https://testing.imgix.net/image.jpg?w=780 780w,
https://testing.imgix.net/image.jpg?w=906 906w,
https://testing.imgix.net/image.jpg?w=1050 1050w,
https://testing.imgix.net/image.jpg?w=1218 1218w,
https://testing.imgix.net/image.jpg?w=1414 1414w,
https://testing.imgix.net/image.jpg?w=1640 1640w,
https://testing.imgix.net/image.jpg?w=1902 1902w,
https://testing.imgix.net/image.jpg?w=2000 2000w
```

Remember that browsers will apply a device pixel ratio as a multiplier when selecting which image to download from a `srcset`. For example, even if you know your image will render no larger than 1000px, specifying `options: { max_srcset: 1000 }` will give your users with DPR higher than 1 no choice but to download and render a low-resolution version of the image. Therefore, it is vital to factor in any potential differences when choosing a minimum or maximum range.

**Note:** that according to the [imgix API](https://docs.imgix.com/apis/url/size/w), the maximum renderable image width is 8192 pixels.

#### Variable Qualities

This library will automatically append a variable `q` parameter mapped to each `dpr` parameter when generating a [fixed-image](https://github.com/imgix/js-core#fixed-image-rendering) srcset. This technique is commonly used to compensate for the increased filesize of high-DPR images. Since high-DPR images are displayed at a higher pixel density on devices, image quality can be lowered to reduce overall filesize without sacrificing perceived visual quality. For more information and examples of this technique in action, see [this blog post](https://blog.imgix.com/2016/03/30/dpr-quality).

This behavior will respect any overriding `q` value passed in as a parameter. Additionally, it can be disabled altogether by passing `{ disableVariableQuality: true }` to the third argument of `buildSrcSet()`.

This behavior specifically occurs when a [fixed-size image](https://github.com/imgix/js-core#fixed-image-rendering) is rendered, for example:

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
  includeLibraryParam: false,
});

const srcset = client.buildSrcSet('image.jpg', { w: 100 });

console.log(srcset);
```

Will generate a srcset with the following `q` to `dpr` mapping:

```html
https://testing.imgix.net/image.jpg?w=100&dpr=1&q=75 1x,
https://testing.imgix.net/image.jpg?w=100&dpr=2&q=50 2x,
https://testing.imgix.net/image.jpg?w=100&dpr=3&q=35 3x,
https://testing.imgix.net/image.jpg?w=100&dpr=4&q=23 4x,
https://testing.imgix.net/image.jpg?w=100&dpr=5&q=20 5x
```

Quality parameters is overridable for each `dpr` by passing `variableQualities` parameters.

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
  includeLibraryParam: false,
});

const srcset = client.buildSrcSet(
  'image.jpg',
  { w: 100 },
  { variableQualities: { 1: 45, 2: 30, 3: 20, 4: 15, 5: 10 } },
);

console.log(srcset);
```

Will generate the following custom `q` to `dpr` mapping:

```html
https://testing.imgix.net/image.jpg?w=100&dpr=1&q=45 1x,
https://testing.imgix.net/image.jpg?w=100&dpr=2&q=30 2x,
https://testing.imgix.net/image.jpg?w=100&dpr=3&q=20 3x,
https://testing.imgix.net/image.jpg?w=100&dpr=4&q=15 4x,
https://testing.imgix.net/image.jpg?w=100&dpr=5&q=10 5x
```

#### Disable Path Encoding

This library will encode by default all paths passed to both `buildURL` and `buildSrcSet` methods. To disable path encoding, pass `{ disablePathEncoding: true }` to the third argument `options` of `buildURL()` or `buildSrcSet()`.

```js
const client = new ImgixClient({
  domain: 'testing.imgix.net',
});

const src = client.buildURL(
  'file+with%20some+crazy?things.jpg',
  {},
  { disablePathEncoding: true },
);
console.log(src);

const srcset = client.buildSrcSet(
  'file+with%20some+crazy?things.jpg',
  {},
  { disablePathEncoding: true },
);
console.log(srcset);
```

Normally this would output a src of `https://sdk-test.imgix.net/file%2Bwith%2520some%2Bcrazy%3Fthings.jpg`, but since path encoding is disabled, it will output a src of `https://sdk-test.imgix.net/file+with%20some+crazy?things.jpg`.

### Web Proxy Sources

If you are using a [Web Proxy Source](https://docs.imgix.com/setup/creating-sources/web-proxy), all you need to do is pass the full image URL you would like to proxy to `@imgix/js-core` as the path, and include a `secureURLToken` when creating the client. `@imgix/js-core` will then encode this full URL into a format that imgix will understand, thus creating a proxy URL for you.

```js
import ImgixClient from '@imgix/js-core';

const client = new ImgixClient({
  domain: 'my-proxy-domain.imgix.net',
  secureURLToken: '<token>',
});

client.buildURL('https://example.com/image-to-proxy.jpg', {});
client.buildSrcSet('https://example.com/image-to-proxy.jpg', {});
```

## What is the `Ixlib` Param on Every Request?

For security and diagnostic purposes, we sign all requests with the language and version of library used to generate the URL.

This can be disabled by passing a falsy value for the `includeLibraryParam` option to `new ImgixClient`:

```js
new ImgixClient({
  domain: 'my-source.imgix.net',
  includeLibraryParam: false,
});
```

## Testing

@imgix/js-core uses mocha for testing. Here’s how to run those tests:

```bash
npm test
```

## License

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimgix%2Fimgix-core-js.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fimgix%2Fimgix-core-js?ref=badge_large)
