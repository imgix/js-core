'use strict';

var jsBase64 = require('js-base64');
var md5 = require('md5');
var ufo = require('ufo');

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

// package version used in the ix-lib parameter
var VERSION = '3.8.0';
// regex pattern used to determine if a domain is valid
var DOMAIN_REGEX = /^(?:[a-z\d\-_]{1,62}\.){0,125}(?:[a-z\d](?:\-(?=\-*[a-z\d])|[a-z]|\d){0,62}\.)[a-z\d]{1,63}$/i;
// minimum generated srcset width
var MIN_SRCSET_WIDTH = 100;
// maximum generated srcset width
var MAX_SRCSET_WIDTH = 8192;
// default tolerable percent difference between srcset pair widths
var DEFAULT_SRCSET_WIDTH_TOLERANCE = 0.08;

// default quality parameter values mapped by each dpr srcset entry
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
  if (!ufo.hasProtocol(url, true)) {
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
  return ufo.parseURL(url);
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
  var maxWidth = options.maxWidth === undefined ? MAX_SRCSET_WIDTH : options.maxWidth;

  // Validate the range unless we're using defaults for both
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
    this.settings = _objectSpread2(_objectSpread2({}, DEFAULT_OPTIONS), opts);
    // a cache to store memoized srcset width-pairs
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
  return _createClass(ImgixClient, [{
    key: "buildURL",
    value: function buildURL() {
      var rawPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var path = this._sanitizePath(rawPath, options);
      var finalParams = this._buildParams(params, options);
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
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      // If a custom encoder is present, use it
      // Otherwise just use the encodeURIComponent
      var useCustomEncoder = !!options.encoder;
      var customEncoder = options.encoder;
      var queryParams = [].concat(_toConsumableArray(this.settings.libraryParam ? ["ixlib=".concat(this.settings.libraryParam)] : []), _toConsumableArray(Object.entries(params).reduce(function (prev, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
        if (value == null) {
          return prev;
        }
        var encodedKey = useCustomEncoder ? customEncoder(key, value) : encodeURIComponent(key);
        var encodedValue = key.substr(-2) === '64' ? useCustomEncoder ? customEncoder(value, key) : jsBase64.Base64.encodeURI(value) : useCustomEncoder ? customEncoder(value, key) : encodeURIComponent(value);
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
      if (options.disablePathEncoding) {
        return '/' + _path;
      }
      if (options.encoder) {
        _path = options.encoder(_path);
      } else if (/^https?:\/\//.test(_path)) {
        // Use de/encodeURIComponent to ensure *all* characters are handled,
        // since it's being used as a path
        _path = encodeURIComponent(_path);
      } else {
        // Use de/encodeURI if we think the path is just a path,
        // so it leaves legal characters like '/' and '@' alone
        _path = encodeURI(_path).replace(/[#?:+]/g, encodeURIComponent);
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
        }), options), " ").concat(w, "w");
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
        }), options), " ").concat(dpr, "x");
      };
      var srcset = disableVariableQuality ? targetRatios.map(function (dpr) {
        return "".concat(_this2.buildURL(path, _objectSpread2(_objectSpread2({}, params), {}, {
          dpr: dpr
        }), options), " ").concat(dpr, "x");
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
        search = _extractUrl.search;
      // merge source URL parameters with options parameters
      var combinedParams = _objectSpread2(_objectSpread2({}, ufo.getQuery(search)), params);

      // throw error if no host or no pathname present
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
        search = _extractUrl2.search;
      // merge source URL parameters with options parameters
      var combinedParams = _objectSpread2(_objectSpread2({}, ufo.getQuery(search)), params);

      // throw error if no host or no pathname present
      if (!host.length || !pathname.length) {
        throw new Error('_buildOneStepURL: URL must match {host}/{pathname}?{query}');
      }
      var client = new ImgixClient(_objectSpread2({
        domain: host
      }, clientOptions));
      return client.buildSrcSet(pathname, combinedParams, srcsetModifiers);
    }

    // returns an array of width values used during srcset generation
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
      var cacheKey = widthTolerance + '/' + minW + '/' + maxW;

      // First, check the cache.
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
      }

      // At this point, the last width in resolutions is less than the
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
}();

module.exports = ImgixClient;
