# imgix-core-js

imgix-core-js is an npm package that provides the common boilerplate for all imgix JavaScript-based functionality. This includes [imgix.js](https://github.com/imgix/imgix.js).

imgix-core-js adheres to the [imgix-blueprint](https://github.com/imgix/imgix-blueprint) for definitions of its functionality.

## Installing

```
npm install --save-dev imgix-core-js
```

## Using

Depending on your module system, using imgx-core-js is done a few different ways. The most common entry point will be the `Client` class.

### ES6 Modules

```javascript
import Client from "imgix/client";

let imgixClient = new Client('my-source-address.imgix.net', '<SECURE TOKEN>');
let url = imgixClient.path("/path/to/image.png").toString();
```

## ES6

imgix-core-js and its tests are written in ES6 JavaScript. [Babel](https://babeljs.io/) is used for transpilation into the `lib/` directory.

## Testing

imgix-core-js uses mocha for testing. Here’s how to run those tests:

```
npm test
```