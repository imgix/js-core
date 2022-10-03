import { Base64 } from 'js-base64';
import md5 from 'md5';
import { hasProtocol, parseURL, getQuery } from 'ufo';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

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
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
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
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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
var VERSION = '3.6.0'; // regex pattern used to determine if a domain is valid

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
var DEFAULT_DPR = [1, 2, 3, 4, 5];
var DEFAULT_OPTIONS = {
  domain: null,
  useHTTPS: true,
  includeLibraryParam: true,
  urlPrefix: 'https://',
  secureURLToken: null
};

/**
 * `extractUrl()` extracts URL components from a source URL string.
 * It does this by matching the URL against regular expressions. The irrelevant
 * (entire URL) matches are removed and the rest stored as their corresponding
 * URL components.
 *
 * `url` can be a partial, full URL, or full proxy URL. `useHttps` boolean
 * defaults to false.
 *
 * @returns {Object} `{ protocol, auth, host, pathname, search, hash }`
 * extracted from the URL.
 */

function extractUrl(_ref) {
  var _ref$url = _ref.url,
      url = _ref$url === void 0 ? '' : _ref$url,
      _ref$useHttps = _ref.useHttps,
      useHttps = _ref$useHttps === void 0 ? false : _ref$useHttps;
  var defaultProto = useHttps ? 'https://' : 'http://';

  if (!hasProtocol(url, true)) {
    return extractUrl({
      url: defaultProto + url
    });
  }
  /**
   * Regex are hard to parse. Leaving this breakdown here for reference.
   * - `protocol`: ([^:/]+:)? - all not `:` or `/` & preceded by `:`, 0-1 times
   * - `auth`: ([^/@]+@)? - all not `/` or `@` & preceded by `@`, 0-1 times
   * - `domainAndPath`: (.*) /) -  all except line breaks
   * - `domain`: `([^/]*)` - all before a `/` token
   */


  return parseURL(url);
}

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
    throw new Error("The min and max srcset widths can only be passed positive Number values, and min must be less than max. Found min: ".concat(min, " and max: ").concat(max, "."));
  }
}
function validateWidthTolerance(widthTolerance) {
  if (typeof widthTolerance != 'number' || widthTolerance < 0.01) {
    throw new Error('The srcset widthTolerance must be a number greater than or equal to 0.01');
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
function validateDevicePixelRatios(devicePixelRatios) {
  if (!Array.isArray(devicePixelRatios) || !devicePixelRatios.length) {
    throw new Error('The devicePixelRatios argument can only be passed a valid non-empty array of integers');
  } else {
    var allValidDPR = devicePixelRatios.every(function (dpr) {
      return typeof dpr === 'number' && dpr >= 1 && dpr <= 5;
    });

    if (!allValidDPR) {
      throw new Error('The devicePixelRatios argument can only contain positive integer values between 1 and 5');
    }
  }
}
function validateVariableQualities(variableQualities) {
  if (_typeof(variableQualities) !== 'object') {
    throw new Error('The variableQualities argument can only be an object');
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
      this.settings.libraryParam = 'js-' + ImgixClient.version();
    }

    this.settings.urlPrefix = this.settings.useHTTPS ? 'https://' : 'http://';
  }

  _createClass(ImgixClient, [{
    key: "buildURL",
    value: function buildURL() {
      var rawPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var path = this._sanitizePath(rawPath, {
        encode: !options.disablePathEncoding
      });

      var finalParams = this._buildParams(params);

      if (!!this.settings.secureURLToken) {
        finalParams = this._signParams(path, finalParams);
      }

      return this.settings.urlPrefix + this.settings.domain + path + finalParams;
    }
    /**
     *`_buildURL` static method allows full URLs to be formatted for use with
     * imgix.
     *
     * - If the source URL has included parameters, they are merged with
     * the `params` passed in as an argument.
     * - URL must match `{host}/{pathname}?{query}` otherwise an error is thrown.
     *
     * @param {String} url - full source URL path string, required
     * @param {Object} params - imgix params object, optional
     * @param {Object} options - imgix client options, optional
     *
     * @returns URL string formatted to imgix specifications.
     *
     * @example
     * const client = ImgixClient
     * const params = { w: 100 }
     * const opts = { useHttps: true }
     * const src = "sdk-test.imgix.net/amsterdam.jpg?h=100"
     * const url = client._buildURL(src, params, opts)
     * console.log(url)
     * // => "https://sdk-test.imgix.net/amsterdam.jpg?h=100&w=100"
     */

  }, {
    key: "_buildParams",
    value: function _buildParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var queryParams = [].concat(_toConsumableArray(this.settings.libraryParam ? ["ixlib=".concat(this.settings.libraryParam)] : []), _toConsumableArray(Object.entries(params).reduce(function (prev, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        if (value == null) {
          return prev;
        }

        var encodedKey = encodeURIComponent(key);
        var encodedValue = key.substr(-2) === '64' ? Base64.encodeURI(value) : encodeURIComponent(value);
        prev.push("".concat(encodedKey, "=").concat(encodedValue));
        return prev;
      }, [])));
      return "".concat(queryParams.length > 0 ? '?' : '').concat(queryParams.join('&'));
    }
  }, {
    key: "_signParams",
    value: function _signParams(path, queryParams) {
      var signatureBase = this.settings.secureURLToken + path + queryParams;
      var signature = md5(signatureBase);
      return queryParams.length > 0 ? queryParams + '&s=' + signature : '?s=' + signature;
    }
    /**
     * "Sanitize" the path of the image URL.
     * Ensures that the path has a leading slash, and that the path is correctly
     * encoded. If it's a proxy path (begins with http/https), then encode the
     * whole path as a URI component, otherwise only encode specific characters.
     * @param {string} path The URL path of the image
     * @param {Object} options Sanitization options
     * @param {boolean} options.encode Whether to encode the path, default true
     * @returns {string} The sanitized path
     */

  }, {
    key: "_sanitizePath",
    value: function _sanitizePath(path) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      // Strip leading slash first (we'll re-add after encoding)
      var _path = path.replace(/^\//, '');

      if (!(options.encode === false)) {
        if (/^https?:\/\//.test(_path)) {
          // Use de/encodeURIComponent to ensure *all* characters are handled,
          // since it's being used as a path
          _path = encodeURIComponent(_path);
        } else {
          // Use de/encodeURI if we think the path is just a path,
          // so it leaves legal characters like '/' and '@' alone
          _path = encodeURI(_path).replace(/[#?:+]/g, encodeURIComponent);
        }
      }

      return '/' + _path;
    }
  }, {
    key: "buildSrcSet",
    value: function buildSrcSet(path) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var w = params.w,
          h = params.h;

      if (w || h) {
        return this._buildDPRSrcSet(path, params, options);
      } else {
        return this._buildSrcSetPairs(path, params, options);
      }
    }
    /**
     * _buildSrcSet static method allows full URLs to be used when generating
     * imgix formatted `srcset` string values.
     *
     * - If the source URL has included parameters, they are merged with
     * the `params` passed in as an argument.
     * - URL must match `{host}/{pathname}?{query}` otherwise an error is thrown.
     *
     * @param {String} url - full source URL path string, required
     * @param {Object} params - imgix params object, optional
     * @param {Object} srcsetModifiers - srcset modifiers, optional
     * @param {Object} clientOptions - imgix client options, optional
     * @returns imgix `srcset` for full URLs.
     */

  }, {
    key: "_buildSrcSetPairs",
    value: function _buildSrcSetPairs(path) {
      var _this = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var _validateAndDestructu = validateAndDestructureOptions(options),
          _validateAndDestructu2 = _slicedToArray(_validateAndDestructu, 3),
          widthTolerance = _validateAndDestructu2[0],
          minWidth = _validateAndDestructu2[1],
          maxWidth = _validateAndDestructu2[2];

      var targetWidthValues;

      if (options.widths) {
        validateWidths(options.widths);
        targetWidthValues = _toConsumableArray(options.widths);
      } else {
        targetWidthValues = ImgixClient.targetWidths(minWidth, maxWidth, widthTolerance, this.targetWidthsCache);
      }

      var srcset = targetWidthValues.map(function (w) {
        return "".concat(_this.buildURL(path, _objectSpread2(_objectSpread2({}, params), {}, {
          w: w
        }), {
          disablePathEncoding: options.disablePathEncoding
        }), " ").concat(w, "w");
      });
      return srcset.join(',\n');
    }
  }, {
    key: "_buildDPRSrcSet",
    value: function _buildDPRSrcSet(path) {
      var _this2 = this;

      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (options.devicePixelRatios) {
        validateDevicePixelRatios(options.devicePixelRatios);
      }

      var targetRatios = options.devicePixelRatios || DEFAULT_DPR;
      var disableVariableQuality = options.disableVariableQuality || false;

      if (!disableVariableQuality) {
        validateVariableQuality(disableVariableQuality);
      }

      if (options.variableQualities) {
        validateVariableQualities(options.variableQualities);
      }

      var qualities = _objectSpread2(_objectSpread2({}, DPR_QUALITIES), options.variableQualities);

      var withQuality = function withQuality(path, params, dpr) {
        return "".concat(_this2.buildURL(path, _objectSpread2(_objectSpread2({}, params), {}, {
          dpr: dpr,
          q: params.q || qualities[dpr] || qualities[Math.floor(dpr)]
        }), {
          disablePathEncoding: options.disablePathEncoding
        }), " ").concat(dpr, "x");
      };

      var srcset = disableVariableQuality ? targetRatios.map(function (dpr) {
        return "".concat(_this2.buildURL(path, _objectSpread2(_objectSpread2({}, params), {}, {
          dpr: dpr
        }), {
          disablePathEncoding: options.disablePathEncoding
        }), " ").concat(dpr, "x");
      }) : targetRatios.map(function (dpr) {
        return withQuality(path, params, dpr);
      });
      return srcset.join(',\n');
    }
  }], [{
    key: "version",
    value: function version() {
      return VERSION;
    }
  }, {
    key: "_buildURL",
    value: function _buildURL(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (url == null) {
        return '';
      }

      var _extractUrl = extractUrl({
        url: url,
        useHTTPS: options.useHTTPS
      }),
          host = _extractUrl.host,
          pathname = _extractUrl.pathname,
          search = _extractUrl.search; // merge source URL parameters with options parameters


      var combinedParams = _objectSpread2(_objectSpread2({}, getQuery(search)), params); // throw error if no host or no pathname present


      if (!host.length || !pathname.length) {
        throw new Error('_buildURL: URL must match {host}/{pathname}?{query}');
      }

      var client = new ImgixClient(_objectSpread2({
        domain: host
      }, options));
      return client.buildURL(pathname, combinedParams);
    }
  }, {
    key: "_buildSrcSet",
    value: function _buildSrcSet(url) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var srcsetModifiers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var clientOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      if (url == null) {
        return '';
      }

      var _extractUrl2 = extractUrl({
        url: url,
        useHTTPS: clientOptions.useHTTPS
      }),
          host = _extractUrl2.host,
          pathname = _extractUrl2.pathname,
          search = _extractUrl2.search; // merge source URL parameters with options parameters


      var combinedParams = _objectSpread2(_objectSpread2({}, getQuery(search)), params); // throw error if no host or no pathname present


      if (!host.length || !pathname.length) {
        throw new Error('_buildOneStepURL: URL must match {host}/{pathname}?{query}');
      }

      var client = new ImgixClient(_objectSpread2({
        domain: host
      }, clientOptions));
      return client.buildSrcSet(pathname, combinedParams, srcsetModifiers);
    } // returns an array of width values used during srcset generation

  }, {
    key: "targetWidths",
    value: function targetWidths() {
      var minWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
      var maxWidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8192;
      var widthTolerance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.08;
      var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var minW = Math.floor(minWidth);
      var maxW = Math.floor(maxWidth);
      validateRange(minWidth, maxWidth);
      validateWidthTolerance(widthTolerance);
      var cacheKey = widthTolerance + '/' + minW + '/' + maxW; // First, check the cache.

      if (cacheKey in cache) {
        return cache[cacheKey];
      }

      if (minW === maxW) {
        return [minW];
      }

      var resolutions = [];
      var currentWidth = minW;

      while (currentWidth < maxW) {
        // While the currentWidth is less than the maxW, push the rounded
        // width onto the list of resolutions.
        resolutions.push(Math.round(currentWidth));
        currentWidth *= 1 + widthTolerance * 2;
      } // At this point, the last width in resolutions is less than the
      // currentWidth that caused the loop to terminate. This terminating
      // currentWidth is greater than or equal to the maxW. We want to
      // to stop at maxW, so we make sure our maxW is larger than the last
      // width in resolutions before pushing it (if it's equal we're done).


      if (resolutions[resolutions.length - 1] < maxW) {
        resolutions.push(maxW);
      }

      cache[cacheKey] = resolutions;
      return resolutions;
    }
  }]);

  return ImgixClient;
}();

export { ImgixClient as default };
