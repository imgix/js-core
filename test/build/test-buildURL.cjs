'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var assert = _interopDefault(require('assert'));
var md5 = _interopDefault(require('md5'));
var jsBase64 = require('js-base64');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// package version used in the ix-lib parameter
var VERSION = '2.3.2'; // regex pattern used to determine if a domain is valid

var DOMAIN_REGEX = /^(?:[a-z\d\-_]{1,62}\.){0,125}(?:[a-z\d](?:\-(?=\-*[a-z\d])|[a-z]|\d){0,62}\.)[a-z\d]{1,63}$/i; // minimum generated srcset width

var MIN_SRCSET_WIDTH = 100; // maximum generated srcset width

var MAX_SRCSET_WIDTH = 8192; // default tolerable percent difference between srcset pair widths

var DEFAULT_SRCSET_WIDTH_TOLERANCE = .08; // default quality parameter values mapped by each dpr srcset entry

var DPR_QUALITIES = {
  1: 75,
  2: 50,
  3: 35,
  4: 23,
  5: 20
};
var DEFAULT_OPTIONS = {
  domain: null,
  useHTTPS: true,
  includeLibraryParam: true,
  urlPrefix: 'https://',
  secureURLToken: null
};

function validateAndDestructureOptions(options) {
  var widthTolerance;

  if (options.widthTolerance !== undefined) {
    validateWidthTolerance(options.widthTolerance);
    widthTolerance = options.widthTolerance;
  } else {
    widthTolerance = DEFAULT_SRCSET_WIDTH_TOLERANCE;
  }

  var minWidth = options.minWidth === undefined ? MIN_SRCSET_WIDTH : options.minWidth;
  var maxWidth = options.maxWidth === undefined ? MAX_SRCSET_WIDTH : options.maxWidth; // Validate the range unless we're using defaults for both

  if (minWidth != MIN_SRCSET_WIDTH || maxWidth != MAX_SRCSET_WIDTH) {
    validateRange(minWidth, maxWidth);
  }

  return [widthTolerance, minWidth, maxWidth];
}
function validateRange(min, max) {
  if (!(Number.isInteger(min) && Number.isInteger(max)) || min <= 0 || max <= 0 || min > max) {
    throw new Error('The min and max srcset widths can only be passed positive Number values');
  }
}
function validateWidthTolerance(widthTolerance) {
  if (typeof widthTolerance != 'number' || widthTolerance <= 0) {
    throw new Error('The srcset widthTolerance argument can only be passed a positive scalar number');
  }
}
function validateWidths(customWidths) {
  if (!Array.isArray(customWidths) || !customWidths.length) {
    throw new Error('The widths argument can only be passed a valid non-empty array of integers');
  } else {
    var allPositiveIntegers = customWidths.every(function (width) {
      return Number.isInteger(width) && width > 0;
    });

    if (!allPositiveIntegers) {
      throw new Error('A custom widths argument can only contain positive integer values');
    }
  }
}
function validateVariableQuality(disableVariableQuality) {
  if (typeof disableVariableQuality != 'boolean') {
    throw new Error('The disableVariableQuality argument can only be passed a Boolean value');
  }
}

var ImgixClient = /*#__PURE__*/function () {
  function ImgixClient() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ImgixClient);

    var settings = Object.assign({}, DEFAULT_OPTIONS);
    this.settings = Object.assign(settings, opts); // a cache to store memoized srcset width-pairs

    this.targetWidthsCache = {};

    if (typeof this.settings.domain != "string") {
      throw new Error('ImgixClient must be passed a valid string domain');
    }

    if (DOMAIN_REGEX.exec(this.settings.domain) == null) {
      throw new Error('Domain must be passed in as fully-qualified ' + 'domain name and should not include a protocol or any path ' + 'element, i.e. "example.imgix.net".');
    }

    if (this.settings.includeLibraryParam) {
      this.settings.libraryParam = "js-" + VERSION;
    }

    this.settings.urlPrefix = this.settings.useHTTPS ? 'https://' : 'http://';
  }

  _createClass(ImgixClient, [{
    key: "buildURL",
    value: function buildURL() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var sanitizedPath = this._sanitizePath(path);

      var queryParams = this._buildParams(params);

      if (!!this.settings.secureURLToken) {
        var securedParams = this._signParams(sanitizedPath, queryParams);

        return this.settings.urlPrefix + this.settings.domain + sanitizedPath + securedParams;
      }

      return this.settings.urlPrefix + this.settings.domain + sanitizedPath + queryParams;
    }
  }, {
    key: "_buildParams",
    value: function _buildParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var queryParams = [];

      if (this.settings.libraryParam) {
        queryParams.push('ixlib=' + this.settings.libraryParam);
      }

      for (var key in params) {
        var val = params[key];
        var encodedKey = encodeURIComponent(key);
        var encodedVal = void 0;

        if (key.substr(-2) === '64') {
          encodedVal = jsBase64.Base64.encodeURI(val);
        } else {
          encodedVal = encodeURIComponent(val);
        }

        queryParams.push(encodedKey + "=" + encodedVal);
      }

      if (queryParams[0]) {
        queryParams[0] = "?" + queryParams[0];
      }

      return queryParams.join('&');
    }
  }, {
    key: "_signParams",
    value: function _signParams(path, queryParams) {
      var signatureBase = this.settings.secureURLToken + path + queryParams;
      var signature = md5(signatureBase);

      if (queryParams.length > 0) {
        return queryParams = queryParams + "&s=" + signature;
      } else {
        return queryParams = "?s=" + signature;
      }
    }
  }, {
    key: "_sanitizePath",
    value: function _sanitizePath(path) {
      // Strip leading slash first (we'll re-add after encoding)
      var _path = path.replace(/^\//, '');

      if (/^https?:\/\//.test(_path)) {
        // Use de/encodeURIComponent to ensure *all* characters are handled,
        // since it's being used as a path
        _path = encodeURIComponent(_path);
      } else {
        // Use de/encodeURI if we think the path is just a path,
        // so it leaves legal characters like '/' and '@' alone
        _path = encodeURI(_path).replace(/[#?:]/g, encodeURIComponent);
      }

      return '/' + _path;
    }
  }, {
    key: "buildSrcSet",
    value: function buildSrcSet(path, params, options) {
      var _options = options || {};

      var _params = params || {};

      var width = _params.w;
      var height = _params.h;
      var aspectRatio = _params.ar;

      if (width || height && aspectRatio) {
        return this._buildDPRSrcSet(path, _params, _options);
      } else {
        return this._buildSrcSetPairs(path, _params, _options);
      }
    }
  }, {
    key: "_buildSrcSetPairs",
    value: function _buildSrcSetPairs(path, params, options) {
      var srcsetOptions = validateAndDestructureOptions(options);
      var srcset = [];
      var customWidths = options.widths;
      var widthTolerance = srcsetOptions[0],
          minWidth = srcsetOptions[1],
          maxWidth = srcsetOptions[2];
      var targetWidths;

      if (customWidths) {
        validateWidths(customWidths);
        targetWidths = customWidths;
      } else {
        validateRange(minWidth, maxWidth);
        validateWidthTolerance(widthTolerance);
        targetWidths = this._generateTargetWidths(widthTolerance, minWidth, maxWidth);
      }

      var queryParams = {};

      for (var key in params) {
        queryParams[key] = params[key];
      }

      for (var i = 0; i < targetWidths.length; i++) {
        var currentWidth = targetWidths[i];
        queryParams.w = currentWidth;
        srcset.push(this.buildURL(path, queryParams) + ' ' + currentWidth + 'w');
      }

      return srcset.join(',\n');
    }
  }, {
    key: "_buildDPRSrcSet",
    value: function _buildDPRSrcSet(path, params, options) {
      var srcset = [];
      var targetRatios = [1, 2, 3, 4, 5];
      var disableVariableQuality = options.disableVariableQuality || false;
      var queryParams = {};

      for (var key in params) {
        queryParams[key] = params[key];
      }

      var quality = queryParams.q;

      if (!disableVariableQuality) {
        validateVariableQuality(disableVariableQuality);
      }

      for (var i = 0; i < targetRatios.length; i++) {
        var currentRatio = targetRatios[i];
        queryParams.dpr = currentRatio;

        if (!disableVariableQuality) {
          queryParams.q = quality || DPR_QUALITIES[currentRatio];
        }

        srcset.push(this.buildURL(path, queryParams) + ' ' + currentRatio + 'x');
      }

      return srcset.join(',\n');
    }
  }, {
    key: "_generateTargetWidths",
    // returns an array of width values used during scrset generation
    value: function _generateTargetWidths(widthTolerance, minWidth, maxWidth) {
      var resolutions = [];
      var INCREMENT_PERCENTAGE = widthTolerance;

      var _minWidth = Math.floor(minWidth);

      var _maxWidth = Math.floor(maxWidth);

      var cacheKey = INCREMENT_PERCENTAGE + '/' + _minWidth + '/' + _maxWidth;

      if (cacheKey in this.targetWidthsCache) {
        return this.targetWidthsCache[cacheKey];
      }

      var ensureEven = function ensureEven(n) {
        return 2 * Math.round(n / 2);
      };

      var prev = _minWidth;

      while (prev < _maxWidth) {
        resolutions.push(ensureEven(prev));
        prev *= 1 + INCREMENT_PERCENTAGE * 2;
      }

      resolutions.push(_maxWidth);
      this.targetWidthsCache[cacheKey] = resolutions;
      return resolutions;
    }
  }]);

  return ImgixClient;
}();

describe('URL Builder:', function describeSuite() {
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
        var expectation = '/';

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(0, 1));
      });
      it('otherwise returns the same exact path', function testSpec() {
        var expectation = path;

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
    });
    describe('with a path that contains a leading slash', function describeSuite() {
      var path = '/images/1.png';
      it('retains the leading slash', function testSpec() {
        var expectation = '/';

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(0, 1));
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
        var expectation = '/';

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(0, 1));
      });
      it('otherwise returns the same path, except with the characters encoded properly', function testSpec() {
        var expectation = encodeURI(path);

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
    });
    describe('with a path that contains a hash character', function describeSuite() {
      var path = '#blessed.png';
      it('properly encodes the hash character', function testSpec() {
        var expectation = path.replace(/^#/, '%23');

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
    });
    describe('with a path that contains a question mark', function describeSuite() {
      var path = '?what.png';
      it('properly encodes the question mark', function testSpec() {
        var expectation = path.replace(/^\?/, '%3F');

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
    });
    describe('with a path that contains a colon', function describeSuite() {
      var path = ':emoji.png';
      it('properly encodes the colon', function testSpec() {
        var expectation = path.replace(/^\:/, '%3A');

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
    });
    describe('with a full HTTP URL', function describeSuite() {
      var path = 'http://example.com/images/1.png';
      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/';

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(0, 1));
      });
      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path);

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
    });
    describe('with a full HTTPS URL', function describeSuite() {
      var path = 'https://example.com/images/1.png';
      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/';

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(0, 1));
      });
      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path);

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
    });
    describe('with a full URL that contains a leading slash', function describeSuite() {
      var path = '/http://example.com/images/1.png';
      it('retains the leading slash, unencoded', function testSpec() {
        var expectation = '/';

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(0, 1));
      });
      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path.substring(1));

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
    });
    describe('with a full URL that contains encoded characters', function describeSuite() {
      var path = 'http://example.com/images/1.png?foo=%20';
      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/';

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(0, 1));
      });
      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path);

        var result = client._sanitizePath(path);

        assert.strictEqual(expectation, result.substring(1));
      });
      it('double-encodes the original encoded characters', function testSpec() {
        var expectation1 = -1;
        var expectation2 = encodeURIComponent(path).length - 4;

        var result = client._sanitizePath(path); // Result should not contain the string "%20"


        assert.strictEqual(expectation1, result.indexOf('%20')); // Result should instead contain the string "%2520"

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
      var params = {};
      var expectation = '';

      var result = client._buildParams(params);

      assert.strictEqual(result, expectation);
    });
    it('returns a properly-formatted query string if a single parameter is given', function testSpec() {
      var params = {
        w: 400
      };
      var expectation = '?w=400';

      var result = client._buildParams(params);

      assert.strictEqual(expectation, result);
    });
    it('returns a properly-formatted query string if multiple parameters are given', function testSpec() {
      var params = {
        w: 400,
        h: 300
      };
      var expectation = '?w=400&h=300';

      var result = client._buildParams(params);

      assert.strictEqual(expectation, result);
    });
    it('does not modify its input-argument', function testSpec() {
      var emptyParams = {};

      var emptyResult = client._buildParams(emptyParams);

      assert(Object.keys(emptyParams).length === 0);
    });
    it('includes an `ixlib` param if the `libraryParam` setting is truthy', function testSpec() {
      client.settings.libraryParam = 'test';

      var result = client._buildParams({});

      assert(result.match(/ixlib=test/));
    });
    it('url-encodes parameter keys properly', function testSpec() {
      var params = {
        'w$': 400
      };
      var expectation = '?w%24=400';

      var result = client._buildParams(params);

      assert.strictEqual(expectation, result);
    });
    it('url-encodes parameter values properly', function testSpec() {
      var params = {
        w: '$400'
      };
      var expectation = '?w=%24400';

      var result = client._buildParams(params);

      assert.strictEqual(expectation, result);
    });
    it('base64-encodes parameter values whose keys end in `64`', function testSpec() {
      var params = {
        txt64: 'lorem ipsum'
      };
      var expectation = '?txt64=bG9yZW0gaXBzdW0';

      var result = client._buildParams(params);

      assert.strictEqual(expectation, result);
    });
  });
  describe('Calling _signParams()', function describeSuite() {
    var client;
    var path = 'images/1.png';
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
  describe('Calling buildURL()', function describeSuite() {
    var client;
    beforeEach(function setupClient() {
      client = new ImgixClient({
        domain: 'test.imgix.net',
        includeLibraryParam: false
      });
    });
    it('is an idempotent operation with empty args', function testSpec() {
      var result1 = client.buildURL('', {});
      var result2 = client.buildURL('', {});
      assert.equal(result1, result2);
    });
    it('is an idempotent operation with args', function testSpec() {
      var path = '/image/stöked.png';
      var params = {
        w: 100
      };
      var result1 = client.buildURL(path, params);
      var result2 = client.buildURL(path, params);
      var expected = 'https://test.imgix.net/image/st%C3%B6ked.png?w=100';
      assert.strictEqual(result1, expected);
      assert.strictEqual(result2, expected);
    });
    it('does not modify empty args', function testSpec() {
      var path = '';
      var params = {};
      var result1 = client.buildURL(path, params);
      var result2 = client.buildURL(path, params);
      var expected = 'https://test.imgix.net/';
      assert.strictEqual(path, '');
      assert.strictEqual(expected, result1);
      assert.strictEqual(expected, result2);
      assert(Object.keys(params).length === 0 && params.constructor === Object);
    });
    it('does not modify its args', function testSpec() {
      var path = 'image/1.png';
      var params = {
        w: 100
      };
      var result1 = client.buildURL(path, params);
      var result2 = client.buildURL(path, params);
      var expected = 'https://test.imgix.net/image/1.png?w=100';
      assert.strictEqual(path, 'image/1.png');
      assert.strictEqual(result1, result2, expected);
      assert.strictEqual(params.w, 100);
      assert(Object.keys(params).length === 1 && params.constructor === Object);
    });
  });
});