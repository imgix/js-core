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
  });
});
