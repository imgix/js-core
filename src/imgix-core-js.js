(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'md5', 'js-base64', 'crc'], factory);
  } else if (typeof exports !== 'undefined') {
    module.exports = factory(exports, require('md5'), require('js-base64').Base64, require('crc'));
  } else {
    var mod = {
      exports: {}
    };
    global.ImgixClient = factory(mod.exports, global.md5, global.Base64, global.crc);
  }
})(this, function (exports, _md5, _jsBase64, _crc) {
  var md5 = _md5;
  var Base64 = _jsBase64.Base64 || _jsBase64;
  var crc = _crc;

  var VERSION = '1.4.1';
  var SHARD_STRATEGY_CRC = 'crc';
  var SHARD_STRATEGY_CYCLE = 'cycle';
  var DOMAIN_REGEX = /^(?:[a-z\d\-_]{1,62}\.){0,125}(?:[a-z\d](?:\-(?=\-*[a-z\d])|[a-z]|\d){0,62}\.)[a-z\d]{1,63}$/i;
  var DEFAULTS = {
    host: null,
    domain: null,
    domains: [],
    useHTTPS: true,
    includeLibraryParam: true,
    shard_strategy: SHARD_STRATEGY_CRC
  };

  var ImgixClient = (function() {
    function ImgixClient(opts) {
      var key, val;

      this.settings = {};
      this._shard_next_index = 0;

      for (key in DEFAULTS) {
        val = DEFAULTS[key];
        this.settings[key] = val;
      }

      for (key in opts) {
        val = opts[key];
        this.settings[key] = val;
      }

      if (Array.isArray(this.settings.domains)) { 
        if (this.settings.domains.length > 1) {
          console.warn("Warning: Domain sharding has been deprecated and will be removed in the next major version.\nAs a result, the 'domains' argument will be deprecated in favor of 'domain' instead.");
        }
        else if (this.settings.domains.length == 0) {
          if (this.settings.host) {
            console.warn("'host' argument is deprecated; either use 'domain' or 'domains' instead.");
            this.settings.domains[0] = this.settings.host;
          }
          else if(this.settings.domain != null) {
            if (typeof this.settings.domain == "string") {
              this.settings.domains = [this.settings.domain];
            }
            else {
              throw new Error('ImgixClient.settings.domain only accepts a string argument');
            }
          }
          else {
            throw new Error('ImgixClient must be passed valid domain(s)');
          }
        }
      }
      else if (this.settings.domains.length != 0) {
        this.settings.domains = [this.settings.domains];
      }

      if (this.settings.shard_strategy !== SHARD_STRATEGY_CRC
          && this.settings.shard_strategy !== SHARD_STRATEGY_CYCLE) {
        throw new Error('Shard strategy must be one of ' +
          SHARD_STRATEGY_CRC + ' or ' + SHARD_STRATEGY_CYCLE);
      }

      this.settings.domains.forEach(function(domain) {
        if (DOMAIN_REGEX.exec(domain) == null) {
          throw new Error(
            'Domains must be passed in as fully-qualified ' + 
            'domain names and should not include a protocol or any path ' + 
            'element, i.e. "example.imgix.net".');
        }
      });

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

      return this.settings.urlPrefix + this._getDomain(path) + path + queryParams;
    };

    ImgixClient.prototype._getDomain = function(path) {
      if (this.settings.shard_strategy === SHARD_STRATEGY_CYCLE) {
        var domain = this.settings.domains[this._shard_next_index];
        this._shard_next_index = (this._shard_next_index + 1) % this.settings.domains.length;
        return domain;
      }
      else if (this.settings.shard_strategy === SHARD_STRATEGY_CRC) {
        return this.settings.domains[crc.crc32(path) % this.settings.domains.length];
      }
    }

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
        path = encodeURI(path);
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

    ImgixClient.VERSION = VERSION;
    ImgixClient.SHARD_STRATEGY_CRC = SHARD_STRATEGY_CRC;
    ImgixClient.SHARD_STRATEGY_CYCLE = SHARD_STRATEGY_CYCLE;

    return ImgixClient;
  })();

  return ImgixClient;
});
