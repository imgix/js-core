# imgix-core-js

imgix-core-js is an npm package that provides the common boilerplate for imgix server-side JavaScript-based functionality. For client-side imgix functionality, please see [imgix.js](https://www.imgix.com/imgix-js).

imgix-core-js adheres to the [imgix-blueprint](https://github.com/imgix/imgix-blueprint) for definitions of its functionality.

## Installing

```
npm install --save imgix-core-js
```

## ES6

imgix-core-js and its tests are written in ES6 JavaScript. [Babel](https://babeljs.io/) is used for transpilation into the `lib/` directory.

## Using

Depending on your module system, using imgx-core-js is done a few different ways. The most common entry point will be the `Client` class.

### CommonJS

```javascript
var ImgixClient = require('imgix-core-js');

var client = new ImgixClient("my-social-network.imgix.net", "<SECURE TOKEN>");
var url = client.path("/path/to/image.png").toUrl({ w: 400, h: 300 }).toString();
console.log(url); // => "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=…"
```

### ES6 Modules

```javascript
import Client from "imgix/client";

let imgixClient = new Client("my-social-network.imgix.net", "<SECURE TOKEN>"");
let url = imgixClient.path("/path/to/image.png").toUrl({ w: 400, h: 300 }).toString();
console.log(url) // => "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=…"
```

## Testing

imgix-core-js uses mocha for testing. Here’s how to run those tests:

```
npm test
```
