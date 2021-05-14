import ImgixClient, { SrcSetOptions } from 'index';

const expectedToken = 'MYT0KEN';
// $ExpectType ImgixClient
const client = new ImgixClient({
  domain: 'test.imgix.net',
  secureURLToken: expectedToken,
});

// $ExpectType string
client.buildURL("foo/bar")

let params = {}
params = { foo: 'bar' }

// $ExpectType string
client.buildURL("foo/bar", params)

params = {}
// $ExpectType string
client.buildURL('foo/bar/baz', params)

const path = "Krillin";
// $ExpectType string
client._sanitizePath(path);

// $ExpectType string
client._buildParams(params);

let queryParams = {}
queryParams = { foo: 'bar' };
// $ExpectType string
client._signParams(path, queryParams);

// buildSrcSet(path: string, params?: {}, options?: SrcSetOptions): string;
const options = {
  widths: [100],
  widthTolerance: 100,
  minWidth: 100,
  maxWidth: 100,
  disableVariableQuality: false,
}

// $ExpectType string
client.buildSrcSet(path)
// $ExpectType string
client.buildSrcSet(path, params)
// $ExpectType string
client.buildSrcSet(path, params, options)

// _buildSrcSetPairs(path: string, params?: {}, options?: SrcSetOptions): string;
// $ExpectType string
client._buildSrcSetPairs(path);
// $ExpectType string
client._buildSrcSetPairs(path, params);
// $ExpectType string
client._buildSrcSetPairs(path, params, options);

// _buildDPRSrcSet(path: string, params?: {}, options?: SrcSetOptions): string;
// $ExpectType string
client._buildDPRSrcSet(path)
// $ExpectType string
client._buildDPRSrcSet(path, params)
// $ExpectType string
client._buildDPRSrcSet(path, params, options)

// static targetWidths(minWidth?: number, maxWidth?: number, widthTolerance?: number, cache?: {}): number[];
const minWidth = 42;
const maxWidth = 42;
const widthTol = 42;
const cache = {};

// $ExpectType number[]
ImgixClient.targetWidths()
// $ExpectType number[]
ImgixClient.targetWidths(minWidth)
// $ExpectType number[]
ImgixClient.targetWidths(minWidth, maxWidth)
// $ExpectType number[]
ImgixClient.targetWidths(minWidth, maxWidth, widthTol)
// $ExpectType number[]
ImgixClient.targetWidths(minWidth, maxWidth, widthTol, cache)
