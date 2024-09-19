(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ImgixClient = factory());
})(this, (function () { 'use strict';

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

  /**
   *  base64.ts
   *
   *  Licensed under the BSD 3-Clause License.
   *    http://opensource.org/licenses/BSD-3-Clause
   *
   *  References:
   *    http://en.wikipedia.org/wiki/Base64
   *
   * @author Dan Kogai (https://github.com/dankogai)
   */
  const version = '3.7.7';
  /**
   * @deprecated use lowercase `version`.
   */
  const VERSION$1 = version;
  const _hasBuffer = typeof Buffer === 'function';
  const _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
  const _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
  const b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const b64chs = Array.prototype.slice.call(b64ch);
  const b64tab = ((a) => {
      let tab = {};
      a.forEach((c, i) => tab[c] = i);
      return tab;
  })(b64chs);
  const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
  const _fromCC = String.fromCharCode.bind(String);
  const _U8Afrom = typeof Uint8Array.from === 'function'
      ? Uint8Array.from.bind(Uint8Array)
      : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
  const _mkUriSafe = (src) => src
      .replace(/=/g, '').replace(/[+\/]/g, (m0) => m0 == '+' ? '-' : '_');
  const _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, '');
  /**
   * polyfill version of `btoa`
   */
  const btoaPolyfill = (bin) => {
      // console.log('polyfilled');
      let u32, c0, c1, c2, asc = '';
      const pad = bin.length % 3;
      for (let i = 0; i < bin.length;) {
          if ((c0 = bin.charCodeAt(i++)) > 255 ||
              (c1 = bin.charCodeAt(i++)) > 255 ||
              (c2 = bin.charCodeAt(i++)) > 255)
              throw new TypeError('invalid character found');
          u32 = (c0 << 16) | (c1 << 8) | c2;
          asc += b64chs[u32 >> 18 & 63]
              + b64chs[u32 >> 12 & 63]
              + b64chs[u32 >> 6 & 63]
              + b64chs[u32 & 63];
      }
      return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
  };
  /**
   * does what `window.btoa` of web browsers do.
   * @param {String} bin binary string
   * @returns {string} Base64-encoded string
   */
  const _btoa = typeof btoa === 'function' ? (bin) => btoa(bin)
      : _hasBuffer ? (bin) => Buffer.from(bin, 'binary').toString('base64')
          : btoaPolyfill;
  const _fromUint8Array = _hasBuffer
      ? (u8a) => Buffer.from(u8a).toString('base64')
      : (u8a) => {
          // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
          const maxargs = 0x1000;
          let strs = [];
          for (let i = 0, l = u8a.length; i < l; i += maxargs) {
              strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
          }
          return _btoa(strs.join(''));
      };
  /**
   * converts a Uint8Array to a Base64 string.
   * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
   * @returns {string} Base64 string
   */
  const fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
  // This trick is found broken https://github.com/dankogai/js-base64/issues/130
  // const utob = (src: string) => unescape(encodeURIComponent(src));
  // reverting good old fationed regexp
  const cb_utob = (c) => {
      if (c.length < 2) {
          var cc = c.charCodeAt(0);
          return cc < 0x80 ? c
              : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                  + _fromCC(0x80 | (cc & 0x3f)))
                  : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                      + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                      + _fromCC(0x80 | (cc & 0x3f)));
      }
      else {
          var cc = 0x10000
              + (c.charCodeAt(0) - 0xD800) * 0x400
              + (c.charCodeAt(1) - 0xDC00);
          return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
              + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
              + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
              + _fromCC(0x80 | (cc & 0x3f)));
      }
  };
  const re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
  /**
   * @deprecated should have been internal use only.
   * @param {string} src UTF-8 string
   * @returns {string} UTF-16 string
   */
  const utob = (u) => u.replace(re_utob, cb_utob);
  //
  const _encode = _hasBuffer
      ? (s) => Buffer.from(s, 'utf8').toString('base64')
      : _TE
          ? (s) => _fromUint8Array(_TE.encode(s))
          : (s) => _btoa(utob(s));
  /**
   * converts a UTF-8-encoded string to a Base64 string.
   * @param {boolean} [urlsafe] if `true` make the result URL-safe
   * @returns {string} Base64 string
   */
  const encode = (src, urlsafe = false) => urlsafe
      ? _mkUriSafe(_encode(src))
      : _encode(src);
  /**
   * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
   * @returns {string} Base64 string
   */
  const encodeURI$1 = (src) => encode(src, true);
  // This trick is found broken https://github.com/dankogai/js-base64/issues/130
  // const btou = (src: string) => decodeURIComponent(escape(src));
  // reverting good old fationed regexp
  const re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
  const cb_btou = (cccc) => {
      switch (cccc.length) {
          case 4:
              var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                  | ((0x3f & cccc.charCodeAt(1)) << 12)
                  | ((0x3f & cccc.charCodeAt(2)) << 6)
                  | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
              return (_fromCC((offset >>> 10) + 0xD800)
                  + _fromCC((offset & 0x3FF) + 0xDC00));
          case 3:
              return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                  | ((0x3f & cccc.charCodeAt(1)) << 6)
                  | (0x3f & cccc.charCodeAt(2)));
          default:
              return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                  | (0x3f & cccc.charCodeAt(1)));
      }
  };
  /**
   * @deprecated should have been internal use only.
   * @param {string} src UTF-16 string
   * @returns {string} UTF-8 string
   */
  const btou = (b) => b.replace(re_btou, cb_btou);
  /**
   * polyfill version of `atob`
   */
  const atobPolyfill = (asc) => {
      // console.log('polyfilled');
      asc = asc.replace(/\s+/g, '');
      if (!b64re.test(asc))
          throw new TypeError('malformed base64.');
      asc += '=='.slice(2 - (asc.length & 3));
      let u24, bin = '', r1, r2;
      for (let i = 0; i < asc.length;) {
          u24 = b64tab[asc.charAt(i++)] << 18
              | b64tab[asc.charAt(i++)] << 12
              | (r1 = b64tab[asc.charAt(i++)]) << 6
              | (r2 = b64tab[asc.charAt(i++)]);
          bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
              : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                  : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
      }
      return bin;
  };
  /**
   * does what `window.atob` of web browsers do.
   * @param {String} asc Base64-encoded string
   * @returns {string} binary string
   */
  const _atob = typeof atob === 'function' ? (asc) => atob(_tidyB64(asc))
      : _hasBuffer ? (asc) => Buffer.from(asc, 'base64').toString('binary')
          : atobPolyfill;
  //
  const _toUint8Array = _hasBuffer
      ? (a) => _U8Afrom(Buffer.from(a, 'base64'))
      : (a) => _U8Afrom(_atob(a).split('').map(c => c.charCodeAt(0)));
  /**
   * converts a Base64 string to a Uint8Array.
   */
  const toUint8Array = (a) => _toUint8Array(_unURI(a));
  //
  const _decode = _hasBuffer
      ? (a) => Buffer.from(a, 'base64').toString('utf8')
      : _TD
          ? (a) => _TD.decode(_toUint8Array(a))
          : (a) => btou(_atob(a));
  const _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == '-' ? '+' : '/'));
  /**
   * converts a Base64 string to a UTF-8 string.
   * @param {String} src Base64 string.  Both normal and URL-safe are supported
   * @returns {string} UTF-8 string
   */
  const decode$1 = (src) => _decode(_unURI(src));
  /**
   * check if a value is a valid Base64 string
   * @param {String} src a value to check
    */
  const isValid = (src) => {
      if (typeof src !== 'string')
          return false;
      const s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
      return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
  };
  //
  const _noEnum = (v) => {
      return {
          value: v, enumerable: false, writable: true, configurable: true
      };
  };
  /**
   * extend String.prototype with relevant methods
   */
  const extendString = function () {
      const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
      _add('fromBase64', function () { return decode$1(this); });
      _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
      _add('toBase64URI', function () { return encode(this, true); });
      _add('toBase64URL', function () { return encode(this, true); });
      _add('toUint8Array', function () { return toUint8Array(this); });
  };
  /**
   * extend Uint8Array.prototype with relevant methods
   */
  const extendUint8Array = function () {
      const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
      _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
      _add('toBase64URI', function () { return fromUint8Array(this, true); });
      _add('toBase64URL', function () { return fromUint8Array(this, true); });
  };
  /**
   * extend Builtin prototypes with relevant methods
   */
  const extendBuiltins = () => {
      extendString();
      extendUint8Array();
  };
  const gBase64 = {
      version: version,
      VERSION: VERSION$1,
      atob: _atob,
      atobPolyfill: atobPolyfill,
      btoa: _btoa,
      btoaPolyfill: btoaPolyfill,
      fromBase64: decode$1,
      toBase64: encode,
      encode: encode,
      encodeURI: encodeURI$1,
      encodeURL: encodeURI$1,
      utob: utob,
      btou: btou,
      decode: decode$1,
      isValid: isValid,
      fromUint8Array: fromUint8Array,
      toUint8Array: toUint8Array,
      extendString: extendString,
      extendUint8Array: extendUint8Array,
      extendBuiltins: extendBuiltins
  };

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var md5$1 = {exports: {}};

  var crypt = {exports: {}};

  (function() {
    var base64map
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

    crypt$1 = {
      // Bit-wise rotation left
      rotl: function(n, b) {
        return (n << b) | (n >>> (32 - b));
      },

      // Bit-wise rotation right
      rotr: function(n, b) {
        return (n << (32 - b)) | (n >>> b);
      },

      // Swap big-endian to little-endian and vice versa
      endian: function(n) {
        // If number given, swap endian
        if (n.constructor == Number) {
          return crypt$1.rotl(n, 8) & 0x00FF00FF | crypt$1.rotl(n, 24) & 0xFF00FF00;
        }

        // Else, assume array and swap all items
        for (var i = 0; i < n.length; i++)
          n[i] = crypt$1.endian(n[i]);
        return n;
      },

      // Generate an array of any length of random bytes
      randomBytes: function(n) {
        for (var bytes = []; n > 0; n--)
          bytes.push(Math.floor(Math.random() * 256));
        return bytes;
      },

      // Convert a byte array to big-endian 32-bit words
      bytesToWords: function(bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
          words[b >>> 5] |= bytes[i] << (24 - b % 32);
        return words;
      },

      // Convert big-endian 32-bit words to a byte array
      wordsToBytes: function(words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
          bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        return bytes;
      },

      // Convert a byte array to a hex string
      bytesToHex: function(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join('');
      },

      // Convert a hex string to a byte array
      hexToBytes: function(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
      },

      // Convert a byte array to a base-64 string
      bytesToBase64: function(bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
          var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
          for (var j = 0; j < 4; j++)
            if (i * 8 + j * 6 <= bytes.length * 8)
              base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
            else
              base64.push('=');
        }
        return base64.join('');
      },

      // Convert a base-64 string to a byte array
      base64ToBytes: function(base64) {
        // Remove non-base-64 characters
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

        for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
            imod4 = ++i % 4) {
          if (imod4 == 0) continue;
          bytes.push(((base64map.indexOf(base64.charAt(i - 1))
              & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
              | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
        }
        return bytes;
      }
    };

    crypt.exports = crypt$1;
  })();

  var cryptExports = crypt.exports;

  var charenc = {
    // UTF-8 encoding
    utf8: {
      // Convert a string to a byte array
      stringToBytes: function(str) {
        return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
      },

      // Convert a byte array to a string
      bytesToString: function(bytes) {
        return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
      }
    },

    // Binary encoding
    bin: {
      // Convert a string to a byte array
      stringToBytes: function(str) {
        for (var bytes = [], i = 0; i < str.length; i++)
          bytes.push(str.charCodeAt(i) & 0xFF);
        return bytes;
      },

      // Convert a byte array to a string
      bytesToString: function(bytes) {
        for (var str = [], i = 0; i < bytes.length; i++)
          str.push(String.fromCharCode(bytes[i]));
        return str.join('');
      }
    }
  };

  var charenc_1 = charenc;

  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */

  // The _isBuffer check is for Safari 5-7 support, because it's missing
  // Object.prototype.constructor. Remove this eventually
  var isBuffer_1 = function (obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
  };

  function isBuffer (obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  }

  // For Node v0.10 support. Remove this eventually.
  function isSlowBuffer (obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
  }

  (function(){
    var crypt = cryptExports,
        utf8 = charenc_1.utf8,
        isBuffer = isBuffer_1,
        bin = charenc_1.bin,

    // The core
    md5 = function (message, options) {
      // Convert to byte array
      if (message.constructor == String)
        if (options && options.encoding === 'binary')
          message = bin.stringToBytes(message);
        else
          message = utf8.stringToBytes(message);
      else if (isBuffer(message))
        message = Array.prototype.slice.call(message, 0);
      else if (!Array.isArray(message) && message.constructor !== Uint8Array)
        message = message.toString();
      // else, assume byte array already

      var m = crypt.bytesToWords(message),
          l = message.length * 8,
          a =  1732584193,
          b = -271733879,
          c = -1732584194,
          d =  271733878;

      // Swap endian
      for (var i = 0; i < m.length; i++) {
        m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
               ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
      }

      // Padding
      m[l >>> 5] |= 0x80 << (l % 32);
      m[(((l + 64) >>> 9) << 4) + 14] = l;

      // Method shortcuts
      var FF = md5._ff,
          GG = md5._gg,
          HH = md5._hh,
          II = md5._ii;

      for (var i = 0; i < m.length; i += 16) {

        var aa = a,
            bb = b,
            cc = c,
            dd = d;

        a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
        d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
        c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
        b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
        a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
        d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
        c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
        b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
        a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
        d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
        c = FF(c, d, a, b, m[i+10], 17, -42063);
        b = FF(b, c, d, a, m[i+11], 22, -1990404162);
        a = FF(a, b, c, d, m[i+12],  7,  1804603682);
        d = FF(d, a, b, c, m[i+13], 12, -40341101);
        c = FF(c, d, a, b, m[i+14], 17, -1502002290);
        b = FF(b, c, d, a, m[i+15], 22,  1236535329);

        a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
        d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
        c = GG(c, d, a, b, m[i+11], 14,  643717713);
        b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
        a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
        d = GG(d, a, b, c, m[i+10],  9,  38016083);
        c = GG(c, d, a, b, m[i+15], 14, -660478335);
        b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
        a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
        d = GG(d, a, b, c, m[i+14],  9, -1019803690);
        c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
        b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
        a = GG(a, b, c, d, m[i+13],  5, -1444681467);
        d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
        c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
        b = GG(b, c, d, a, m[i+12], 20, -1926607734);

        a = HH(a, b, c, d, m[i+ 5],  4, -378558);
        d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
        c = HH(c, d, a, b, m[i+11], 16,  1839030562);
        b = HH(b, c, d, a, m[i+14], 23, -35309556);
        a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
        d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
        c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
        b = HH(b, c, d, a, m[i+10], 23, -1094730640);
        a = HH(a, b, c, d, m[i+13],  4,  681279174);
        d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
        c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
        b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
        a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
        d = HH(d, a, b, c, m[i+12], 11, -421815835);
        c = HH(c, d, a, b, m[i+15], 16,  530742520);
        b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

        a = II(a, b, c, d, m[i+ 0],  6, -198630844);
        d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
        c = II(c, d, a, b, m[i+14], 15, -1416354905);
        b = II(b, c, d, a, m[i+ 5], 21, -57434055);
        a = II(a, b, c, d, m[i+12],  6,  1700485571);
        d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
        c = II(c, d, a, b, m[i+10], 15, -1051523);
        b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
        a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
        d = II(d, a, b, c, m[i+15], 10, -30611744);
        c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
        b = II(b, c, d, a, m[i+13], 21,  1309151649);
        a = II(a, b, c, d, m[i+ 4],  6, -145523070);
        d = II(d, a, b, c, m[i+11], 10, -1120210379);
        c = II(c, d, a, b, m[i+ 2], 15,  718787259);
        b = II(b, c, d, a, m[i+ 9], 21, -343485551);

        a = (a + aa) >>> 0;
        b = (b + bb) >>> 0;
        c = (c + cc) >>> 0;
        d = (d + dd) >>> 0;
      }

      return crypt.endian([a, b, c, d]);
    };

    // Auxiliary functions
    md5._ff  = function (a, b, c, d, x, s, t) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._gg  = function (a, b, c, d, x, s, t) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._hh  = function (a, b, c, d, x, s, t) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._ii  = function (a, b, c, d, x, s, t) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };

    // Package private blocksize
    md5._blocksize = 16;
    md5._digestsize = 16;

    md5$1.exports = function (message, options) {
      if (message === undefined || message === null)
        throw new Error('Illegal argument ' + message);

      var digestbytes = crypt.wordsToBytes(md5(message, options));
      return options && options.asBytes ? digestbytes :
          options && options.asString ? bin.bytesToString(digestbytes) :
          crypt.bytesToHex(digestbytes);
    };

  })();

  var md5Exports = md5$1.exports;
  var md5 = /*@__PURE__*/getDefaultExportFromCjs(md5Exports);

  const PLUS_RE = /\+/g;
  function decode(text = "") {
    try {
      return decodeURIComponent("" + text);
    } catch {
      return "" + text;
    }
  }
  function decodeQueryKey(text) {
    return decode(text.replace(PLUS_RE, " "));
  }
  function decodeQueryValue(text) {
    return decode(text.replace(PLUS_RE, " "));
  }

  function parseQuery(parametersString = "") {
    const object = {};
    if (parametersString[0] === "?") {
      parametersString = parametersString.slice(1);
    }
    for (const parameter of parametersString.split("&")) {
      const s = parameter.match(/([^=]+)=?(.*)/) || [];
      if (s.length < 2) {
        continue;
      }
      const key = decodeQueryKey(s[1]);
      if (key === "__proto__" || key === "constructor") {
        continue;
      }
      const value = decodeQueryValue(s[2] || "");
      if (object[key] === void 0) {
        object[key] = value;
      } else if (Array.isArray(object[key])) {
        object[key].push(value);
      } else {
        object[key] = [object[key], value];
      }
    }
    return object;
  }

  const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
  const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
  const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
  function hasProtocol(inputString, opts = {}) {
    if (typeof opts === "boolean") {
      opts = { acceptRelative: opts };
    }
    if (opts.strict) {
      return PROTOCOL_STRICT_REGEX.test(inputString);
    }
    return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
  }
  function getQuery(input) {
    return parseQuery(parseURL(input).search);
  }

  const protocolRelative = Symbol.for("ufo:protocolRelative");
  function parseURL(input = "", defaultProto) {
    const _specialProtoMatch = input.match(
      /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
    );
    if (_specialProtoMatch) {
      const [, _proto, _pathname = ""] = _specialProtoMatch;
      return {
        protocol: _proto.toLowerCase(),
        pathname: _pathname,
        href: _proto + _pathname,
        auth: "",
        host: "",
        search: "",
        hash: ""
      };
    }
    if (!hasProtocol(input, { acceptRelative: true })) {
      return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
    }
    const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
    let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
    if (protocol === "file:") {
      path = path.replace(/\/(?=[A-Za-z]:)/, "");
    }
    const { pathname, search, hash } = parsePath(path);
    return {
      protocol: protocol.toLowerCase(),
      auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
      host,
      pathname,
      search,
      hash,
      [protocolRelative]: !protocol
    };
  }
  function parsePath(input = "") {
    const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
    return {
      pathname,
      search,
      hash
    };
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
          var encodedValue = key.substr(-2) === '64' ? useCustomEncoder ? customEncoder(value, key) : gBase64.encodeURI(value) : useCustomEncoder ? customEncoder(value, key) : encodeURIComponent(value);
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
        var combinedParams = _objectSpread2(_objectSpread2({}, getQuery(search)), params);

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
        var combinedParams = _objectSpread2(_objectSpread2({}, getQuery(search)), params);

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

  return ImgixClient;

}));
