import ImgixClient from 'index';

const expectedToken = 'MYT0KEN';
// $ExpectType ImgixClient
const client = new ImgixClient({
  domain: 'test.imgix.net',
  secureURLToken: expectedToken,
});

const path = 'image.jpg';

// $ExpectType string
client.buildURL(path);

let params = {};
params = { w: 100 };

// $ExpectType string
client.buildURL(path, params);

params = {};
// $ExpectType string
client.buildURL('foo/bar/baz', params);

// $ExpectType string
client._sanitizePath(path);

// $ExpectType string
client._buildParams(params);

// let queryParams = {}
// queryParams = { foo: 'bar' };
// $ExpectType string
client._signParams(path, params);

const options = {
  widths: [100, 500, 1000],
  widthTolerance: 0.05,
  minWidth: 500,
  maxWidth: 2000,
  disableVariableQuality: false,
};

// $ExpectType string
client.buildSrcSet(path);
// $ExpectType string
client.buildSrcSet(path, params);
// $ExpectType string
client.buildSrcSet(path, params, options);

// $ExpectType string
client._buildSrcSetPairs(path);
// $ExpectType string
client._buildSrcSetPairs(path, params);
// $ExpectType string
client._buildSrcSetPairs(path, params, options);

// $ExpectType string
client._buildDPRSrcSet(path);
// $ExpectType string
client._buildDPRSrcSet(path, params);
// $ExpectType string
client._buildDPRSrcSet(path, params, options);

const minWidth = 200;
const maxWidth = 1000;
const widthTol = 0.05;
const cache = {};

// $ExpectType number[]
ImgixClient.targetWidths();
// $ExpectType number[]
ImgixClient.targetWidths(minWidth);
// $ExpectType number[]
ImgixClient.targetWidths(minWidth, maxWidth);
// $ExpectType number[]
ImgixClient.targetWidths(minWidth, maxWidth, widthTol);
// $ExpectType number[]
ImgixClient.targetWidths(minWidth, maxWidth, widthTol, cache);
