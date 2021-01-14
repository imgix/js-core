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
    it('throws if a width in width list is negative', function () {
      assert.throws(function () {
        validateWidths([100, 200, 300, -400]);
      });
    });
    it('throws if given an empty list', function () {
      assert.throws(function () {
        validateWidths([]);
      });
    });
    it('throws if given a list of non-numeric input', function () {
      assert.throws(function () {
        validateWidths([100, 200, 300, '400', '500']);
      });
    });
    it('throws if given a list of non-integer input', function () {
      assert.throws(function () {
        validateWidths([399.99, 499.5]);
      });
    });
    it('does not throw given valid width list', function () {
      assert.doesNotThrow(function () {
        validateWidths([100, 200, 300, 400, 500]);
      });
    });
  });
  describe('Testing validateRange', function () {
    it('throws if minWidth is not an integer', function () {
      assert.throws(function () {
        validateRange(500.9123, 1000);
      });
    });
    it('throws if maxWidth is not an integer', function () {
      assert.throws(function () {
        validateRange(100, 500.9123);
      });
    });
    it('throws if minWidth is less than 0', function () {
      assert.throws(function () {
        validateRange(-1, 100);
      });
    });
    it('throws if maxWidth is less than 0', function () {
      assert.throws(function () {
        validateRange(100, -1);
      });
    });
    it('throws if maxWidth is less than minWidth', function () {
      assert.throws(function () {
        validateRange(500, 100);
      });
    });
    it('does not throw given a valid range', function () {
      assert.doesNotThrow(function () {
        validateRange(100, 8192);
      });
    });
  });
  describe('Testing validateWidthTolerance', function () {
    it('throws if widthTolerance is not a number', function () {
      assert.throws(function () {
        validateWidthTolerance('0.08');
      });
    });
    it('throws if widthTolerance is <= 0', function () {
      assert.throws(function () {
        validateWidthTolerance(0);
      });
    });
    it('throws if widthTolerance is less than 0', function () {
      assert.throws(function () {
        validateWidthTolerance(-3);
      });
    });
    it('does not throw on valid widthTolerance', function () {
      assert.doesNotThrow(function () {
        validateWidthTolerance(0.08);
      });
    }); // TODO: should fail.

    it('widthTolerance === 0.001', function () {});
  });
  describe('Testing validateVariableQuality', function () {
    it('throws if variable quality flag is not a boolean', function () {
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
    it('does not throw when variable quality flag is a boolean', function () {
      assert.doesNotThrow(function () {
        validateVariableQuality(true);
      });
      assert.doesNotThrow(function () {
        validateVariableQuality(false);
      });
    });
  });
});
