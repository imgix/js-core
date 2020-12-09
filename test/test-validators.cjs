'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var assert = _interopDefault(require('assert'));

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

describe('Validators:', function () {
  describe('Testing validateWidths', function () {
    it('throws an error if any width is negative', function () {
      assert.throws(function () {
        validateWidths([100, 200, 300, -400]);
      });
    });
    it('throws an error if given an empty list', function () {
      assert.throws(function () {
        validateWidths([]);
      });
    });
    it('throws an error if given a list of non-numeric input', function () {
      assert.throws(function () {
        validateWidths([100, 200, 300, '400', '500']);
      });
    });
    it('throws an error if given a list of non-integer input', function () {
      assert.throws(function () {
        validateWidths([399.99, 499.50]);
      });
    });
    it('succeeds silently', function () {
      var result = validateWidths([100, 200, 300, 400, 500]);
      assert.strictEqual(result, undefined);
    });
  });
  describe('Testing validateRange', function () {
    it('throws an error if minWidth is not an integer', function () {
      assert.throws(function () {
        validateRange(500.9123, 1000);
      });
    });
    it('throws an error if maxWidth is not an integer', function () {
      assert.throws(function () {
        validateRange(100, 500.9123);
      });
    });
    it('throws an error if minWidth is not <= 0', function () {
      assert.throws(function () {
        validateRange(-1, 100);
      });
    });
    it('throws an error if maxWidth is not <= 0', function () {
      assert.throws(function () {
        validateRange(100, -1);
      });
    });
    it('throws an error if maxWidth is not >= minWidth', function () {
      assert.throws(function () {
        validateRange(500, 100);
      });
    });
    it('succeeds silently', function () {
      var result = validateRange(100, 8192);
      assert.strictEqual(result, undefined);
    });
  });
  describe('Testing validateWidthTolerance', function () {
    it('throws if typeof widthTolerance is not a number', function () {
      assert.throws(function () {
        validateWidthTolerance('0.08');
      });
    });
    it('throws if widthTolerance is <= 0', function () {
      assert.throws(function () {
        validateWidthTolerance(0);
      });
    });
    it('succeeds silently', function () {
      var result = validateWidthTolerance(0.08);
      assert.strictEqual(result, undefined);
    }); // TODO: should fail.

    it('succeeds silently when widthTolerance === 0.001', function () {
      var result = validateWidthTolerance(0.001);
      assert.strictEqual(result, undefined);
    });
  });
  describe('Testing validateWidths', function () {
    it('throws an error if any width is negative', function () {
      assert.throws(function () {
        validateWidths([100, 200, 300, -400]);
      });
    });
    it('throws an error if given an empty list', function () {
      assert.throws(function () {
        validateWidths([]);
      });
    });
    it('throws an error if given a list of non-numeric input', function () {
      assert.throws(function () {
        validateWidths([100, 200, 300, '400', '500']);
      });
    });
    it('throws an error if given a list of non-integer input', function () {
      assert.throws(function () {
        validateWidths([399.99, 499.50]);
      });
    });
    it('succeeds silently', function () {
      var result = validateWidths([100, 200, 300, 400, 500]);
      assert.strictEqual(result, undefined);
    });
  });
  describe('Testing validateVariableQuality', function () {
    it('throws an error if variable quality flag is not a boolean', function () {
      assert.throws(function () {
        validateVariableQuality('false');
      });
      assert.throws(function () {
        validateVariableQuality('true');
      });
      assert.throws(function () {
        validateVariableQuality(0);
      });
      assert.throws(function () {
        validateVariableQuality(1);
      });
    });
  });
});
