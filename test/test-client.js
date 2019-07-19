var assert = require('assert');
var ImgixClient = require('../src/imgix-core-js');
var sinon = require('sinon');

describe('Imgix client:', function describeSuite() {
  describe('The constructor', function describeSuite() {
    it('initializes with correct defaults', function testSpec() {
      var client = new ImgixClient({ domain: 'my-host.imgix.net' });
      assert.equal("my-host.imgix.net", client.settings.domain);
      assert.equal(null, client.settings.secureURLToken);
      assert.equal(true, client.settings.useHTTPS);
    });

    it('initializes with a token', function testSpec() {
      var client = new ImgixClient({
        domain: 'my-host.imgix.net',
        secureURLToken: 'MYT0KEN'
      });
      assert.equal("my-host.imgix.net", client.settings.domain);
      assert.equal("MYT0KEN", client.settings.secureURLToken);
      assert.equal(true, client.settings.useHTTPS);
    });

    it('initializes in insecure mode', function testSpec() {
      var client = new ImgixClient({
        domain: 'my-host.imgix.net',
        secureURLToken: 'MYT0KEN',
        useHTTPS: false
      });
      assert.equal("my-host.imgix.net", client.settings.domain);
      assert.equal("MYT0KEN", client.settings.secureURLToken);
      assert.equal(false, client.settings.useHTTPS);
    });

    it('errors with invalid domain - appended slash', function testSpec() {
      assert.throws(function() {
        new ImgixClient({
          domain: 'my-host1.imgix.net/',
        })
      }, Error);
    });

    it('errors with invalid domain - prepended scheme ', function testSpec() {
      assert.throws(function() {
        new ImgixClient({
          domain: 'https://my-host1.imgix.net',
        })
      }, Error);
    });

    it('errors with invalid domain - appended dash ', function testSpec() {
      assert.throws(function() {
        new ImgixClient({
          domain: 'my-host1.imgix.net-',
        })
      }, Error);
    });

    it('accepts a single domain name', function testSpec() {
      var expectedUrl = 'https://my-host.imgix.net/image.jpg?ixlib=js-'+ImgixClient.VERSION;
      var client = new ImgixClient({ domain: 'my-host.imgix.net' });
      assert.equal("my-host.imgix.net", client.settings.domain);
      assert.equal(expectedUrl, client.buildURL('image.jpg'));
    });

    it('errors when domain is any non-string value', function testSpec() {
      assert.throws(function() {
        new ImgixClient({ domain: ['my-host.imgix.net', 'another-domain.imgix.net'] });
      }, Error);
    });

    it('errors when no domain is passed', function testSpec() {
      assert.throws(function() {
        new ImgixClient({});
      }, Error);
    });

  });

  describe('Calling _sanitizePath()', function describeSuite() {
    var client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'testing.imgix.net'
      });
    });

    describe('with a simple path', function describeSuite() {
      var path = 'images/1.png';

      it('prepends a leading slash', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns the same exact path', function testSpec() {
        var expectation = path,
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a path that contains a leading slash', function describeSuite() {
      var path = '/images/1.png';

      it('retains the leading slash', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns the same exact path', function testSpec() {
        var expectation = path.substr(1),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a path that contains unencoded characters', function describeSuite() {
      var path = 'images/"image 1".png';

      it('prepends a leading slash', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns the same path, except with the characters encoded properly', function testSpec() {
        var expectation = encodeURI(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a full HTTP URL', function describeSuite() {
      var path = 'http://example.com/images/1.png';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a full HTTPS URL', function describeSuite() {
      var path = 'https://example.com/images/1.png';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a full URL that contains a leading slash', function describeSuite() {
      var path = '/http://example.com/images/1.png';

      it('retains the leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path.substr(1)),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a full URL that contains encoded characters', function describeSuite() {
      var path = 'http://example.com/images/1.png?foo=%20';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });

      it('double-encodes the original encoded characters', function testSpec() {
        var expectation1 = -1,
            expectation2 = encodeURIComponent(path).length - 4;
            result = client._sanitizePath(path);

        // Result should not contain the string "%20"
        assert.equal(expectation1, result.indexOf('%20'));

        // Result should instead contain the string "%2520"
        assert.equal(expectation2, result.indexOf('%2520'));
      });
    });
  });

  describe('Calling _buildParams()', function describeSuite() {
    var client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false
      });
    });

    it('returns an empty string if no parameters are given', function testSpec() {
      var params = {},
          expectation = '',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('returns a properly-formatted query string if a single parameter is given', function testSpec() {
      var params = {
              w: 400
            },
          expectation = '?w=400',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('returns a properly-formatted query string if multiple parameters are given', function testSpec() {
      var params = {
              w: 400,
              h: 300
            },
          expectation = '?w=400&h=300',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('includes an `ixlib` param if the `libraryParam` setting is truthy', function testSpec() {
      var params = {
              w: 400
            },
          expectation = '?w=400&ixlib=test',
          result;

      client.settings.libraryParam = 'test';

      result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('url-encodes parameter keys properly', function testSpec() {
      var params = {
              'w$': 400
            },
          expectation = '?w%24=400',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('url-encodes parameter values properly', function testSpec() {
      var params = {
              w: '$400'
            },
          expectation = '?w=%24400',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('base64-encodes parameter values whose keys end in `64`', function testSpec() {
      var params = {
              txt64: 'lorem ipsum'
            },
          expectation = '?txt64=bG9yZW0gaXBzdW0',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });
  });

  describe('Calling _signParams()', function describeSuite() {
    var client,
        path = 'images/1.png';

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'testing.imgix.net',
        secureURLToken: 'MYT0KEN',
        includeLibraryParam: false
      });
    });

    it('returns a query string containing only a proper signature parameter, if no other query parameters are provided', function testSpec() {
      var expectation = '?s=6d82410f89cc6d80a6aa9888dcf85825',
          result = client._signParams(path, '');

      assert.equal(expectation, result);
    });

    it('returns a query string with a proper signature parameter appended, if other query parameters are provided', function testSpec() {
      var expectation = '?w=400&s=990916ef8cc640c58d909833e47f6c31',
          result = client._signParams(path, '?w=400');

      assert.equal(expectation, result);
    });
  });

  describe('Calling buildSrcSet()', function describeSuite() {
    describe('width descriptor mode', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg');
      
      it('returns the expected number of `url widthDescriptor` pairs', function testSpec() {
        assert.equal(srcset.split(',').length,31);
      });
      it('should not exceed the bounds of [100, 8192]', function testSpec() {
        var srcsetSplit = srcset.split(",");
        var min = Number.parseFloat(
          srcsetSplit[0]
          .split(" ")[1]
          .slice(0, -1)
        );
        var max = Number.parseFloat(
          srcsetSplit[srcsetSplit.length-1]
          .split(" ")[1]
          .slice(0, -1)
        );
        assert(min >= 100);
        assert(max <= 8192);
      });
      it('should not increase more than 18% every iteration', function testSpec() {
        var INCREMENT_ALLOWED = 0.18;
        
        var srcsetWidths = function() {
          return srcset.split(",")
          .map(function (srcsetSplit) {
            return srcsetSplit.split(" ")[1];
          })
          .map(function (width) {
            return width.slice(0, -1);
          })
          .map(Number.parseFloat)
        }();

        let prev = srcsetWidths[0];

        for (let index = 1; index < srcsetWidths.length; index++) {
          var element = srcsetWidths[index];
          assert((element / prev) < (1 + INCREMENT_ALLOWED));
          prev = element;
        }
      });
      it('should correctly sign each URL', function testSpec() {
        srcset.split(",")
        .map(function (srcsetSplit) {
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          assert(src.includes("s="));
        });
      });
    });

    describe('DPR mode', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg', {w:'800',h:'300'});

      it('srcSet should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
        assert(srcset.split(",").length == 5);

        var devicePixelRatios = srcset.split(",")
        .map(function (srcsetSplit){
          return srcsetSplit.split(" ")[1];
        })
        
        assert(devicePixelRatios[0] == '1x');
        assert(devicePixelRatios[1] == '2x');
        assert(devicePixelRatios[2] == '3x');
        assert(devicePixelRatios[3] == '4x');
        assert(devicePixelRatios[4] == '5x');
      });
      it('should correctly sign each URL', function testSpec() {
        srcset.split(",")
        .map(function (srcsetSplit) {
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          assert(src.includes("s="));
        });
      });
    });
  });
});
