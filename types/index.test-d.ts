import { expectType } from 'tsd';
import ImgixClient, { SrcSetOptions } from '.';

const expectedToken = 'MYT0KEN';
const client = new ImgixClient({
  domain: 'test.imgix.net',
  secureURLToken: expectedToken,
});
expectType<ImgixClient>(client);

const path = 'image.jpg';

expectType<string>(client.buildURL(path));

let params = {};
params = { w: 100 };

expectType<string>(client.buildURL(path, params));

const buildURLOptions = {
  disablePathEncoding: true,
};
params = {};
expectType<string>(client.buildURL('foo/bar/baz', params, buildURLOptions));

expectType<string>(client._sanitizePath(path));
expectType<string>(client._sanitizePath(path, { encode: false }));

expectType<string>(client._buildParams(params));

expectType<string>(client._signParams(path, params));

const srcsetOptions: SrcSetOptions = {
  widths: [100, 500, 1000],
  widthTolerance: 0.05,
  minWidth: 500,
  maxWidth: 2000,
  disableVariableQuality: false,
  devicePixelRatios: [1, 2],
  variableQualities: {
    1: 45,
    2: 30,
  },
  disablePathEncoding: true,
};

expectType<string>(client.buildSrcSet(path));
expectType<string>(client.buildSrcSet(path, params));
expectType<string>(client.buildSrcSet(path, params, srcsetOptions));

expectType<string>(client._buildSrcSetPairs(path));
expectType<string>(client._buildSrcSetPairs(path, params));
expectType<string>(client._buildSrcSetPairs(path, params, srcsetOptions));

expectType<string>(client._buildDPRSrcSet(path));
expectType<string>(client._buildDPRSrcSet(path, params));
expectType<string>(client._buildDPRSrcSet(path, params, srcsetOptions));

const minWidth = 200;
const maxWidth = 1000;
const widthTol = 0.05;
const cache = {};

expectType<number[]>(ImgixClient.targetWidths());
expectType<number[]>(ImgixClient.targetWidths(minWidth));
expectType<number[]>(ImgixClient.targetWidths(minWidth, maxWidth));
expectType<number[]>(ImgixClient.targetWidths(minWidth, maxWidth, widthTol));
expectType<number[]>(
  ImgixClient.targetWidths(minWidth, maxWidth, widthTol, cache),
);

const absoluteURL = 'https://test.imgix.net/image.jpg';

expectType<string>(ImgixClient._buildURL(absoluteURL, params, {}));
expectType<string>(ImgixClient._buildURL(absoluteURL, params, buildURLOptions));

expectType<string>(ImgixClient._buildSrcSet(absoluteURL));
expectType<string>(ImgixClient._buildSrcSet(absoluteURL, params));
expectType<string>(
  ImgixClient._buildSrcSet(absoluteURL, params, srcsetOptions),
);
