'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var md5 = _interopDefault(require('md5'));
var assert = _interopDefault(require('assert'));
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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// package version used in the ix-lib parameter
var VERSION = '2.3.2'; // regex pattern used to determine if a domain is valid

var DOMAIN_REGEX = /^(?:[a-z\d\-_]{1,62}\.){0,125}(?:[a-z\d](?:\-(?=\-*[a-z\d])|[a-z]|\d){0,62}\.)[a-z\d]{1,63}$/i; // minimum generated srcset width

var MIN_SRCSET_WIDTH = 100; // maximum generated srcset width

var MAX_SRCSET_WIDTH = 8192; // default tolerable percent difference between srcset pair widths

var DEFAULT_SRCSET_WIDTH_TOLERANCE = 0.08; // default quality parameter values mapped by each dpr srcset entry

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

    this.settings = _objectSpread2(_objectSpread2({}, DEFAULT_OPTIONS), opts); // a cache to store memoized srcset width-pairs

    this.targetWidthsCache = {};

    if (typeof this.settings.domain != 'string') {
      throw new Error('ImgixClient must be passed a valid string domain');
    }

    if (DOMAIN_REGEX.exec(this.settings.domain) == null) {
      throw new Error('Domain must be passed in as fully-qualified ' + 'domain name and should not include a protocol or any path ' + 'element, i.e. "example.imgix.net".');
    }

    if (this.settings.includeLibraryParam) {
      this.settings.libraryParam = 'js-' + VERSION;
    }

    this.settings.urlPrefix = this.settings.useHTTPS ? 'https://' : 'http://';
  }

  _createClass(ImgixClient, [{
    key: "buildURL",
    value: function buildURL() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var sanitizedPath = this._sanitizePath(path);

      var finalParams = this._buildParams(params);

      if (!!this.settings.secureURLToken) {
        finalParams = this._signParams(sanitizedPath, finalParams);
      }

      return this.settings.urlPrefix + this.settings.domain + sanitizedPath + finalParams;
    }
  }, {
    key: "_buildParams",
    value: function _buildParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var queryParams = [].concat(_toConsumableArray(this.settings.libraryParam ? ["ixlib=".concat(this.settings.libraryParam)] : []), _toConsumableArray(Object.entries(params).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        var encodedKey = encodeURIComponent(key);
        var encodedValue = key.substr(-2) === '64' ? jsBase64.Base64.encodeURI(value) : encodeURIComponent(value);
        return "".concat(encodedKey, "=").concat(encodedValue);
      })));
      return "".concat(queryParams.length > 0 ? '?' : '').concat(queryParams.join('&'));
    }
  }, {
    key: "_signParams",
    value: function _signParams(path, queryParams) {
      var signatureBase = this.settings.secureURLToken + path + queryParams;
      var signature = md5(signatureBase);
      return queryParams.length > 0 ? queryParams + '&s=' + signature : '?s=' + signature;
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
    value: function buildSrcSet(path) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var w = params.w,
          h = params.h,
          ar = params.ar;

      if (w || h && ar) {
        return this._buildDPRSrcSet(path, params, options);
      } else {
        return this._buildSrcSetPairs(path, params, options);
      }
    }
  }, {
    key: "_buildSrcSetPairs",
    value: function _buildSrcSetPairs(path, params, options) {
      var _this = this;

      var _validateAndDestructu = validateAndDestructureOptions(options),
          _validateAndDestructu2 = _slicedToArray(_validateAndDestructu, 3),
          widthTolerance = _validateAndDestructu2[0],
          minWidth = _validateAndDestructu2[1],
          maxWidth = _validateAndDestructu2[2];

      var targetWidths;

      if (options.widths) {
        validateWidths(options.widths);
        targetWidths = _toConsumableArray(options.widths);
      } else {
        validateRange(minWidth, maxWidth);
        validateWidthTolerance(widthTolerance);
        targetWidths = this._generateTargetWidths(widthTolerance, minWidth, maxWidth);
      }

      var srcset = targetWidths.map(function (w) {
        return "".concat(_this.buildURL(path, _objectSpread2(_objectSpread2({}, params), {}, {
          w: w
        })), " ").concat(w, "w");
      });
      return srcset.join(',\n');
    }
  }, {
    key: "_buildDPRSrcSet",
    value: function _buildDPRSrcSet(path, params, options) {
      var _this2 = this;

      var targetRatios = [1, 2, 3, 4, 5];
      var disableVariableQuality = options.disableVariableQuality || false;

      if (!disableVariableQuality) {
        validateVariableQuality(disableVariableQuality);
      }

      var withQuality = function withQuality(path, params, dpr) {
        return "".concat(_this2.buildURL(path, _objectSpread2(_objectSpread2({}, params), {}, {
          dpr: dpr,
          q: params.q || DPR_QUALITIES[dpr]
        })), " ").concat(dpr, "x");
      };

      var srcset = disableVariableQuality ? targetRatios.map(function (dpr) {
        return "".concat(_this2.buildURL(path, _objectSpread2(_objectSpread2({}, params), {}, {
          dpr: dpr
        })), " ").concat(dpr, "x");
      }) : targetRatios.map(function (dpr) {
        return withQuality(path, params, dpr);
      });
      return srcset.join(',\n');
    } // returns an array of width values used during srcset generation

  }, {
    key: "_generateTargetWidths",
    value: function _generateTargetWidths(widthTolerance, minWidth, maxWidth) {
      var INCREMENT_PERCENTAGE = widthTolerance;

      var _minWidth = Math.floor(minWidth);

      var _maxWidth = Math.floor(maxWidth);

      var cacheKey = INCREMENT_PERCENTAGE + '/' + _minWidth + '/' + _maxWidth;
      var resolutions = [_minWidth];

      if (minWidth === maxWidth) {
        return resolutions;
      }

      if (cacheKey in this.targetWidthsCache) {
        return this.targetWidthsCache[cacheKey];
      }

      var ensureEven = function ensureEven(n) {
        return 2 * Math.round(n / 2);
      };

      var tempWidth = _minWidth;

      while (resolutions[resolutions.length - 1] < _maxWidth) {
        tempWidth *= 1 + INCREMENT_PERCENTAGE * 2;
        resolutions.push(Math.min(ensureEven(tempWidth), _maxWidth));
      }

      this.targetWidthsCache[cacheKey] = resolutions;
      return resolutions;
    }
  }]);

  return ImgixClient;
}();

describe('SrcSet Builder:', function describeSuite() {
  describe('Calling buildSrcSet()', function describeSuite() {
    describe('using image parameters', function describeSuite() {
      describe('with no parameters', function describeSuite() {
        var client = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        });
        var srcset = client.buildSrcSet('image.jpg');
        it('memoizes default srcset width pairs', function testSpec() {
          var key = [0.08, 100, 8192].join('/');
          var cachedValue = client.targetWidthsCache[key];
          assert(cachedValue !== undefined && cachedValue.length == 31);
        });
        it('should generate the expected default srcset pair values', function testSpec() {
          var resolutions = [100, 116, 134, 156, 182, 210, 244, 282, 328, 380, 442, 512, 594, 688, 798, 926, 1074, 1246, 1446, 1678, 1946, 2258, 2618, 3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
          var srclist = srcset.split(',');
          var src = srclist.map(function (srcline) {
            return parseInt(srcline.split(' ')[1].slice(0, -1), 10);
          });
          srclist.map(function (_v, i) {
            return assert.strictEqual(src[i], resolutions[i]);
          });
        });
        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.strictEqual(srcset.split(',').length, 31);
        });
        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          var srcsetSplit = srcset.split(',');
          var min = Number.parseFloat(srcsetSplit[0].split(' ')[1].slice(0, -1));
          var max = Number.parseFloat(srcsetSplit[srcsetSplit.length - 1].split(' ')[1].slice(0, -1));
          assert(min >= 100);
          assert(max <= 8192);
        }); // a 17% testing threshold is used to account for rounding

        it('should not increase more than 17% every iteration', function testSpec() {
          var INCREMENT_ALLOWED = 0.17;

          var srcsetWidths = function () {
            return srcset.split(',').map(function (srcsetSplit) {
              return srcsetSplit.split(' ')[1];
            }).map(function (width) {
              return width.slice(0, -1);
            }).map(Number.parseFloat);
          }();

          var prev = srcsetWidths[0];

          for (var index = 1; index < srcsetWidths.length; index++) {
            var element = srcsetWidths[index];
            assert(element / prev < 1 + INCREMENT_ALLOWED);
            prev = element;
          }
        });
        it('should correctly sign each URL', function testSpec() {
          var path = '/image.jpg';
          var param;
          srcset.split(',').map(function (srcsetSplit) {
            // split the url portion of each srcset entry
            return srcsetSplit.split(' ')[0];
          }).map(function (src) {
            // asserts that the expected 's=' parameter is being generated per entry
            assert(src.includes('s=')); // param will have all params except for '&s=...'

            param = src.slice(src.indexOf('?'), src.length);
            param = param.slice(0, param.indexOf('s=') - 1);
            var generated_signature = src.slice(src.indexOf('s=') + 2, src.length);
            var signatureBase = 'MYT0KEN' + path + param;
            var expected_signature = md5(signatureBase).toString();
            assert.strictEqual(expected_signature, generated_signature);
          });
        });
      });
      describe('with a width parameter provided', function describeSuite() {
        var DPR_QUALITY = [75, 50, 35, 23, 20];
        var srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        }).buildSrcSet('image.jpg', {
          w: 100
        });
        it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
          assert(srcset.split(',').length == 5);
          var devicePixelRatios = srcset.split(',').map(function (srcsetSplit) {
            return srcsetSplit.split(' ')[1];
          });
          assert.strictEqual(devicePixelRatios[0], '1x');
          assert.strictEqual(devicePixelRatios[1], '2x');
          assert.strictEqual(devicePixelRatios[2], '3x');
          assert.strictEqual(devicePixelRatios[3], '4x');
          assert.strictEqual(devicePixelRatios[4], '5x');
        });
        it('should correctly sign each URL', function testSpec() {
          var path = '/image.jpg';
          var param;
          srcset.split(',').map(function (srcsetSplit) {
            return srcsetSplit.split(' ')[0];
          }).map(function (src) {
            // asserts that the expected 's=' parameter is being generated per entry
            assert(src.includes('s=')); // param will have all params except for '&s=...'

            param = src.slice(src.indexOf('?'), src.indexOf('s=') - 1);
            var generated_signature = src.slice(src.indexOf('s=') + 2, src.length);
            var signatureBase = 'MYT0KEN' + path + param;
            var expected_signature = md5(signatureBase).toString();
            assert.strictEqual(expected_signature, generated_signature);
          });
        });
        it('should include a dpr param per specified src', function testSpec() {
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("dpr=".concat(i + 1)));
          }
        });
        it('should include variable qualities by default', function testSpec() {
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(DPR_QUALITY[i])));
          }
        });
        it('should override the variable quality if a quality parameter is provided', function testSpec() {
          var QUALITY_OVERRIDE = 100;
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800,
            q: QUALITY_OVERRIDE
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(QUALITY_OVERRIDE)));
          }
        });
        it("should correctly disable generated variable qualities via the 'disableVariableQuality' argument", function testSpec() {
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800
          }, {
            disableVariableQuality: true
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(!src.includes("q="));
          }
        });
        it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
          var QUALITY_OVERRIDE = 100;
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800,
            q: QUALITY_OVERRIDE
          }, {
            disableVariableQuality: true
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(QUALITY_OVERRIDE)));
          }
        });
      });
      describe('with a height parameter provided', function describeSuite() {
        var srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        }).buildSrcSet('image.jpg', {
          h: 100
        });
        it('should generate the expected default srcset pair values', function testSpec() {
          var resolutions = [100, 116, 134, 156, 182, 210, 244, 282, 328, 380, 442, 512, 594, 688, 798, 926, 1074, 1246, 1446, 1678, 1946, 2258, 2618, 3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
          var srclist = srcset.split(',');
          var src = srclist.map(function (srcline) {
            return parseInt(srcline.split(' ')[1].slice(0, -1), 10);
          });

          for (var i = 0; i < srclist.length; i++) {
            assert.strictEqual(src[i], resolutions[i]);
          }
        });
        it('should respect the height parameter', function testSpec() {
          srcset.split(',').map(function (src) {
            assert(src.includes('h='));
          });
        });
        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.equal(srcset.split(',').length, 31);
        });
        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          var srcsetSplit = srcset.split(',');
          var min = Number.parseFloat(srcsetSplit[0].split(' ')[1].slice(0, -1));
          var max = Number.parseFloat(srcsetSplit[srcsetSplit.length - 1].split(' ')[1].slice(0, -1));
          assert(min >= 100);
          assert(max <= 8192);
        }); // a 17% testing threshold is used to account for rounding

        it('should not increase more than 17% every iteration', function testSpec() {
          var INCREMENT_ALLOWED = 0.17;

          var srcsetWidths = function () {
            return srcset.split(',').map(function (srcsetSplit) {
              return srcsetSplit.split(' ')[1];
            }).map(function (width) {
              return width.slice(0, -1);
            }).map(Number.parseFloat);
          }();

          var prev = srcsetWidths[0];

          for (var index = 1; index < srcsetWidths.length; index++) {
            var element = srcsetWidths[index];
            assert(element / prev < 1 + INCREMENT_ALLOWED);
            prev = element;
          }
        });
        it('should correctly sign each URL', function testSpec() {
          var path = '/image.jpg';
          var param;
          srcset.split(',').map(function (srcsetSplit) {
            // split the url portion of each srcset entry
            return srcsetSplit.split(' ')[0];
          }).map(function (src) {
            // asserts that the expected 's=' parameter is being generated per entry
            assert(src.includes('s=')); // param will have all params except for '&s=...'

            param = src.slice(src.indexOf('?'), src.length);
            param = param.slice(0, param.indexOf('s=') - 1);
            var generated_signature = src.slice(src.indexOf('s=') + 2, src.length);
            var signatureBase = 'MYT0KEN' + path + param;
            var expected_signature = md5(signatureBase).toString();
            assert.strictEqual(expected_signature, generated_signature);
          });
        });
      });
      describe('with a width and height parameter provided', function describeSuite() {
        var DPR_QUALITY = [75, 50, 35, 23, 20];
        var srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        }).buildSrcSet('image.jpg', {
          w: 100,
          h: 100
        });
        it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
          assert(srcset.split(',').length == 5);
          var devicePixelRatios = srcset.split(',').map(function (srcsetSplit) {
            return srcsetSplit.split(' ')[1];
          });
          assert.strictEqual(devicePixelRatios[0], '1x');
          assert.strictEqual(devicePixelRatios[1], '2x');
          assert.strictEqual(devicePixelRatios[2], '3x');
          assert.strictEqual(devicePixelRatios[3], '4x');
          assert.strictEqual(devicePixelRatios[4], '5x');
        });
        it('should correctly sign each URL', function testSpec() {
          var path = '/image.jpg';
          var param;
          srcset.split(',').map(function (srcsetSplit) {
            return srcsetSplit.split(' ')[0];
          }).map(function (src) {
            // asserts that the expected 's=' parameter is being generated per entry
            assert(src.includes('s=')); // param will have all params except for '&s=...'

            param = src.slice(src.indexOf('?'), src.indexOf('s=') - 1);
            var generated_signature = src.slice(src.indexOf('s=') + 2, src.length);
            var signatureBase = 'MYT0KEN' + path + param;
            var expected_signature = md5(signatureBase).toString();
            assert.strictEqual(expected_signature, generated_signature);
          });
        });
        it('should include a dpr param per specified src', function testSpec() {
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("dpr=".concat(i + 1)));
          }
        });
        it('should include variable qualities by default', function testSpec() {
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(DPR_QUALITY[i])));
          }
        });
        it('should override the variable quality if a quality parameter is provided', function testSpec() {
          var QUALITY_OVERRIDE = 100;
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800,
            q: QUALITY_OVERRIDE
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(QUALITY_OVERRIDE)));
          }
        });
        it("should correctly disable generated variable qualities via the 'disableVariableQuality' argument", function testSpec() {
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800
          }, {
            disableVariableQuality: true
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(!src.includes("q="));
          }
        });
        it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
          var QUALITY_OVERRIDE = 100;
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800,
            q: QUALITY_OVERRIDE
          }, {
            disableVariableQuality: true
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(QUALITY_OVERRIDE)));
          }
        });
        it('should not modify input params and should be idempotent', function testSpec() {
          var client = new ImgixClient({
            domain: 'test.imgix.net'
          });
          var params = {};
          var srcsetOptions = {
            widths: [100]
          };
          var srcset1 = client.buildSrcSet('', params, srcsetOptions);
          var srcset2 = client.buildSrcSet('', params, srcsetOptions); // Show idempotent, ie. calling buildSrcSet produces the same result given
          // the same input-parameters.

          assert(srcset1 == srcset2); // Assert that the object remains unchanged.

          assert(Object.keys(params).length === 0 && params.constructor === Object);
        });
      });
      describe('with an aspect ratio parameter provided', function describeSuite() {
        var srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        }).buildSrcSet('image.jpg', {
          ar: '3:2'
        });
        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.strictEqual(srcset.split(',').length, 31);
        });
        it('should generate the expected default srcset pair values', function testSpec() {
          var resolutions = [100, 116, 134, 156, 182, 210, 244, 282, 328, 380, 442, 512, 594, 688, 798, 926, 1074, 1246, 1446, 1678, 1946, 2258, 2618, 3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
          var srclist = srcset.split(',');
          var src = srclist.map(function (srcline) {
            return parseInt(srcline.split(' ')[1].slice(0, -1), 10);
          });

          for (var i = 0; i < srclist.length; i++) {
            assert.equal(src[i], resolutions[i]);
          }
        });
        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          var srcsetSplit = srcset.split(',');
          var min = Number.parseFloat(srcsetSplit[0].split(' ')[1].slice(0, -1));
          var max = Number.parseFloat(srcsetSplit[srcsetSplit.length - 1].split(' ')[1].slice(0, -1));
          assert(min >= 100);
          assert(max <= 8192);
        }); // a 17% testing threshold is used to account for rounding

        it('should not increase more than 17% every iteration', function testSpec() {
          var INCREMENT_ALLOWED = 0.17;

          var srcsetWidths = function () {
            return srcset.split(',').map(function (srcsetSplit) {
              return srcsetSplit.split(' ')[1];
            }).map(function (width) {
              return width.slice(0, -1);
            }).map(Number.parseFloat);
          }();

          var prev = srcsetWidths[0];

          for (var index = 1; index < srcsetWidths.length; index++) {
            var element = srcsetWidths[index];
            assert(element / prev < 1 + INCREMENT_ALLOWED);
            prev = element;
          }
        });
        it('should correctly sign each URL', function testSpec() {
          var path = '/image.jpg';
          var param;
          srcset.split(',').map(function (srcsetSplit) {
            var src = srcsetSplit.split(' ')[0]; // asserts that the expected 's=' parameter is being generated per entry

            assert(src.includes('s=')); // param will have all params except for '&s=...'

            param = src.slice(src.indexOf('?'), src.length);
            param = param.slice(0, param.indexOf('s=') - 1);
            var generated_signature = src.slice(src.indexOf('s=') + 2, src.length);
            var signatureBase = 'MYT0KEN' + path + param;
            var expected_signature = md5(signatureBase).toString();
            assert.strictEqual(expected_signature, generated_signature);
          });
        });
      });
      describe('with a width and aspect ratio parameter provided', function describeSuite() {
        var DPR_QUALITY = [75, 50, 35, 23, 20];
        var srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        }).buildSrcSet('image.jpg', {
          w: 100,
          ar: '3:2'
        });
        it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
          assert(srcset.split(',').length == 5);
          var devicePixelRatios = srcset.split(',').map(function (srcsetSplit) {
            return srcsetSplit.split(' ')[1];
          });
          assert.strictEqual(devicePixelRatios[0], '1x');
          assert.strictEqual(devicePixelRatios[1], '2x');
          assert.strictEqual(devicePixelRatios[2], '3x');
          assert.strictEqual(devicePixelRatios[3], '4x');
          assert.strictEqual(devicePixelRatios[4], '5x');
        });
        it('should correctly sign each URL', function testSpec() {
          var path = '/image.jpg';
          var param;
          srcset.split(',').map(function (srcsetSplit) {
            return srcsetSplit.split(' ')[0];
          }).map(function (src) {
            // asserts that the expected 's=' parameter is being generated per entry
            assert(src.includes('s=')); // param will have all params except for '&s=...'

            param = src.slice(src.indexOf('?'), src.indexOf('s=') - 1);
            var generated_signature = src.slice(src.indexOf('s=') + 2, src.length);
            var signatureBase = 'MYT0KEN' + path + param;
            var expected_signature = md5(signatureBase).toString();
            assert.strictEqual(expected_signature, generated_signature);
          });
        });
        it('should include a dpr param per specified src', function testSpec() {
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("dpr=".concat(i + 1)));
          }
        });
        it('should include variable qualities by default', function testSpec() {
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(DPR_QUALITY[i])));
          }
        });
        it('should override the variable quality if a quality parameter is provided', function testSpec() {
          var QUALITY_OVERRIDE = 100;
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800,
            q: QUALITY_OVERRIDE
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(QUALITY_OVERRIDE)));
          }
        });
        it("should correctly disable generated variable qualities via the 'disableVariableQuality' argument", function testSpec() {
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800
          }, {
            disableVariableQuality: true
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(!src.includes("q="));
          }
        });
        it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
          var QUALITY_OVERRIDE = 100;
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800,
            q: QUALITY_OVERRIDE
          }, {
            disableVariableQuality: true
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(QUALITY_OVERRIDE)));
          }
        });
      });
      describe('with a height and aspect ratio parameter provided', function describeSuite() {
        var DPR_QUALITY = [75, 50, 35, 23, 20];
        var srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        }).buildSrcSet('image.jpg', {
          h: 100,
          ar: '3:2'
        });
        it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
          assert(srcset.split(',').length == 5);
          var devicePixelRatios = srcset.split(',').map(function (srcsetSplit) {
            return srcsetSplit.split(' ')[1];
          });
          assert.strictEqual(devicePixelRatios[0], '1x');
          assert.strictEqual(devicePixelRatios[1], '2x');
          assert.strictEqual(devicePixelRatios[2], '3x');
          assert.strictEqual(devicePixelRatios[3], '4x');
          assert.strictEqual(devicePixelRatios[4], '5x');
        });
        it('should correctly sign each URL', function testSpec() {
          var path = '/image.jpg';
          srcset.split(',').map(function (srcsetSplit) {
            return srcsetSplit.split(' ')[0];
          }).map(function (src) {
            // asserts that the expected 's=' parameter is being generated per entry
            assert(src.includes('s=')); // param will have all params except for '&s=...'

            var param = src.slice(src.indexOf('?'), src.indexOf('s=') - 1);
            var generated_signature = src.slice(src.indexOf('s=') + 2, src.length);
            var signatureBase = 'MYT0KEN' + path + param;
            var expected_signature = md5(signatureBase).toString();
            assert.strictEqual(expected_signature, generated_signature);
          });
        });
        it('should include a dpr param per specified src', function testSpec() {
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("dpr=".concat(i + 1)));
          }
        });
        it('should include variable qualities by default', function testSpec() {
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(DPR_QUALITY[i])));
          }
        });
        it('should override the variable quality if a quality parameter is provided', function testSpec() {
          var QUALITY_OVERRIDE = 100;
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800,
            q: QUALITY_OVERRIDE
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(QUALITY_OVERRIDE)));
          }
        });
        it("should correctly disable generated variable qualities via the 'disableVariableQuality' argument", function testSpec() {
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800
          }, {
            disableVariableQuality: true
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(!src.includes("q="));
          }
        });
        it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
          var QUALITY_OVERRIDE = 100;
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net'
          }).buildSrcSet('image.jpg', {
            w: 800,
            q: QUALITY_OVERRIDE
          }, {
            disableVariableQuality: true
          });
          var srclist = srcset.split(',');

          for (var i = 0; i < srclist.length; i++) {
            var src = srclist[i].split(' ')[0];
            assert(src.includes("q=".concat(QUALITY_OVERRIDE)));
          }
        });
      });
    });
    describe('using srcset parameters', function describeSuite() {
      describe('with a minWidth and/or maxWidth provided', function describeSuite() {
        var MIN = 500;
        var MAX = 2000;
        var client = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        });
        var srcset = client.buildSrcSet('image.jpg', {}, {
          minWidth: MIN,
          maxWidth: MAX
        });
        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.strictEqual(srcset.split(',').length, 11);
        });
        it('should generate the expected default srcset pair values', function testSpec() {
          var resolutions = [500, 580, 672, 780, 906, 1050, 1218, 1414, 1640, 1902, 2000];
          var srclist = srcset.split(',');
          var src = srclist.map(function (srcline) {
            return parseInt(srcline.split(' ')[1].slice(0, -1), 10);
          });

          for (var i = 0; i < srclist.length; i++) {
            assert.strictEqual(src[i], resolutions[i]);
          }
        });
        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          var srcsetSplit = srcset.split(',');
          var min = Number.parseFloat(srcsetSplit[0].split(' ')[1].slice(0, -1));
          var max = Number.parseFloat(srcsetSplit[srcsetSplit.length - 1].split(' ')[1].slice(0, -1));
          assert(min >= MIN);
          assert(max <= MAX);
        });
        it('errors with non-Number minWidth', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              minWidth: 'abc'
            });
          }, Error);
        });
        it('errors with negative maxWidth', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              maxWidth: -100
            });
          }, Error);
        });
        it('errors with zero maxWidth', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              maxWidth: 0
            });
          }, Error);
        });
        it('errors with two invalid widths', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              minWidth: 0,
              maxWidth: 0
            });
          }, Error);
        });
        it('errors when the maxWidth is less than the minWidth', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              minWidth: 1000,
              maxWidth: 500
            });
          }, Error);
        });
        it('generates a single srcset entry if minWidth and maxWidth are equal', function testSpec() {
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net',
            includeLibraryParam: false
          }).buildSrcSet('image.jpg', {}, {
            minWidth: 1000,
            maxWidth: 1000
          });
          assert(srcset, 'https://testing.imgix.net/image.jpg?w=1000 1000w');
        });
        it('does not include a minWidth or maxWidth URL parameter', function testSpec() {
          assert(!srcset.includes('minWidth='));
          assert(!srcset.includes('maxWidth='));
        });
        it('only includes one entry if maxWidth is equal to 100', function testSpec() {
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net',
            includeLibraryParam: false
          }).buildSrcSet('image.jpg', {}, {
            maxWidth: 100
          });
          assert.equal('https://testing.imgix.net/image.jpg?w=100 100w', srcset);
        });
        it('only includes one entry if minWidth is equal to 8192', function testSpec() {
          var srcset = new ImgixClient({
            domain: 'testing.imgix.net',
            includeLibraryParam: false
          }).buildSrcSet('image.jpg', {}, {
            minWidth: 8192
          });
          assert.equal('https://testing.imgix.net/image.jpg?w=8192 8192w', srcset);
        });
        it('memoizes generated srcset width pairs', function testSpec() {
          var DEFAULT_WIDTH_TOLERANCE = 0.08;
          var key = [DEFAULT_WIDTH_TOLERANCE, MIN, MAX].join('/');
          var cachedValue = client.targetWidthsCache[key];
          assert(cachedValue !== undefined && cachedValue.length == 11);
        });
      });
      describe('with a widthTolerance parameter provided', function describeSuite() {
        var WIDTH_TOLERANCE = 0.2;
        var client = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false
        });
        var srcset = client.buildSrcSet('image.jpg', {}, {
          widthTolerance: WIDTH_TOLERANCE
        });
        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.equal(srcset.split(',').length, 15);
        });
        it('should generate the expected default srcset pair values', function testSpec() {
          var resolutions = [100, 140, 196, 274, 384, 538, 752, 1054, 1476, 2066, 2892, 4050, 5670, 7938, 8192];
          var srclist = srcset.split(',');
          var src = srclist.map(function (srcline) {
            return parseInt(srcline.split(' ')[1].slice(0, -1), 10);
          });

          for (var i = 0; i < srclist.length; i++) {
            assert.equal(src[i], resolutions[i]);
          }
        });
        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          var srcsetSplit = srcset.split(',');
          var min = Number.parseFloat(srcsetSplit[0].split(' ')[1].slice(0, -1));
          var max = Number.parseFloat(srcsetSplit[srcsetSplit.length - 1].split(' ')[1].slice(0, -1));
          assert(min >= 100);
          assert(max <= 8192);
        });
        it('should not increase more than (2 * widthTolerance) + 1 every iteration', function testSpec() {
          var INCREMENT_ALLOWED = WIDTH_TOLERANCE * 2 + 1;

          var srcsetWidths = function () {
            return srcset.split(',').map(function (srcsetSplit) {
              return srcsetSplit.split(' ')[1];
            }).map(function (width) {
              return width.slice(0, -1);
            }).map(Number.parseFloat);
          }();

          var prev = srcsetWidths[0];

          for (var index = 1; index < srcsetWidths.length; index++) {
            var element = srcsetWidths[index];
            assert(element / prev < 1 + INCREMENT_ALLOWED);
            prev = element;
          }
        });
        it('errors with non-Number widthTolerance', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              widthTolerance: 'abc'
            });
          }, Error);
        });
        it('errors with negative widthTolerance', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              widthTolerance: -0.1
            });
          }, Error);
        });
        it('errors with zero widthTolerance', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              widthTolerance: 0
            });
          }, Error);
        });
        it('memoizes generated srcset width pairs', function testSpec() {
          var DEFAULT_MIN_WIDTH = 100;
          var DEFAULT_MAX_WIDTH = 8192;
          var key = [WIDTH_TOLERANCE, DEFAULT_MIN_WIDTH, DEFAULT_MAX_WIDTH].join('/');
          var cachedValue = client.targetWidthsCache[key];
          assert(cachedValue !== undefined && cachedValue.length == 15);
        });
      });
      describe('with a custom list of widths provided', function describeSuite() {
        var CUSTOM_WIDTHS = [100, 500, 1000, 1800];
        var srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN'
        }).buildSrcSet('image.jpg', {}, {
          widths: CUSTOM_WIDTHS
        });
        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.equal(srcset.split(',').length, 4);
        });
        it('should generate the expected default srcset pair values', function testSpec() {
          var resolutions = CUSTOM_WIDTHS;
          var srclist = srcset.split(',');
          var src = srclist.map(function (srcline) {
            return parseInt(srcline.split(' ')[1].slice(0, -1), 10);
          });

          for (var i = 0; i < srclist.length; i++) {
            assert.equal(src[i], resolutions[i]);
          }
        });
        it('errors with non-array argument', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              widths: 'abc'
            });
          }, Error);
        });
        it('errors with non-positive value passed in to the argument', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              widths: [100, -200]
            });
          }, Error);
        });
        it('errors with non-integer value passed in to the argument', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net'
            }).buildSrcSet('image.jpg', {}, {
              widths: [100, false]
            });
          }, Error);
        });
      });
      describe('with widthTolerance, minWidth, and maxWidth values which have caused duplicate values in the past', function describeSuite() {
        var client = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false
        });
        var srcset = client.buildSrcSet('image.jpg', {}, {
          widthTolerance: 0.0999,
          minWidth: 1000,
          maxWidth: 1200
        });
        it('should not repeat the largest width when a running value just below maxWidth is reached', function testSpec() {
          var srclist = srcset.split(',');
          assert.equal(parseInt(srclist[srclist.length - 1].split(' ')[1].slice(0, -1), 10), 1200);
          assert.notEqual(srclist[srclist.length - 2], srclist[srclist.length - 1]);
        });
      });
    });
  });
});
