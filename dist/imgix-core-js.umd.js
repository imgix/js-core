(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var FUNC_ERROR_TEXT = 'Expected a function';

  var nativeMax = Math.max;

  function restParam(func, start) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    start = nativeMax(start === undefined ? func.length - 1 : +start || 0, 0);
    return function () {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          rest = Array(length);

      while (++index < length) {
        rest[index] = args[start + index];
      }
      switch (start) {
        case 0:
          return func.call(this, rest);
        case 1:
          return func.call(this, args[0], rest);
        case 2:
          return func.call(this, args[0], args[1], rest);
      }
      var otherArgs = Array(start + 1);
      index = -1;
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = rest;
      return func.apply(this, otherArgs);
    };
  }

  module.exports = restParam;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Imgix", ["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  function arrayCopy(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  module.exports = arrayCopy;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Imgix", ["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  module.exports = arrayEach;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Imgix", ["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  function baseCopy(source, props, object) {
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = source[key];
    }
    return object;
  }

  module.exports = baseCopy;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './createBaseFor'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./createBaseFor'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.createBaseFor);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _createBaseFor) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _createBaseFor2 = _interopRequireDefault(_createBaseFor);

  var baseFor = (0, _createBaseFor2['default'])();

  module.exports = baseFor;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './baseFor', '../object/keysIn'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./baseFor'), require('../object/keysIn'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.baseFor, global.keysIn);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _baseFor, _objectKeysIn) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _baseFor2 = _interopRequireDefault(_baseFor);

  var _keysIn = _interopRequireDefault(_objectKeysIn);

  function baseForIn(object, iteratee) {
    return (0, _baseFor2['default'])(object, iteratee, _keysIn['default']);
  }

  module.exports = baseForIn;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  function baseIsFunction(value) {
    return typeof value == 'function' || false;
  }

  module.exports = baseIsFunction;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './arrayEach', './baseMergeDeep', '../lang/isArray', './isArrayLike', '../lang/isObject', './isObjectLike', '../lang/isTypedArray', '../object/keys'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./arrayEach'), require('./baseMergeDeep'), require('../lang/isArray'), require('./isArrayLike'), require('../lang/isObject'), require('./isObjectLike'), require('../lang/isTypedArray'), require('../object/keys'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.arrayEach, global.baseMergeDeep, global.isArray, global.isArrayLike, global.isObject, global.isObjectLike, global.isTypedArray, global.keys);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _arrayEach, _baseMergeDeep, _langIsArray, _isArrayLike, _langIsObject, _isObjectLike, _langIsTypedArray, _objectKeys) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _arrayEach2 = _interopRequireDefault(_arrayEach);

  var _baseMergeDeep2 = _interopRequireDefault(_baseMergeDeep);

  var _isArray = _interopRequireDefault(_langIsArray);

  var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

  var _isObject = _interopRequireDefault(_langIsObject);

  var _isObjectLike2 = _interopRequireDefault(_isObjectLike);

  var _isTypedArray = _interopRequireDefault(_langIsTypedArray);

  var _keys = _interopRequireDefault(_objectKeys);

  function baseMerge(object, source, customizer, stackA, stackB) {
    if (!(0, _isObject['default'])(object)) {
      return object;
    }
    var isSrcArr = (0, _isArrayLike2['default'])(source) && ((0, _isArray['default'])(source) || (0, _isTypedArray['default'])(source)),
        props = isSrcArr ? null : (0, _keys['default'])(source);

    (0, _arrayEach2['default'])(props || source, function (srcValue, key) {
      if (props) {
        key = srcValue;
        srcValue = source[key];
      }
      if ((0, _isObjectLike2['default'])(srcValue)) {
        stackA || (stackA = []);
        stackB || (stackB = []);
        (0, _baseMergeDeep2['default'])(object, source, key, baseMerge, customizer, stackA, stackB);
      } else {
        var value = object[key],
            result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
            isCommon = result === undefined;

        if (isCommon) {
          result = srcValue;
        }
        if ((result !== undefined || isSrcArr && !(key in object)) && (isCommon || (result === result ? result !== value : value === value))) {
          object[key] = result;
        }
      }
    });
    return object;
  }

  module.exports = baseMerge;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './arrayCopy', '../lang/isArguments', '../lang/isArray', './isArrayLike', '../lang/isPlainObject', '../lang/isTypedArray', '../lang/toPlainObject'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./arrayCopy'), require('../lang/isArguments'), require('../lang/isArray'), require('./isArrayLike'), require('../lang/isPlainObject'), require('../lang/isTypedArray'), require('../lang/toPlainObject'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.arrayCopy, global.isArguments, global.isArray, global.isArrayLike, global.isPlainObject, global.isTypedArray, global.toPlainObject);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _arrayCopy, _langIsArguments, _langIsArray, _isArrayLike, _langIsPlainObject, _langIsTypedArray, _langToPlainObject) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _arrayCopy2 = _interopRequireDefault(_arrayCopy);

  var _isArguments = _interopRequireDefault(_langIsArguments);

  var _isArray = _interopRequireDefault(_langIsArray);

  var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

  var _isPlainObject = _interopRequireDefault(_langIsPlainObject);

  var _isTypedArray = _interopRequireDefault(_langIsTypedArray);

  var _toPlainObject = _interopRequireDefault(_langToPlainObject);

  function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
    var length = stackA.length,
        srcValue = source[key];

    while (length--) {
      if (stackA[length] == srcValue) {
        object[key] = stackB[length];
        return;
      }
    }
    var value = object[key],
        result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
        isCommon = result === undefined;

    if (isCommon) {
      result = srcValue;
      if ((0, _isArrayLike2['default'])(srcValue) && ((0, _isArray['default'])(srcValue) || (0, _isTypedArray['default'])(srcValue))) {
        result = (0, _isArray['default'])(value) ? value : (0, _isArrayLike2['default'])(value) ? (0, _arrayCopy2['default'])(value) : [];
      } else if ((0, _isPlainObject['default'])(srcValue) || (0, _isArguments['default'])(srcValue)) {
        result = (0, _isArguments['default'])(value) ? (0, _toPlainObject['default'])(value) : (0, _isPlainObject['default'])(value) ? value : {};
      } else {
        isCommon = false;
      }
    }

    stackA.push(srcValue);
    stackB.push(result);

    if (isCommon) {
      object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
    } else if (result === result ? result !== value : value === value) {
      object[key] = result;
    }
  }

  module.exports = baseMergeDeep;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './toObject'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./toObject'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.toObject);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _toObject) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _toObject2 = _interopRequireDefault(_toObject);

  function baseProperty(key) {
    return function (object) {
      return object == null ? undefined : (0, _toObject2['default'])(object)[key];
    };
  }

  module.exports = baseProperty;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  function baseToString(value) {
    if (typeof value == 'string') {
      return value;
    }
    return value == null ? '' : value + '';
  }

  module.exports = baseToString;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../utility/identity'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../utility/identity'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.identity);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _utilityIdentity) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _identity = _interopRequireDefault(_utilityIdentity);

  function bindCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return _identity['default'];
    }
    if (thisArg === undefined) {
      return func;
    }
    switch (argCount) {
      case 1:
        return function (value) {
          return func.call(thisArg, value);
        };
      case 3:
        return function (value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
      case 4:
        return function (accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      case 5:
        return function (value, other, key, object, source) {
          return func.call(thisArg, value, other, key, object, source);
        };
    }
    return function () {
      return func.apply(thisArg, arguments);
    };
  }

  module.exports = bindCallback;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './bindCallback', './isIterateeCall', '../function/restParam'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./bindCallback'), require('./isIterateeCall'), require('../function/restParam'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.bindCallback, global.isIterateeCall, global.restParam);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _bindCallback, _isIterateeCall, _functionRestParam) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _bindCallback2 = _interopRequireDefault(_bindCallback);

  var _isIterateeCall2 = _interopRequireDefault(_isIterateeCall);

  var _restParam = _interopRequireDefault(_functionRestParam);

  function createAssigner(assigner) {
    return (0, _restParam['default'])(function (object, sources) {
      var index = -1,
          length = object == null ? 0 : sources.length,
          customizer = length > 2 ? sources[length - 2] : undefined,
          guard = length > 2 ? sources[2] : undefined,
          thisArg = length > 1 ? sources[length - 1] : undefined;

      if (typeof customizer == 'function') {
        customizer = (0, _bindCallback2['default'])(customizer, thisArg, 5);
        length -= 2;
      } else {
        customizer = typeof thisArg == 'function' ? thisArg : undefined;
        length -= customizer ? 1 : 0;
      }
      if (guard && (0, _isIterateeCall2['default'])(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, customizer);
        }
      }
      return object;
    });
  }

  module.exports = createAssigner;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './toObject'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./toObject'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.toObject);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _toObject) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _toObject2 = _interopRequireDefault(_toObject);

  function createBaseFor(fromRight) {
    return function (object, iteratee, keysFunc) {
      var iterable = (0, _toObject2['default'])(object),
          props = keysFunc(object),
          length = props.length,
          index = fromRight ? length : -1;

      while (fromRight ? index-- : ++index < length) {
        var key = props[index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  module.exports = createBaseFor;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './baseProperty'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./baseProperty'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.baseProperty);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _baseProperty) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _baseProperty2 = _interopRequireDefault(_baseProperty);

  var getLength = (0, _baseProperty2['default'])('length');

  module.exports = getLength;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../lang/isNative'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../lang/isNative'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.isNative);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _langIsNative) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isNative = _interopRequireDefault(_langIsNative);

  function getNative(object, key) {
    var value = object == null ? undefined : object[key];
    return (0, _isNative['default'])(value) ? value : undefined;
  }

  module.exports = getNative;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './getLength', './isLength'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./getLength'), require('./isLength'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.getLength, global.isLength);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _getLength, _isLength) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _getLength2 = _interopRequireDefault(_getLength);

  var _isLength2 = _interopRequireDefault(_isLength);

  function isArrayLike(value) {
    return value != null && (0, _isLength2['default'])((0, _getLength2['default'])(value));
  }

  module.exports = isArrayLike;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var isHostObject = (function () {
    try {
      Object({ 'toString': 0 } + '');
    } catch (e) {
      return function () {
        return false;
      };
    }
    return function (value) {
      return typeof value.toString != 'function' && typeof (value + '') == 'string';
    };
  })();

  module.exports = isHostObject;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var reIsUint = /^\d+$/;

  var MAX_SAFE_INTEGER = 9007199254740991;

  function isIndex(value, length) {
    value = typeof value == 'number' || reIsUint.test(value) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  module.exports = isIndex;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './isArrayLike', './isIndex', '../lang/isObject'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./isArrayLike'), require('./isIndex'), require('../lang/isObject'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.isArrayLike, global.isIndex, global.isObject);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _isArrayLike, _isIndex, _langIsObject) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isArrayLike2 = _interopRequireDefault(_isArrayLike);

  var _isIndex2 = _interopRequireDefault(_isIndex);

  var _isObject = _interopRequireDefault(_langIsObject);

  function isIterateeCall(value, index, object) {
    if (!(0, _isObject['default'])(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number' ? (0, _isArrayLike2['default'])(object) && (0, _isIndex2['default'])(index, object.length) : type == 'string' && index in object) {
      var other = object[index];
      return value === value ? value === other : other !== other;
    }
    return false;
  }

  module.exports = isIterateeCall;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var MAX_SAFE_INTEGER = 9007199254740991;

  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  module.exports = isLength;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  module.exports = isObjectLike;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var objectTypes = {
    'function': true,
    'object': true
  };

  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  var root = freeGlobal || freeWindow !== (undefined && undefined.window) && freeWindow || freeSelf || undefined;

  module.exports = root;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', './baseForIn', '../lang/isArguments', './isHostObject', './isObjectLike', '../support'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./baseForIn'), require('../lang/isArguments'), require('./isHostObject'), require('./isObjectLike'), require('../support'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.baseForIn, global.isArguments, global.isHostObject, global.isObjectLike, global.support);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _baseForIn, _langIsArguments, _isHostObject, _isObjectLike, _support) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _baseForIn2 = _interopRequireDefault(_baseForIn);

  var _isArguments = _interopRequireDefault(_langIsArguments);

  var _isHostObject2 = _interopRequireDefault(_isHostObject);

  var _isObjectLike2 = _interopRequireDefault(_isObjectLike);

  var _support2 = _interopRequireDefault(_support);

  var objectTag = '[object Object]';

  var objectProto = Object.prototype;

  var hasOwnProperty = objectProto.hasOwnProperty;

  var objToString = objectProto.toString;

  function shimIsPlainObject(value) {
    var Ctor;

    if (!((0, _isObjectLike2['default'])(value) && objToString.call(value) == objectTag && !(0, _isHostObject2['default'])(value)) || !hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)) || !_support2['default'].argsTag && (0, _isArguments['default'])(value)) {
      return false;
    }

    var result;
    if (_support2['default'].ownLast) {
      (0, _baseForIn2['default'])(value, function (subValue, key, object) {
        result = hasOwnProperty.call(object, key);
        return false;
      });
      return result !== false;
    }

    (0, _baseForIn2['default'])(value, function (subValue, key) {
      result = key;
    });
    return result === undefined || hasOwnProperty.call(value, result);
  }

  module.exports = shimIsPlainObject;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../lang/isArguments', '../lang/isArray', './isIndex', './isLength', '../lang/isString', '../object/keysIn'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../lang/isArguments'), require('../lang/isArray'), require('./isIndex'), require('./isLength'), require('../lang/isString'), require('../object/keysIn'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.isArguments, global.isArray, global.isIndex, global.isLength, global.isString, global.keysIn);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _langIsArguments, _langIsArray, _isIndex, _isLength, _langIsString, _objectKeysIn) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isArguments = _interopRequireDefault(_langIsArguments);

  var _isArray = _interopRequireDefault(_langIsArray);

  var _isIndex2 = _interopRequireDefault(_isIndex);

  var _isLength2 = _interopRequireDefault(_isLength);

  var _isString = _interopRequireDefault(_langIsString);

  var _keysIn = _interopRequireDefault(_objectKeysIn);

  var objectProto = Object.prototype;

  var hasOwnProperty = objectProto.hasOwnProperty;

  function shimKeys(object) {
    var props = (0, _keysIn['default'])(object),
        propsLength = props.length,
        length = propsLength && object.length;

    var allowIndexes = !!length && (0, _isLength2['default'])(length) && ((0, _isArray['default'])(object) || (0, _isArguments['default'])(object) || (0, _isString['default'])(object));

    var index = -1,
        result = [];

    while (++index < propsLength) {
      var key = props[index];
      if (allowIndexes && (0, _isIndex2['default'])(key, length) || hasOwnProperty.call(object, key)) {
        result.push(key);
      }
    }
    return result;
  }

  module.exports = shimKeys;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../lang/isObject', '../lang/isString', '../support'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../lang/isObject'), require('../lang/isString'), require('../support'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.isObject, global.isString, global.support);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _langIsObject, _langIsString, _support) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isObject = _interopRequireDefault(_langIsObject);

  var _isString = _interopRequireDefault(_langIsString);

  var _support2 = _interopRequireDefault(_support);

  function toObject(value) {
    if (_support2['default'].unindexedChars && (0, _isString['default'])(value)) {
      var index = -1,
          length = value.length,
          result = Object(value);

      while (++index < length) {
        result[index] = value.charAt(index);
      }
      return result;
    }
    return (0, _isObject['default'])(value) ? value : Object(value);
  }

  module.exports = toObject;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/isArrayLike', '../internal/isObjectLike', '../support'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/isArrayLike'), require('../internal/isObjectLike'), require('../support'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.isArrayLike, global.isObjectLike, global.support);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalIsArrayLike, _internalIsObjectLike, _support) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isArrayLike = _interopRequireDefault(_internalIsArrayLike);

  var _isObjectLike = _interopRequireDefault(_internalIsObjectLike);

  var _support2 = _interopRequireDefault(_support);

  var argsTag = '[object Arguments]';

  var objectProto = Object.prototype;

  var hasOwnProperty = objectProto.hasOwnProperty;

  var objToString = objectProto.toString;

  var propertyIsEnumerable = objectProto.propertyIsEnumerable;

  function isArguments(value) {
    return (0, _isObjectLike['default'])(value) && (0, _isArrayLike['default'])(value) && objToString.call(value) == argsTag;
  }

  if (!_support2['default'].argsTag) {
    isArguments = function (value) {
      return (0, _isObjectLike['default'])(value) && (0, _isArrayLike['default'])(value) && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
    };
  }

  module.exports = isArguments;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/getNative', '../internal/isLength', '../internal/isObjectLike'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/getNative'), require('../internal/isLength'), require('../internal/isObjectLike'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.getNative, global.isLength, global.isObjectLike);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalGetNative, _internalIsLength, _internalIsObjectLike) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _getNative = _interopRequireDefault(_internalGetNative);

  var _isLength = _interopRequireDefault(_internalIsLength);

  var _isObjectLike = _interopRequireDefault(_internalIsObjectLike);

  var arrayTag = '[object Array]';

  var objectProto = Object.prototype;

  var objToString = objectProto.toString;

  var nativeIsArray = (0, _getNative['default'])(Array, 'isArray');

  var isArray = nativeIsArray || function (value) {
    return (0, _isObjectLike['default'])(value) && (0, _isLength['default'])(value.length) && objToString.call(value) == arrayTag;
  };

  module.exports = isArray;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/baseIsFunction', '../internal/getNative', '../internal/root'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/baseIsFunction'), require('../internal/getNative'), require('../internal/root'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.baseIsFunction, global.getNative, global.root);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalBaseIsFunction, _internalGetNative, _internalRoot) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _baseIsFunction = _interopRequireDefault(_internalBaseIsFunction);

  var _getNative = _interopRequireDefault(_internalGetNative);

  var _root = _interopRequireDefault(_internalRoot);

  var funcTag = '[object Function]';

  var objectProto = Object.prototype;

  var objToString = objectProto.toString;

  var Uint8Array = (0, _getNative['default'])(_root['default'], 'Uint8Array');

  var isFunction = !((0, _baseIsFunction['default'])(/x/) || Uint8Array && !(0, _baseIsFunction['default'])(Uint8Array)) ? _baseIsFunction['default'] : function (value) {
    return objToString.call(value) == funcTag;
  };

  module.exports = isFunction;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../string/escapeRegExp', '../internal/isHostObject', '../internal/isObjectLike'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../string/escapeRegExp'), require('../internal/isHostObject'), require('../internal/isObjectLike'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.escapeRegExp, global.isHostObject, global.isObjectLike);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _stringEscapeRegExp, _internalIsHostObject, _internalIsObjectLike) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _escapeRegExp = _interopRequireDefault(_stringEscapeRegExp);

  var _isHostObject = _interopRequireDefault(_internalIsHostObject);

  var _isObjectLike = _interopRequireDefault(_internalIsObjectLike);

  var funcTag = '[object Function]';

  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  var objectProto = Object.prototype;

  var fnToString = Function.prototype.toString;

  var hasOwnProperty = objectProto.hasOwnProperty;

  var objToString = objectProto.toString;

  var reIsNative = RegExp('^' + (0, _escapeRegExp['default'])(fnToString.call(hasOwnProperty)).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');

  function isNative(value) {
    if (value == null) {
      return false;
    }
    if (objToString.call(value) == funcTag) {
      return reIsNative.test(fnToString.call(value));
    }
    return (0, _isObjectLike['default'])(value) && ((0, _isHostObject['default'])(value) ? reIsNative : reIsHostCtor).test(value);
  }

  module.exports = isNative;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  function isObject(value) {
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  module.exports = isObject;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/getNative', './isArguments', '../internal/shimIsPlainObject', '../support'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/getNative'), require('./isArguments'), require('../internal/shimIsPlainObject'), require('../support'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.getNative, global.isArguments, global.shimIsPlainObject, global.support);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalGetNative, _isArguments, _internalShimIsPlainObject, _support) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _getNative = _interopRequireDefault(_internalGetNative);

  var _isArguments2 = _interopRequireDefault(_isArguments);

  var _shimIsPlainObject = _interopRequireDefault(_internalShimIsPlainObject);

  var _support2 = _interopRequireDefault(_support);

  var objectTag = '[object Object]';

  var objectProto = Object.prototype;

  var objToString = objectProto.toString;

  var getPrototypeOf = (0, _getNative['default'])(Object, 'getPrototypeOf');

  var isPlainObject = !getPrototypeOf ? _shimIsPlainObject['default'] : function (value) {
    if (!(value && objToString.call(value) == objectTag) || !_support2['default'].argsTag && (0, _isArguments2['default'])(value)) {
      return false;
    }
    var valueOf = (0, _getNative['default'])(value, 'valueOf'),
        objProto = valueOf && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

    return objProto ? value == objProto || getPrototypeOf(value) == objProto : (0, _shimIsPlainObject['default'])(value);
  };

  module.exports = isPlainObject;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/isObjectLike'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/isObjectLike'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.isObjectLike);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalIsObjectLike) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _isObjectLike = _interopRequireDefault(_internalIsObjectLike);

  var stringTag = '[object String]';

  var objectProto = Object.prototype;

  var objToString = objectProto.toString;

  function isString(value) {
    return typeof value == 'string' || (0, _isObjectLike['default'])(value) && objToString.call(value) == stringTag;
  }

  module.exports = isString;
});
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define('Imgix', ['exports', 'module', '../internal/isLength', '../internal/isObjectLike'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('../internal/isLength'), require('../internal/isObjectLike'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.isLength, global.isObjectLike);
        global.Imgix = mod.exports;
    }
})(this, function (exports, module, _internalIsLength, _internalIsObjectLike) {
    'use strict';

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _isLength = _interopRequireDefault(_internalIsLength);

    var _isObjectLike = _interopRequireDefault(_internalIsObjectLike);

    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        mapTag = '[object Map]',
        numberTag = '[object Number]',
        objectTag = '[object Object]',
        regexpTag = '[object RegExp]',
        setTag = '[object Set]',
        stringTag = '[object String]',
        weakMapTag = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

    var objectProto = Object.prototype;

    var objToString = objectProto.toString;

    function isTypedArray(value) {
        return (0, _isObjectLike['default'])(value) && (0, _isLength['default'])(value.length) && !!typedArrayTags[objToString.call(value)];
    }

    module.exports = isTypedArray;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/baseCopy', '../object/keysIn'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/baseCopy'), require('../object/keysIn'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.baseCopy, global.keysIn);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalBaseCopy, _objectKeysIn) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _baseCopy = _interopRequireDefault(_internalBaseCopy);

  var _keysIn = _interopRequireDefault(_objectKeysIn);

  function toPlainObject(value) {
    return (0, _baseCopy['default'])(value, (0, _keysIn['default'])(value));
  }

  module.exports = toPlainObject;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/getNative', '../internal/isArrayLike', '../lang/isObject', '../internal/shimKeys', '../support'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/getNative'), require('../internal/isArrayLike'), require('../lang/isObject'), require('../internal/shimKeys'), require('../support'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.getNative, global.isArrayLike, global.isObject, global.shimKeys, global.support);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalGetNative, _internalIsArrayLike, _langIsObject, _internalShimKeys, _support) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _getNative = _interopRequireDefault(_internalGetNative);

  var _isArrayLike = _interopRequireDefault(_internalIsArrayLike);

  var _isObject = _interopRequireDefault(_langIsObject);

  var _shimKeys = _interopRequireDefault(_internalShimKeys);

  var _support2 = _interopRequireDefault(_support);

  var nativeKeys = (0, _getNative['default'])(Object, 'keys');

  var keys = !nativeKeys ? _shimKeys['default'] : function (object) {
    var Ctor = object == null ? null : object.constructor;
    if (typeof Ctor == 'function' && Ctor.prototype === object || (typeof object == 'function' ? _support2['default'].enumPrototypes : (0, _isArrayLike['default'])(object))) {
      return (0, _shimKeys['default'])(object);
    }
    return (0, _isObject['default'])(object) ? nativeKeys(object) : [];
  };

  module.exports = keys;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/arrayEach', '../lang/isArguments', '../lang/isArray', '../lang/isFunction', '../internal/isIndex', '../internal/isLength', '../lang/isObject', '../lang/isString', '../support'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/arrayEach'), require('../lang/isArguments'), require('../lang/isArray'), require('../lang/isFunction'), require('../internal/isIndex'), require('../internal/isLength'), require('../lang/isObject'), require('../lang/isString'), require('../support'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.arrayEach, global.isArguments, global.isArray, global.isFunction, global.isIndex, global.isLength, global.isObject, global.isString, global.support);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalArrayEach, _langIsArguments, _langIsArray, _langIsFunction, _internalIsIndex, _internalIsLength, _langIsObject, _langIsString, _support) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _arrayEach = _interopRequireDefault(_internalArrayEach);

  var _isArguments = _interopRequireDefault(_langIsArguments);

  var _isArray = _interopRequireDefault(_langIsArray);

  var _isFunction = _interopRequireDefault(_langIsFunction);

  var _isIndex = _interopRequireDefault(_internalIsIndex);

  var _isLength = _interopRequireDefault(_internalIsLength);

  var _isObject = _interopRequireDefault(_langIsObject);

  var _isString = _interopRequireDefault(_langIsString);

  var _support2 = _interopRequireDefault(_support);

  var arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      stringTag = '[object String]';

  var shadowProps = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

  var errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;

  var hasOwnProperty = objectProto.hasOwnProperty;

  var objToString = objectProto.toString;

  var nonEnumProps = {};
  nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolTag] = nonEnumProps[stringTag] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectTag] = { 'constructor': true };

  (0, _arrayEach['default'])(shadowProps, function (key) {
    for (var tag in nonEnumProps) {
      if (hasOwnProperty.call(nonEnumProps, tag)) {
        var props = nonEnumProps[tag];
        props[key] = hasOwnProperty.call(props, key);
      }
    }
  });

  function keysIn(object) {
    if (object == null) {
      return [];
    }
    if (!(0, _isObject['default'])(object)) {
      object = Object(object);
    }
    var length = object.length;

    length = length && (0, _isLength['default'])(length) && ((0, _isArray['default'])(object) || (0, _isArguments['default'])(object) || (0, _isString['default'])(object)) && length || 0;

    var Ctor = object.constructor,
        index = -1,
        proto = (0, _isFunction['default'])(Ctor) && Ctor.prototype || objectProto,
        isProto = proto === object,
        result = Array(length),
        skipIndexes = length > 0,
        skipErrorProps = _support2['default'].enumErrorProps && (object === errorProto || object instanceof Error),
        skipProto = _support2['default'].enumPrototypes && (0, _isFunction['default'])(object);

    while (++index < length) {
      result[index] = index + '';
    }

    for (var key in object) {
      if (!(skipProto && key == 'prototype') && !(skipErrorProps && (key == 'message' || key == 'name')) && !(skipIndexes && (0, _isIndex['default'])(key, length)) && !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    if (_support2['default'].nonEnumShadows && object !== objectProto) {
      var tag = object === stringProto ? stringTag : object === errorProto ? errorTag : objToString.call(object),
          nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];

      if (tag == objectTag) {
        proto = objectProto;
      }
      length = shadowProps.length;
      while (length--) {
        key = shadowProps[length];
        var nonEnum = nonEnums[key];
        if (!(isProto && nonEnum) && (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
          result.push(key);
        }
      }
    }
    return result;
  }

  module.exports = keysIn;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/baseMerge', '../internal/createAssigner'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/baseMerge'), require('../internal/createAssigner'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.baseMerge, global.createAssigner);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalBaseMerge, _internalCreateAssigner) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _baseMerge = _interopRequireDefault(_internalBaseMerge);

  var _createAssigner = _interopRequireDefault(_internalCreateAssigner);

  var merge = (0, _createAssigner['default'])(_baseMerge['default']);

  module.exports = merge;
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Imgix', ['exports', 'module', '../internal/baseToString'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../internal/baseToString'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.baseToString);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module, _internalBaseToString) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _baseToString = _interopRequireDefault(_internalBaseToString);

  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  function escapeRegExp(string) {
    string = (0, _baseToString['default'])(string);
    return string && reHasRegExpChars.test(string) ? string.replace(reRegExpChars, '\\$&') : string;
  }

  module.exports = escapeRegExp;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Imgix", ["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Imgix = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  function identity(value) {
    return value;
  }

  module.exports = identity;
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("Imgix", ["exports", "js-md5", "URIjs", "lodash/object/merge"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("js-md5"), require("URIjs"), require("lodash/object/merge"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.md5, global.URI, global.merge);
    global.Imgix = mod.exports;
  }
})(this, function (exports, _jsMd5, _URIjs, _lodashObjectMerge) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var _md5 = _interopRequireDefault(_jsMd5);

  var _URI = _interopRequireDefault(_URIjs);

  var _merge = _interopRequireDefault(_lodashObjectMerge);

  var VERSION = "0.2.0";

  exports.VERSION = VERSION;

  var Path = (function () {
    function Path(path, host) {
      var token = arguments[2] === undefined ? null : arguments[2];
      var secure = arguments[3] === undefined ? true : arguments[3];
      var librarySignature = arguments[4] === undefined ? "js" : arguments[4];
      var libraryVersion = arguments[5] === undefined ? VERSION : arguments[5];

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
        this.queryParams = (0, _merge["default"])(this.queryParams, newParams);
        return this;
      }
    }, {
      key: "_query",
      value: function _query() {
        return _URI["default"].buildQuery((0, _merge["default"])(this._queryWithoutSignature(), this._signature()));
      }
    }, {
      key: "_queryWithoutSignature",
      value: function _queryWithoutSignature() {
        var query = this.queryParams;

        if (this.librarySignature && this.libraryVersion) {
          query.ixlib = "" + this.librarySignature + "-" + this.libraryVersion;
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
        var query = _URI["default"].buildQuery(this.queryParams);

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
      var token = arguments[1] === undefined ? null : arguments[1];
      var secure = arguments[2] === undefined ? true : arguments[2];
      var librarySignature = arguments[3] === undefined ? "js" : arguments[3];
      var libraryVersion = arguments[4] === undefined ? VERSION : arguments[4];

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
