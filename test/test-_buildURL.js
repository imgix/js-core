import assert from 'assert';
import ImgixClient from '../src/index.js';

describe('URL Builder:', function describeSuite() {
  describe('Calling _buildURL()', function describeSuite() {
    let client, params, url, options;

    beforeEach(function setupClient() {
      client = ImgixClient;
    });

    describe('on a one-step URL', function describeSuite() {
      url = 'https://assets.imgix.net/images/1.png';
      params = { h: 100 };
      options = { includeLibraryParam: false, useHTTPS: true };

      it('should return a URL with formatted imgix params', function testSpec() {
        const expectation = url + '?h=100';
        const result = client._buildURL({
          url,
          params,
          options,
        });

        assert.strictEqual(result, expectation);
      });

      it('should sanitize the URL path if sanitize option present', function testSpec() {
        url = 'https://sdk-test.imgix.net/]!“#$%&‘()*+,-./:;<=>?@[]^_`{|}~.jpg';
        options = { sanitize: true, includeLibraryParam: false };
        params = {};
        const expectation =
          'https://sdk-test.imgix.net/%5D!%E2%80%9C%23$%25&%E2%80%98()*%2B,-./%3A;%3C=%3E%3F@%5B%5D%5E_%60%7B%7C%7D~.jpg';
        const result = client._buildURL({
          url,
          params,
          options,
        });
        assert.strictEqual(result, expectation);
      });

      describe('that has no scheme', function describeSuite() {
        const url = 'assets.imgix.net/images/1.png';
        const params = { h: 100 };
        const options = { includeLibraryParam: false, useHTTPS: true };

        it('should prepend the scheme to the returned URL', function testSpec() {
          const expectation = 'https://' + url + '?h=100';
          const result = client._buildURL({
            url,
            params,
            options,
          });

          assert.strictEqual(result, expectation);
        });
      });
    });

    describe('on a malformed URLs', function describeSuite() {
      const error = new Error(
        '_buildURL: URL must match {host}/{path}?{query}',
      );
      const params = {};
      const options = { includeLibraryParam: false, useHTTPS: true };

      it('should throw an error if no hostname', function testSpec() {
        const url = '/image.png';
        assert.throws(function () {
          client._buildURL({
            url,
            params,
            options,
          });
        }, error);
      });

      it('should throw an error if no pathname', function testSpec() {
        const url = 'assets.imgix.net';
        assert.throws(function () {
          client._buildURL({
            url,
            params,
            options,
          });
        }, error);
      });
    });
  });
});
