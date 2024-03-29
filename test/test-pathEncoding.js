import assert from 'assert';
import ImgixClient from '../src/index.js';

describe('Path Encoding:', function describeSuite() {
  // NOTE: the image urls tested bellow actually resolve to an image.
  describe('buildURL', function describeSuite() {
    let client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'sdk-test.imgix.net',
        includeLibraryParam: false,
      });
    });

    it('correctly encodes reserved delimiters', function testSpec() {
      const actual = client.buildURL(' <>[]{}|\\^%.jpg', {});
      const expected =
        'https://sdk-test.imgix.net/%20%3C%3E%5B%5D%7B%7D%7C%5C%5E%25.jpg';

      assert.strictEqual(actual, expected);
    });

    it('correctly encodes reserved characters', function testSpec() {
      const actual = client.buildURL('&$+,:;=?@#.jpg', {});
      const expected = 'https://sdk-test.imgix.net/&$%2B,%3A;=%3F@%23.jpg';

      assert.strictEqual(actual, expected);
    });

    it('correctly encodes UNICODE characters', function testSpec() {
      const actual = client.buildURL('/ساندویچ.jpg', {});
      const expected =
        'https://sdk-test.imgix.net/%D8%B3%D8%A7%D9%86%D8%AF%D9%88%DB%8C%DA%86.jpg';

      assert.strictEqual(actual, expected);
    });

    it('passes through a path unencoded if disablePathEncoding is set', () => {
      const actual = client.buildURL(
        '/file+with%20some+crazy?things.jpg',
        {},
        {
          disablePathEncoding: true,
        },
      );

      const expected =
        'https://sdk-test.imgix.net/file+with%20some+crazy?things.jpg';
      assert.strictEqual(actual, expected);
    });
    it('prepends / to path when disablePathEncoding is set', () => {
      const actual = client.buildURL(
        'file+with%20some+crazy?things.jpg',
        {},
        {
          disablePathEncoding: true,
        },
      );

      const expected =
        'https://sdk-test.imgix.net/file+with%20some+crazy?things.jpg';
      assert(actual.includes(expected), 'srcset should include expected url');
    });
    it('signs a pre-encoded path correctly', () => {
      const client = new ImgixClient({
        domain: 'sdk-test.imgix.net',
        secureURLToken: 'abcde1234',
        includeLibraryParam: false,
      });
      const actual = client.buildURL(
        'file+with%20some+crazy%20things.jpg',
        {},
        {
          disablePathEncoding: true,
        },
      );

      // The signing param for this URL was taken from a known working implementation
      const expected =
        'https://sdk-test.imgix.net/file+with%20some+crazy%20things.jpg?s=4aadfc1a58f27729a41d05831c52116f';
      assert.strictEqual(actual, expected);
    });
  });
  describe('buildSrcSet', () => {
    let client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'sdk-test.imgix.net',
        includeLibraryParam: false,
      });
    });
    it('passes through a path unencoded for a fixed srcset if disablePathEncoding is set', () => {
      const actual = client.buildSrcSet(
        '/file+with%20some+crazy?things.jpg',
        {
          w: 100,
        },
        {
          disablePathEncoding: true,
        },
      );

      const expected =
        'https://sdk-test.imgix.net/file+with%20some+crazy?things.jpg';
      assert(actual.includes(expected), 'srcset should include expected url');
    });
    it('passes through a path unencoded for a fixed srcset if disablePathEncoding and disableVariableQuality is set', () => {
      const actual = client.buildSrcSet(
        '/file+with%20some+crazy?things.jpg',
        {
          w: 100,
        },
        {
          disablePathEncoding: true,
          disableVariableQuality: true,
        },
      );

      const expected =
        'https://sdk-test.imgix.net/file+with%20some+crazy?things.jpg';
      assert(actual.includes(expected), 'srcset should include expected url');
    });
    it('passes through a path unencoded for a fluid srcset if disablePathEncoding is set', () => {
      const actual = client.buildSrcSet(
        '/file+with%20some+crazy?things.jpg',
        {},
        {
          disablePathEncoding: true,
        },
      );

      const expected =
        'https://sdk-test.imgix.net/file+with%20some+crazy?things.jpg';
      assert(actual.includes(expected), 'srcset should include expected url');
    });
    it('prepends / to path when disablePathEncoding is set', () => {
      const actual = client.buildSrcSet(
        'file+with%20some+crazy?things.jpg',
        {},
        {
          disablePathEncoding: true,
        },
      );

      const expected =
        'https://sdk-test.imgix.net/file+with%20some+crazy?things.jpg';
      assert(actual.includes(expected), 'srcset should include expected url');
    });
    it('signs a pre-encoded path correctly', () => {
      const client = new ImgixClient({
        domain: 'sdk-test.imgix.net',
        secureURLToken: 'abcde1234',
        includeLibraryParam: false,
      });
      const actual = client.buildSrcSet(
        'file+with%20some+crazy%20things.jpg',
        {},
        {
          disablePathEncoding: true,
        },
      );

      // The signing param for this URL was taken from a known working implementation
      const expected = '524748753f8aa52fb41b9359f79c3188';
      const firstURLSignature = new URL(
        actual.split(',')[0].split(' ')[0],
      ).searchParams.get('s');
      assert.strictEqual(firstURLSignature, expected);
    });
  });
});
