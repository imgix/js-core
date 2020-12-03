(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.imgix = factory());
}(this, (function () { 'use strict';

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

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var crypt = createCommonjsModule(function (module) {
  (function() {
    var base64map
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

    crypt = {
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
          return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
        }

        // Else, assume array and swap all items
        for (var i = 0; i < n.length; i++)
          n[i] = crypt.endian(n[i]);
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

    module.exports = crypt;
  })();
  });

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

  var md5 = createCommonjsModule(function (module) {
  (function(){
    var crypt$1 = crypt,
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
      else if (!Array.isArray(message))
        message = message.toString();
      // else, assume byte array already

      var m = crypt$1.bytesToWords(message),
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

      return crypt$1.endian([a, b, c, d]);
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

    module.exports = function (message, options) {
      if (message === undefined || message === null)
        throw new Error('Illegal argument ' + message);

      var digestbytes = crypt$1.wordsToBytes(md5(message, options));
      return options && options.asBytes ? digestbytes :
          options && options.asString ? bin.bytesToString(digestbytes) :
          crypt$1.bytesToHex(digestbytes);
    };

  })();
  });

  var base64 = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
       module.exports = factory(global)
          ;
  }((
      typeof self !== 'undefined' ? self
          : typeof window !== 'undefined' ? window
          : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal
  : commonjsGlobal
  ), function(global) {
      // existing version for noConflict()
      global = global || {};
      var _Base64 = global.Base64;
      var version = "2.6.4";
      // constants
      var b64chars
          = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      var b64tab = function(bin) {
          var t = {};
          for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
          return t;
      }(b64chars);
      var fromCharCode = String.fromCharCode;
      // encoder stuff
      var cb_utob = function(c) {
          if (c.length < 2) {
              var cc = c.charCodeAt(0);
              return cc < 0x80 ? c
                  : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                  + fromCharCode(0x80 | (cc & 0x3f)))
                  : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                      + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                      + fromCharCode(0x80 | ( cc         & 0x3f)));
          } else {
              var cc = 0x10000
                  + (c.charCodeAt(0) - 0xD800) * 0x400
                  + (c.charCodeAt(1) - 0xDC00);
              return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                      + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                      + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                      + fromCharCode(0x80 | ( cc         & 0x3f)));
          }
      };
      var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
      var utob = function(u) {
          return u.replace(re_utob, cb_utob);
      };
      var cb_encode = function(ccc) {
          var padlen = [0, 2, 1][ccc.length % 3],
          ord = ccc.charCodeAt(0) << 16
              | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
              | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
          chars = [
              b64chars.charAt( ord >>> 18),
              b64chars.charAt((ord >>> 12) & 63),
              padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
              padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
          ];
          return chars.join('');
      };
      var btoa = global.btoa && typeof global.btoa == 'function'
          ? function(b){ return global.btoa(b) } : function(b) {
          if (b.match(/[^\x00-\xFF]/)) throw new RangeError(
              'The string contains invalid characters.'
          );
          return b.replace(/[\s\S]{1,3}/g, cb_encode);
      };
      var _encode = function(u) {
          return btoa(utob(String(u)));
      };
      var mkUriSafe = function (b64) {
          return b64.replace(/[+\/]/g, function(m0) {
              return m0 == '+' ? '-' : '_';
          }).replace(/=/g, '');
      };
      var encode = function(u, urisafe) {
          return urisafe ? mkUriSafe(_encode(u)) : _encode(u);
      };
      var encodeURI = function(u) { return encode(u, true) };
      var fromUint8Array;
      if (global.Uint8Array) fromUint8Array = function(a, urisafe) {
          // return btoa(fromCharCode.apply(null, a));
          var b64 = '';
          for (var i = 0, l = a.length; i < l; i += 3) {
              var a0 = a[i], a1 = a[i+1], a2 = a[i+2];
              var ord = a0 << 16 | a1 << 8 | a2;
              b64 +=    b64chars.charAt( ord >>> 18)
                  +     b64chars.charAt((ord >>> 12) & 63)
                  + ( typeof a1 != 'undefined'
                      ? b64chars.charAt((ord >>>  6) & 63) : '=')
                  + ( typeof a2 != 'undefined'
                      ? b64chars.charAt( ord         & 63) : '=');
          }
          return urisafe ? mkUriSafe(b64) : b64;
      };
      // decoder stuff
      var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
      var cb_btou = function(cccc) {
          switch(cccc.length) {
          case 4:
              var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                  |    ((0x3f & cccc.charCodeAt(1)) << 12)
                  |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                  |     (0x3f & cccc.charCodeAt(3)),
              offset = cp - 0x10000;
              return (fromCharCode((offset  >>> 10) + 0xD800)
                      + fromCharCode((offset & 0x3FF) + 0xDC00));
          case 3:
              return fromCharCode(
                  ((0x0f & cccc.charCodeAt(0)) << 12)
                      | ((0x3f & cccc.charCodeAt(1)) << 6)
                      |  (0x3f & cccc.charCodeAt(2))
              );
          default:
              return  fromCharCode(
                  ((0x1f & cccc.charCodeAt(0)) << 6)
                      |  (0x3f & cccc.charCodeAt(1))
              );
          }
      };
      var btou = function(b) {
          return b.replace(re_btou, cb_btou);
      };
      var cb_decode = function(cccc) {
          var len = cccc.length,
          padlen = len % 4,
          n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
              | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
              | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
              | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
          chars = [
              fromCharCode( n >>> 16),
              fromCharCode((n >>>  8) & 0xff),
              fromCharCode( n         & 0xff)
          ];
          chars.length -= [0, 0, 2, 1][padlen];
          return chars.join('');
      };
      var _atob = global.atob && typeof global.atob == 'function'
          ? function(a){ return global.atob(a) } : function(a){
          return a.replace(/\S{1,4}/g, cb_decode);
      };
      var atob = function(a) {
          return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g, ''));
      };
      var _decode = function(a) { return btou(_atob(a)) };
      var _fromURI = function(a) {
          return String(a).replace(/[-_]/g, function(m0) {
              return m0 == '-' ? '+' : '/'
          }).replace(/[^A-Za-z0-9\+\/]/g, '');
      };
      var decode = function(a){
          return _decode(_fromURI(a));
      };
      var toUint8Array;
      if (global.Uint8Array) toUint8Array = function(a) {
          return Uint8Array.from(atob(_fromURI(a)), function(c) {
              return c.charCodeAt(0);
          });
      };
      var noConflict = function() {
          var Base64 = global.Base64;
          global.Base64 = _Base64;
          return Base64;
      };
      // export Base64
      global.Base64 = {
          VERSION: version,
          atob: atob,
          btoa: btoa,
          fromBase64: decode,
          toBase64: encode,
          utob: utob,
          encode: encode,
          encodeURI: encodeURI,
          btou: btou,
          decode: decode,
          noConflict: noConflict,
          fromUint8Array: fromUint8Array,
          toUint8Array: toUint8Array
      };
      // if ES5 is available, make Base64.extendString() available
      if (typeof Object.defineProperty === 'function') {
          var noEnum = function(v){
              return {value:v,enumerable:false,writable:true,configurable:true};
          };
          global.Base64.extendString = function () {
              Object.defineProperty(
                  String.prototype, 'fromBase64', noEnum(function () {
                      return decode(this)
                  }));
              Object.defineProperty(
                  String.prototype, 'toBase64', noEnum(function (urisafe) {
                      return encode(this, urisafe)
                  }));
              Object.defineProperty(
                  String.prototype, 'toBase64URI', noEnum(function () {
                      return encode(this, true)
                  }));
          };
      }
      //
      // export Base64 to the namespace
      //
      if (global['Meteor']) { // Meteor.js
          Base64 = global.Base64;
      }
      // module.exports and AMD are mutually exclusive.
      // module.exports has precedence.
      if ( module.exports) {
          module.exports.Base64 = global.Base64;
      }
      // that's it!
      return {Base64: global.Base64}
  }));
  });
  var base64_1 = base64.Base64;

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
    if (options.widthTolerance !== undefined) {
      validateWidthTolerance(options.widthTolerance);
      var widthTolerance = options.widthTolerance;
    } else {
      var widthTolerance = DEFAULT_SRCSET_WIDTH_TOLERANCE;
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

        var key, val, encodedKey, encodedVal;

        for (key in params) {
          val = params[key];
          encodedKey = encodeURIComponent(key);

          if (key.substr(-2) === '64') {
            encodedVal = base64_1.encodeURI(val);
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
        var currentWidth;
        var targetWidths;
        var customWidths = options.widths;
        var widthTolerance = srcsetOptions[0],
            minWidth = srcsetOptions[1],
            maxWidth = srcsetOptions[2];

        if (customWidths) {
          validateWidths(customWidths);
          targetWidths = customWidths;
        } else {
          validateRange(minWidth, maxWidth);
          validateWidthTolerance(widthTolerance);
          targetWidths = this._generateTargetWidths(widthTolerance, minWidth, maxWidth);
        }

        var key;
        var queryParams = {};

        for (key in params) {
          queryParams[key] = params[key];
        }

        for (var i = 0; i < targetWidths.length; i++) {
          currentWidth = targetWidths[i];
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
        var key;
        var queryParams = {};

        for (key in params) {
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

  return ImgixClient;

})));
