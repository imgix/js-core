var assert = require('assert');
var ImgixClient = require('../src/imgix-core-js');
var sinon = require('sinon');
var md5 = require("md5");

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

        assert.equal(expectation, result.substring(0, 1));
      });

      it('otherwise returns the same exact path', function testSpec() {
        var expectation = path,
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a path that contains a leading slash', function describeSuite() {
      var path = '/images/1.png';

      it('retains the leading slash', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(0, 1));
      });

      it('otherwise returns the same exact path', function testSpec() {
        var expectation = path.substring(1),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a path that contains unencoded characters', function describeSuite() {
      var path = 'images/"image 1".png';

      it('prepends a leading slash', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(0, 1));
      });

      it('otherwise returns the same path, except with the characters encoded properly', function testSpec() {
        var expectation = encodeURI(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a path that contains a hash character', function describeSuite() {
      var path = '#blessed.png';

      it('properly encodes the hash character', function testSpec() {
        var expectation = path.replace(/^#/, '%23'),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a path that contains a question mark', function describeSuite() {
      var path = '?what.png';

      it('properly encodes the question mark', function testSpec() {
        var expectation = path.replace(/^\?/, '%3F'),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a path that contains a colon', function describeSuite() {
      var path = ':emoji.png';

      it('properly encodes the colon', function testSpec() {
        var expectation = path.replace(/^\:/, '%3A'),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a full HTTP URL', function describeSuite() {
      var path = 'http://example.com/images/1.png';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a full HTTPS URL', function describeSuite() {
      var path = 'https://example.com/images/1.png';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a full URL that contains a leading slash', function describeSuite() {
      var path = '/http://example.com/images/1.png';

      it('retains the leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path.substring(1)),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
      });
    });

    describe('with a full URL that contains encoded characters', function describeSuite() {
      var path = 'http://example.com/images/1.png?foo=%20';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substring(1));
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
    describe('with no parameters', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg');
      
      it('should generate the expected default srcset pair values', function testSpec(){
        resolutions = [100, 116, 134, 156, 182, 210, 244, 282,
                       328, 380, 442, 512, 594, 688, 798, 926,
                       1074, 1246, 1446, 1678, 1946, 2258, 2618,
                       3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
        srclist = srcset.split(",");
        src = srclist.map(function (srcline){
          return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
        })

        for (var i = 0; i < srclist.length; i++) {
          assert.equal(src[i], resolutions[i]);
        }
      });

      it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
        assert.equal(srcset.split(',').length, 31);
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

      // a 17% testing threshold is used to account for rounding
      it('should not increase more than 17% every iteration', function testSpec() {
        var INCREMENT_ALLOWED = 0.17;
        
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
        var path = '/image.jpg';
        var param, signatureBase, expected_signature;
  
        srcset.split(",")
        .map(function (srcsetSplit) {
          // split the url portion of each srcset entry
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          // asserts that the expected 's=' parameter is being generated per entry
          assert(src.includes("s="));
          
          // param will have all params except for '&s=...'
          param = src.slice(src.indexOf('?'), src.length);
          param = param.slice(0, param.indexOf('s=')-1);
          generated_signature = src.slice(src.indexOf('s=')+2, src.length)
          signatureBase = 'MYT0KEN' + path + param;
          expected_signature = md5(signatureBase);
          
          assert.equal(expected_signature, generated_signature);
        });
      });
    });

    describe('with a width parameter provided', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg', {w:100});

      it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
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
        var path = '/image.jpg';
        var param, signatureBase, expected_signature;

        srcset.split(",")
        .map(function (srcsetSplit) {
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          // asserts that the expected 's=' parameter is being generated per entry
          assert(src.includes("s="));
          
          // param will have all params except for '&s=...'
          param = src.slice(src.indexOf('?'), src.indexOf('s=')-1);
          generated_signature = src.slice(src.indexOf('s=')+2, src.length)
          signatureBase = 'MYT0KEN' + path + param;
          expected_signature = md5(signatureBase);
          
          assert.equal(expected_signature, generated_signature);
        });
      });

      it('should include a dpr param per specified src', function testSpec() {
        
        srclist = srcset.split(",");
        for(var i = 0; i < srclist.length; i++)
        {
          src = srclist[i].split(" ")[0];
          assert(src.includes(`dpr=${i+1}`));
        }
      });
    });

    describe('with a height parameter provided', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg', {h:100});

      it('should generate the expected default srcset pair values', function testSpec(){
        resolutions = [100, 116, 134, 156, 182, 210, 244, 282,
                       328, 380, 442, 512, 594, 688, 798, 926,
                       1074, 1246, 1446, 1678, 1946, 2258, 2618,
                       3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
        srclist = srcset.split(",");
        src = srclist.map(function (srcline){
          return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
        })

        for (var i = 0; i < srclist.length; i++) {
          assert.equal(src[i], resolutions[i]);
        }
      });

      it('should respect the height parameter', function testSpec(){
        srcset.split(',').map(function (src) {
          assert(src.includes('h='));
        });
      });

      it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
        assert.equal(srcset.split(',').length, 31);
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

      // a 17% testing threshold is used to account for rounding
      it('should not increase more than 17% every iteration', function testSpec() {
        var INCREMENT_ALLOWED = 0.17;
        
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
        var path = '/image.jpg';
        var param, signatureBase, expected_signature;
  
        srcset.split(",")
        .map(function (srcsetSplit) {
          // split the url portion of each srcset entry
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          // asserts that the expected 's=' parameter is being generated per entry
          assert(src.includes("s="));
          
          // param will have all params except for '&s=...'
          param = src.slice(src.indexOf('?'), src.length);
          param = param.slice(0, param.indexOf('s=')-1);
          generated_signature = src.slice(src.indexOf('s=')+2, src.length)
          signatureBase = 'MYT0KEN' + path + param;
          expected_signature = md5(signatureBase);
          
          assert.equal(expected_signature, generated_signature);
        });
      });
    });

    describe('with a width and height parameter provided', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg', {w:100,h:100});

      it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
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
        var path = '/image.jpg';
        var param, signatureBase, expected_signature;
  
        srcset.split(",")
        .map(function (srcsetSplit) {
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          // asserts that the expected 's=' parameter is being generated per entry
          assert(src.includes("s="));
          
          // param will have all params except for '&s=...'
          param = src.slice(src.indexOf('?'), src.indexOf('s=')-1);
          generated_signature = src.slice(src.indexOf('s=')+2, src.length)
          signatureBase = 'MYT0KEN' + path + param;
          expected_signature = md5(signatureBase);
          
          assert.equal(expected_signature, generated_signature);
        });
      });

      it('should include a dpr param per specified src', function testSpec() {
        
        srclist = srcset.split(",");
        for(var i = 0; i < srclist.length; i++)
        {
          src = srclist[i].split(" ")[0];
          assert(src.includes(`dpr=${i+1}`));
        }
      });
    });

    describe('with an aspect ratio parameter provided', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg',{ar:'3:2'});

      it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
        assert.equal(srcset.split(',').length, 31);
      });

      it('should generate the expected default srcset pair values', function testSpec(){
        resolutions = [100, 116, 134, 156, 182, 210, 244, 282,
                       328, 380, 442, 512, 594, 688, 798, 926,
                       1074, 1246, 1446, 1678, 1946, 2258, 2618,
                       3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
        srclist = srcset.split(",");
        src = srclist.map(function (srcline){
          return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
        })

        for (var i = 0; i < srclist.length; i++) {
          assert.equal(src[i], resolutions[i]);
        }
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

      // a 17% testing threshold is used to account for rounding
      it('should not increase more than 17% every iteration', function testSpec() {
        var INCREMENT_ALLOWED = 0.17;
        
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
        var path = '/image.jpg';
        var param, signatureBase, expected_signature;
  
        srcset.split(",")
        .map(function (srcsetSplit) {
          // split the url portion of each srcset entry
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          // asserts that the expected 's=' parameter is being generated per entry
          assert(src.includes("s="));
          
          // param will have all params except for '&s=...'
          param = src.slice(src.indexOf('?'), src.length);
          param = param.slice(0, param.indexOf('s=')-1);
          generated_signature = src.slice(src.indexOf('s=')+2, src.length)
          signatureBase = 'MYT0KEN' + path + param;
          expected_signature = md5(signatureBase);
          
          assert.equal(expected_signature, generated_signature);
        });
      });
    });

    describe('with a width and aspect ratio parameter provided', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg', {w:100,ar:'3:2'});

      it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
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
        var path = '/image.jpg';
        var param, signatureBase, expected_signature;
  
        srcset.split(",")
        .map(function (srcsetSplit) {
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          // asserts that the expected 's=' parameter is being generated per entry
          assert(src.includes("s="));
          
          // param will have all params except for '&s=...'
          param = src.slice(src.indexOf('?'), src.indexOf('s=')-1);
          generated_signature = src.slice(src.indexOf('s=')+2, src.length)
          signatureBase = 'MYT0KEN' + path + param;
          expected_signature = md5(signatureBase);
          
          assert.equal(expected_signature, generated_signature);
        });
      });

      it('should include a dpr param per specified src', function testSpec() {
        
        srclist = srcset.split(",");
        for(var i = 0; i < srclist.length; i++)
        {
          src = srclist[i].split(" ")[0];
          assert(src.includes(`dpr=${i+1}`));
        }
      });
    });

    describe('with a height and aspect ratio parameter provided', function describeSuite() {
      var srcset = new ImgixClient({
        domain: 'testing.imgix.net',
        includeLibraryParam: false,
        secureURLToken: 'MYT0KEN'
      }).buildSrcSet('image.jpg', {h:100,ar:'3:2'});

      it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
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
        var path = '/image.jpg';
        var param, signatureBase, expected_signature;
  
        srcset.split(",")
        .map(function (srcsetSplit) {
          return srcsetSplit.split(" ")[0];
        }).map(function (src) {
          // asserts that the expected 's=' parameter is being generated per entry
          assert(src.includes("s="));
          
          // param will have all params except for '&s=...'
          param = src.slice(src.indexOf('?'), src.indexOf('s=')-1);
          generated_signature = src.slice(src.indexOf('s=')+2, src.length)
          signatureBase = 'MYT0KEN' + path + param;
          expected_signature = md5(signatureBase);
          
          assert.equal(expected_signature, generated_signature);
        });
      });

      it('should include a dpr param per specified src', function testSpec() {
        
        srclist = srcset.split(",");
        for(var i = 0; i < srclist.length; i++)
        {
          src = srclist[i].split(" ")[0];
          assert(src.includes(`dpr=${i+1}`));
        }
      });
    });
  });
});
