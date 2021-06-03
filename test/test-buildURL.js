import assert from 'assert';
import ImgixClient from '../src/index.js';

describe('URL Builder:', function describeSuite() {
  describe('Calling _sanitizePath()', function describeSuite() {
    let client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'testing.imgix.net',
      });
    });

    describe('with a simple path', function describeSuite() {
      const path = 'images/1.png';

      it('prepends a leading slash', function testSpec() {
        const expectation = '/';
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(0, 1), expectation);
      });

      it('otherwise returns the same exact path', function testSpec() {
        const expectation = path;
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a path that contains a leading slash', function describeSuite() {
      const path = '/images/1.png';

      it('retains the leading slash', function testSpec() {
        const expectation = '/';
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(0, 1), expectation);
      });

      it('otherwise returns the same exact path', function testSpec() {
        const expectation = path.substring(1);
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a path that contains unencoded characters', function describeSuite() {
      const path = 'images/"image 1".png';

      it('prepends a leading slash', function testSpec() {
        const expectation = '/';
        const result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(0, 1));
      });

      it('otherwise returns the same path, except with the characters encoded properly', function testSpec() {
        const expectation = encodeURI(path);
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a path that contains a hash character', function describeSuite() {
      const path = '#blessed.png';

      it('properly encodes the hash character', function testSpec() {
        const expectation = path.replace(/^#/, '%23');
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a path that contains a question mark', function describeSuite() {
      const path = '?what.png';

      it('properly encodes the question mark', function testSpec() {
        const expectation = path.replace(/^\?/, '%3F');
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a path that contains a colon', function describeSuite() {
      const path = ':emoji.png';

      it('properly encodes the colon', function testSpec() {
        const expectation = path.replace(/^\:/, '%3A');
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a full HTTP URL', function describeSuite() {
      const path = 'http://example.com/images/1.png';

      it('prepends a leading slash, unencoded', function testSpec() {
        const expectation = '/';
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(0, 1), expectation);
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        const expectation = encodeURIComponent(path);
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a full HTTPS URL', function describeSuite() {
      const path = 'https://example.com/images/1.png';

      it('prepends a leading slash, unencoded', function testSpec() {
        const expectation = '/';
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(0, 1), expectation);
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        const expectation = encodeURIComponent(path);
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a full URL that contains a leading slash', function describeSuite() {
      const path = '/http://example.com/images/1.png';

      it('retains the leading slash, unencoded', function testSpec() {
        const expectation = '/';
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(0, 1), expectation);
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        const expectation = encodeURIComponent(path.substring(1));
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });
    });

    describe('with a full URL that contains encoded characters', function describeSuite() {
      const path = 'http://example.com/images/1.png?foo=%20';

      it('prepends a leading slash, unencoded', function testSpec() {
        const expectation = '/';
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(0, 1), expectation);
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        const expectation = encodeURIComponent(path);
        const result = client._sanitizePath(path);

        assert.strictEqual(result.substring(1), expectation);
      });

      it('double-encodes the original encoded characters', function testSpec() {
        const expectation1 = -1;
        const expectation2 = encodeURIComponent(path).length - 4;
        const result = client._sanitizePath(path);

        // Result should not contain the string "%20"
        assert.strictEqual(result.indexOf('%20'), expectation1);

        // Result should instead contain the string "%2520"
        assert.strictEqual(result.indexOf('%2520'), expectation2);
      });
    });
  });

  describe('Calling _buildParams()', function describeSuite() {
    let client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
      });
    });

    it('returns an empty string if no parameters are given', function testSpec() {
      const params = {};
      const expectation = '';
      const result = client._buildParams(params);

      assert.strictEqual(result, expectation);
    });

    it('returns a properly-formatted query string if a single parameter is given', function testSpec() {
      const params = { w: 400 };
      const expectation = '?w=400';
      const result = client._buildParams(params);

      assert.strictEqual(result, expectation);
    });

    it('returns a properly-formatted query string if multiple parameters are given', function testSpec() {
      const params = { w: 400, h: 300 };
      const expectation = '?w=400&h=300';
      const result = client._buildParams(params);

      assert.strictEqual(result, expectation);
    });

    it('does not modify its input-argument', function testSpec() {
      const emptyParams = {};
      const emptyResult = client._buildParams(emptyParams);

      assert.strictEqual(Object.keys(emptyParams).length, 0);
    });

    it('includes an `ixlib` param if the `libraryParam` setting is truthy', function testSpec() {
      client.settings.libraryParam = 'test';
      const result = client._buildParams({});
      assert(result.match(/ixlib=test/));
    });

    it('url-encodes parameter keys properly', function testSpec() {
      const params = { w$: 400 };
      const expectation = '?w%24=400';
      const result = client._buildParams(params);

      assert.strictEqual(result, expectation);
    });

    it('url-encodes parameter values properly', function testSpec() {
      const params = { w: '$400' };
      const expectation = '?w=%24400';
      const result = client._buildParams(params);

      assert.strictEqual(result, expectation);
    });

    it('base64-encodes parameter values whose keys end in `64`', function testSpec() {
      const params = { txt64: 'lorem ipsum' };
      const expectation = '?txt64=bG9yZW0gaXBzdW0';
      const result = client._buildParams(params);

      assert.strictEqual(result, expectation);
    });
  });

  describe('Calling _signParams()', function describeSuite() {
    let client;
    const path = 'images/1.png';

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'testing.imgix.net',
        secureURLToken: 'MYT0KEN',
        includeLibraryParam: false,
      });
    });

    it('returns a query string containing only a proper signature parameter, if no other query parameters are provided', function testSpec() {
      const expectation = '?s=6d82410f89cc6d80a6aa9888dcf85825';
      const result = client._signParams(path, '');

      assert.strictEqual(result, expectation);
    });

    it('returns a query string with a proper signature parameter appended, if other query parameters are provided', function testSpec() {
      const expectation = '?w=400&s=990916ef8cc640c58d909833e47f6c31';
      const result = client._signParams(path, '?w=400');

      assert.strictEqual(result, expectation);
    });
  });

  describe('Calling buildURL()', function describeSuite() {
    let client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'test.imgix.net',
        includeLibraryParam: false,
      });
    });

    it('is an idempotent operation with empty args', function testSpec() {
      const result1 = client.buildURL('', {});
      const result2 = client.buildURL('', {});

      assert.strictEqual(result1, result2);
    });

    it('is an idempotent operation with args', function testSpec() {
      const path = '/image/stöked.png';
      const params = { w: 100 };
      const result1 = client.buildURL(path, params);
      const result2 = client.buildURL(path, params);
      const expected = 'https://test.imgix.net/image/st%C3%B6ked.png?w=100';

      assert.strictEqual(result1, expected);
      assert.strictEqual(result2, expected);
    });

    it('does not modify empty args', function testSpec() {
      const path = '';
      const params = {};
      const result1 = client.buildURL(path, params);
      const result2 = client.buildURL(path, params);
      const expected = 'https://test.imgix.net/';

      assert.strictEqual(path, '');
      assert.strictEqual(expected, result1);
      assert.strictEqual(expected, result2);

      assert.strictEqual(Object.keys(params).length, 0);
      assert.strictEqual(params.constructor, Object);
    });

    it('does not modify its args', function testSpec() {
      const path = 'image/1.png';
      const params = { w: 100 };
      const result1 = client.buildURL(path, params);
      const result2 = client.buildURL(path, params);
      const expected = 'https://test.imgix.net/image/1.png?w=100';

      assert.strictEqual(path, 'image/1.png');
      assert.strictEqual(result1, result2, expected);
      assert.strictEqual(params.w, 100);

      assert.strictEqual(Object.keys(params).length, 1);
      assert.strictEqual(params.constructor, Object);
    });

    it('correctly encodes plus signs (+) in paths', function testSpec() {
      const actual = client.buildURL('&$+,:;=?@#.jpg', {});
      const expected = 'https://test.imgix.net/&$%2B,%3A;=%3F@%23.jpg';

      assert.strictEqual(actual, expected);
    });

    it('should not include undefined parameters in url', function testSpect() {
      const actual = client.buildURL('test.jpg', { ar: undefined, txt: null });
      assert(!actual.includes('ar=undefined'));
      assert(!actual.includes('ar=null'));
      assert(!actual.includes('txt=undefined'));
      assert(!actual.includes('txt=null'));
    });
  });
});
