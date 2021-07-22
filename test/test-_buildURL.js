import assert from 'assert';
import ImgixClient from '../src/index.js';

describe('URL Builder:', function describeSuite() {
  describe('Calling _buildURL()', function describeSuite() {
    let client, params, url, options;

    beforeEach(function setupClient() {
      client = ImgixClient;
    });

    describe('on a full URL', function describeSuite() {
      url = 'https://assets.imgix.net/images/1.png';
      params = { h: 100 };
      options = { includeLibraryParam: false, useHTTPS: true };

      it('should return a URL with formatted imgix params', function testSpec() {
        const expectation = url + '?h=100';
        const result = client._buildURL(url, params, options);

        assert.strictEqual(result, expectation);
      });

      describe('that has no scheme', function describeSuite() {
        const url = 'assets.imgix.net/images/1.png';
        const params = {};
        const options = { includeLibraryParam: false, useHTTPS: true };

        it('should prepend the scheme to the returned URL', function testSpec() {
          const expectation = 'https://' + url;
          const result = client._buildURL(url, params, options);

          assert.strictEqual(result, expectation);
        });
      });

      describe('that has a proxy path', function describeSuite() {
        const url = 'https://assets.imgix.net/https://sdk-test/images/1.png';
        const params = {};
        const options = { includeLibraryParam: false, useHTTPS: true };

        it('should correctly encode the proxy path', function testSpec() {
          const expectation = new client({
            domain: 'assets.imgix.net',
            ...options,
          }).buildURL('https://sdk-test/images/1.png', params);
          const result = client._buildURL(url, params, options);

          assert.strictEqual(result, expectation);
        });
      });

      describe('that has a insecure source and secure proxy', function describeSuite() {
        const url =
          'http://assets.imgix.net/https://sdk-test.imgix.net/images/1.png';
        const params = {};
        const options = { includeLibraryParam: false, useHTTPS: false };

        it('should not modify the source or proxy schemes', function testSpec() {
          const expectation =
            'http://assets.imgix.net/https%3A%2F%2Fsdk-test.imgix.net%2Fimages%2F1.png';
          const result = client._buildURL(url, params, options);

          assert.strictEqual(result, expectation);
        });
      });

      describe('that has a secure source and insecure proxy', function describeSuite() {
        const url =
          'https://assets.imgix.net/http://sdk-test.imgix.net/images/1.png';
        const params = {};
        const options = { includeLibraryParam: false, useHTTPS: true };

        it('should not modify the source or proxy schemes', function testSpec() {
          const expectation =
            'https://assets.imgix.net/http%3A%2F%2Fsdk-test.imgix.net%2Fimages%2F1.png';
          const result = client._buildURL(url, params, options);

          assert.strictEqual(result, expectation);
        });
      });
    });

    describe('on a malformed URLs', function describeSuite() {
      const error = new Error(
        '_buildURL: URL must match {host}/{pathname}?{query}',
      );
      const params = {};
      const options = { includeLibraryParam: false, useHTTPS: true };

      it('should throw an error if no hostname', function testSpec() {
        const url = '/image.png';
        assert.throws(function () {
          client._buildURL(url, params, options);
        }, error);
      });

      it('should throw an error if no pathname', function testSpec() {
        const url = 'assets.imgix.net';
        assert.throws(function () {
          client._buildURL(url, params, options);
        }, error);
      });
    });

    describe('that has parameters in the URL', function describeSuite() {
      const url = 'https://assets.imgix.net/images/1.png?w=100&h=100';
      const params = { h: 200 };
      const options = { includeLibraryParam: false, useHTTPS: true };

      it('should overwrite url params with opts params', function testSpec() {
        const expectation = 'https://assets.imgix.net/images/1.png?w=100&h=200';
        const result = client._buildURL(url, params, options);

        assert.strictEqual(result, expectation);
      });

      it('includes an `ixlib` param if the `libraryParam` setting is truthy', function testSpec() {
        const url = 'https://assets.imgix.net/images/1.png?w=100&h=100';
        const params = { h: 200 };
        const options = {
          includeLibraryParam: false,
          useHTTPS: true,
          libraryParam: 'test',
        };
        const result = client._buildURL(url, params, options);
        assert(result.match(/ixlib=test/));
      });
    });
  });
});
