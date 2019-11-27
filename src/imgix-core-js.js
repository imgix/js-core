(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'md5', 'js-base64'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(exports, require('md5'), require('js-base64').Base64);
  } else {
    var mod = {
      exports: {}
    };
    global.ImgixClient = factory(mod.exports, global.md5, global.Base64);
  }
})(this, function (exports, _md5, _jsBase64) {
  var md5 = _md5;
  var Base64 = _jsBase64.Base64 || _jsBase64;

  // package version used in the ix-lib parameter
  var VERSION = '2.2.1';
  // regex pattern used to determine if a domain is valid
  var DOMAIN_REGEX = /^(?:[a-z\d\-_]{1,62}\.){0,125}(?:[a-z\d](?:\-(?=\-*[a-z\d])|[a-z]|\d){0,62}\.)[a-z\d]{1,63}$/i;
  // returns an array of width values used during scrset generation
  var TARGET_WIDTHS = (function() {
    var resolutions = [];
    var prev = 100;
    var INCREMENT_PERCENTAGE = 8;
    var MAX_SIZE = 8192;
  
    var ensureEven = function(n){
      return 2 * Math.round(n / 2);
    };
  
    while (prev <= MAX_SIZE) {
      resolutions.push(ensureEven(prev));
      prev *= 1 + (INCREMENT_PERCENTAGE / 100) * 2;
    }
  
    resolutions.push(MAX_SIZE);
    return resolutions;
  })();
  // default ImgixClient settings passed in during instantiation
  var DEFAULTS = {
    domain: null,
    useHTTPS: true,
    includeLibraryParam: true
  };

  var ImgixClient = (function() {
    function ImgixClient(opts) {
      var key, val;

      this.settings = {};

      for (key in DEFAULTS) {
        val = DEFAULTS[key];
        this.settings[key] = val;
      }

      for (key in opts) {
        val = opts[key];
        this.settings[key] = val;
      }

      if (typeof this.settings.domain != "string") {
        throw new Error('ImgixClient must be passed a valid string domain');
      }

      if (DOMAIN_REGEX.exec(this.settings.domain) == null) {
        throw new Error(
          'Domain must be passed in as fully-qualified ' + 
          'domain name and should not include a protocol or any path ' + 
          'element, i.e. "example.imgix.net".');
      }

      if (this.settings.includeLibraryParam) {
        this.settings.libraryParam = "js-" + VERSION;
      }

      this.settings.urlPrefix = this.settings.useHTTPS ? 'https://' : 'http://'
    }

    ImgixClient.prototype.buildURL = function(path, params) {
      path = this._sanitizePath(path);

      if (params == null) {
        params = {};
      }

      var queryParams = this._buildParams(params);
      if (!!this.settings.secureURLToken) {
        queryParams = this._signParams(path, queryParams);
      }

      return this.settings.urlPrefix + this.settings.domain + path + queryParams;
    };

    ImgixClient.prototype._sanitizePath = function(path) {
      // Strip leading slash first (we'll re-add after encoding)
      path = path.replace(/^\//, '');

      if (/^https?:\/\//.test(path)) {
        // Use de/encodeURIComponent to ensure *all* characters are handled,
        // since it's being used as a path
        path = encodeURIComponent(path);
      } else {
        // Use de/encodeURI if we think the path is just a path,
        // so it leaves legal characters like '/' and '@' alone
        path = encodeURI(path).replace(/[#?:]/g, encodeURIComponent);
      }

      return '/' + path;
    };

    ImgixClient.prototype._buildParams = function(params) {
      if (this.settings.libraryParam) {
        params.ixlib = this.settings.libraryParam
      }

      var queryParams = [];
      var key, val, encodedKey, encodedVal;
      for (key in params) {
        val = params[key];
        encodedKey = encodeURIComponent(key);
        encodedVal;

        if (key.substr(-2) === '64') {
          encodedVal = Base64.encodeURI(val);
        } else {
          encodedVal = encodeURIComponent(val);
        }
        queryParams.push(encodedKey + "=" + encodedVal);
      }

      if (queryParams[0]) {
        queryParams[0] = "?" + queryParams[0];
      }
      return queryParams.join('&');
    };

    ImgixClient.prototype._signParams = function(path, queryParams) {
      var signatureBase = this.settings.secureURLToken + path + queryParams;
      var signature = md5(signatureBase);

      if (queryParams.length > 0) {
        return queryParams = queryParams + "&s=" + signature;
      } else {
        return queryParams = "?s=" + signature;
      }
    };

    ImgixClient.prototype.buildSrcSet = function (path, params) {
      var params = params || {};
      var width = params.w;
      var height = params.h;
      var aspectRatio = params.ar;

      if ((width) || (height && aspectRatio)) {
        return this._buildDPRSrcSet(path, params);
      }
      else {
        return this._buildSrcSetPairs(path, params);
      }
    };

    ImgixClient.prototype._buildSrcSetPairs = function(path, params) {
      var srcset = '';
      var currentWidth;

      for(var i = 0; i < TARGET_WIDTHS.length; i++) {
        currentWidth = TARGET_WIDTHS[i];
        params.w = currentWidth;
        srcset += this.buildURL(path, params) + ' ' + currentWidth + 'w,\n';
      }

      return srcset.slice(0,-2);
    };

    ImgixClient.prototype._buildDPRSrcSet = function(path, params) {
        var srcset = '';
        var targetRatios = [1, 2, 3, 4, 5];
        var currentRatio;

        for(var i = 0; i < targetRatios.length; i++) {
          currentRatio = targetRatios[i];
          params.dpr = currentRatio;
          srcset += this.buildURL(path, params) + ' ' + currentRatio + 'x,\n'
        }

        return srcset.slice(0,-2);
    };

    ImgixClient.VERSION = VERSION;

    return ImgixClient;
  })();

  return ImgixClient;
});
