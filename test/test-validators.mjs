import assert from 'assert';

import {
  validateRange,
  validateWidths,
  validateWidthTolerance,
  validateVariableQuality,
} from '../src/validators.mjs';

describe('Validators:', function () {
  describe('Testing validateWidths', function () {
    it('throws if a width in width list is negative', () => {
      assert.throws(() => {
        validateWidths([100, 200, 300, -400]);
      });
    });

    it('throws if given an empty list', () => {
      assert.throws(() => {
        validateWidths([]);
      });
    });

    it('throws if given a list of non-numeric input', () => {
      assert.throws(() => {
        validateWidths([100, 200, 300, '400', '500']);
      });
    });

    it('throws if given a list of non-integer input', () => {
      assert.throws(() => {
        validateWidths([399.99, 499.5]);
      });
    });

    it('does not throw given valid width list', () => {
      assert.doesNotThrow(() => {
        validateWidths([100, 200, 300, 400, 500]);
      });
    });
  });

  describe('Testing validateRange', function () {
    it('throws if minWidth is not an integer', () => {
      assert.throws(() => {
        validateRange(500.9123, 1000);
      });
    });

    it('throws if maxWidth is not an integer', () => {
      assert.throws(() => {
        validateRange(100, 500.9123);
      });
    });

    it('throws if minWidth is less than 0', () => {
      assert.throws(() => {
        validateRange(-1, 100);
      });
    });

    it('throws if maxWidth is less than 0', () => {
      assert.throws(() => {
        validateRange(100, -1);
      });
    });

    it('throws if maxWidth is less than minWidth', () => {
      assert.throws(() => {
        validateRange(500, 100);
      });
    });

    it('does not throw given a valid range', () => {
      assert.doesNotThrow(() => {
        validateRange(100, 8192);
      });
    });
  });

  describe('Testing validateWidthTolerance', function () {
    it('throws if widthTolerance is not a number', () => {
      assert.throws(() => {
        validateWidthTolerance('0.08');
      });
    });

    it('throws if widthTolerance is < 0.01', () => {
      assert.throws(() => {
        validateWidthTolerance(0.00999999999);
      });
    });

    it('throws if widthTolerance is less than 0', () => {
      assert.throws(() => {
        validateWidthTolerance(-3);
      });
    });

    it('does not throw on valid widthTolerance', () => {
      assert.doesNotThrow(() => {
        validateWidthTolerance(0.08);
      });
    });

    it('does not throw on valid lower bound of 0.01', () => {
      assert.doesNotThrow(() => {
        validateWidthTolerance(0.01);
      });
    });

    it('does not throw when passed a large value', () => {
      assert.doesNotThrow(() => {
        validateWidthTolerance(99999999.99);
      });
    });
  });

  describe('Testing validateVariableQuality', function () {
    it('throws if variable quality flag is not a boolean', () => {
      assert.throws(() => {
        validateVariableQuality('false');
      });

      assert.throws(() => {
        validateVariableQuality('true');
      });

      assert.throws(() => {
        validateVariableQuality(0);
      });

      assert.throws(() => {
        validateVariableQuality(1);
      });
    });

    it('does not throw when variable quality flag is a boolean', () => {
      assert.doesNotThrow(() => {
        validateVariableQuality(true);
      });

      assert.doesNotThrow(() => {
        validateVariableQuality(false);
      });
    });
  });
});
