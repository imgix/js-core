(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Imgix", ["exports", "js-md5", "urijs", "js-base64"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("js-md5"), require("urijs"), require("js-base64"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.md5, global.URI, global.Base64);
    global.Imgix = mod.exports;
  }
})(this, function (exports, _jsMd5, _urijs, _jsBase64) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var _md5 = _interopRequireDefault(_jsMd5);

  var _URI = _interopRequireDefault(_urijs);

  var _Base64 = _interopRequireDefault(_jsBase64);

  var VERSION = "0.2.4";

  exports.VERSION = VERSION;

  var Path = (function () {
    function Path(path, host) {
      var token = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
      var secure = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
      var librarySignature = arguments.length <= 4 || arguments[4] === undefined ? "js" : arguments[4];
      var libraryVersion = arguments.length <= 5 || arguments[5] === undefined ? VERSION : arguments[5];

      _classCallCheck(this, Path);

      this.path = path;
      this.host = host;
      this.token = token;
      this.secure = secure;
      this.queryParams = {};
      this.librarySignature = librarySignature;
      this.libraryVersion = libraryVersion;

      if (this.path.indexOf("http") === 0) {
        this.path = _URI["default"].encode(this.path);
      } else {
        this.path = _URI["default"].encodeReserved(this.path);
      }

      if (this.path[0] !== "/") {
        this.path = "/" + this.path;
      }
    }

    _createClass(Path, [{
      key: "toString",
      value: function toString() {
        var uri = new _URI["default"]({
          protocol: this.secure ? "https" : "http",
          hostname: this.host,
          path: this.path,
          query: this._query()
        });
        return uri.toString();
      }
    }, {
      key: "toUrl",
      value: function toUrl(newParams) {
        this.queryParams = _extends(this.queryParams, newParams);
        return this;
      }
    }, {
      key: "_query",
      value: function _query() {
        return _URI["default"].buildQuery(_extends(this._queryWithoutSignature(), this._signature()), false, false);
      }
    }, {
      key: "_b64EncodedQuery",
      value: function _b64EncodedQuery() {
        var query = this.queryParams;
        var encodedQuery = {};

        for (var key in query) {
          var val = query[key];

          if (key.substr(-2) == '64') {
            encodedQuery[key] = _Base64["default"].encodeURI(val);
          } else {
            encodedQuery[key] = val;
          }
        }

        return encodedQuery;
      }
    }, {
      key: "_queryWithoutSignature",
      value: function _queryWithoutSignature() {
        var query = this._b64EncodedQuery();

        if (this.librarySignature && this.libraryVersion) {
          query.ixlib = this.librarySignature + "-" + this.libraryVersion;
        }

        return query;
      }
    }, {
      key: "_signature",
      value: function _signature() {
        if (!this.token) {
          return {};
        }

        var signatureBase = this.token + this.path;
        var query = _URI["default"].buildQuery(this._b64EncodedQuery());

        if (!!query) {
          signatureBase += "?" + query;
        }

        return { s: (0, _md5["default"])(signatureBase) };
      }
    }]);

    return Path;
  })();

  exports.Path = Path;

  var Client = (function () {
    function Client(host) {
      var token = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var secure = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
      var librarySignature = arguments.length <= 3 || arguments[3] === undefined ? "js" : arguments[3];
      var libraryVersion = arguments.length <= 4 || arguments[4] === undefined ? VERSION : arguments[4];

      _classCallCheck(this, Client);

      this.host = host;
      this.token = token;
      this.secure = secure;
      this.librarySignature = librarySignature;
      this.libraryVersion = libraryVersion;
    }

    _createClass(Client, [{
      key: "path",
      value: function path(urlPath) {
        return new Path(urlPath, this.host, this.token, this.secure, this.librarySignature, this.libraryVersion);
      }
    }]);

    return Client;
  })();

  exports.Client = Client;
});
