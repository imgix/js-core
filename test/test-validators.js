import assert from 'assert';

import {
  validateRange,
  validateWidths,
  validateWidthTolerance,
  validateVariableQuality
} from '../src/validators.js';

describe('Validators:', function () {
  describe('Testing validateWidths', function () {
    it('throws an error if any width is negative', () => {
      assert.throws(() => {
        validateWidths([100, 200, 300, -400])
      })
    });

    it('throws an error if given an empty list', () => {
      assert.throws(() => {
        validateWidths([])
      })
    });

    it('throws an error if given a list of non-numeric input', () => {
      assert.throws(() => {
        validateWidths([100, 200, 300, '400', '500'])
      })
    });

    it('throws an error if given a list of non-integer input', () => {
      assert.throws(() => {
        validateWidths([399.99, 499.50])
      })
    });

    it('succeeds silently', () => {
      let result = validateWidths([100, 200, 300, 400, 500]);
      assert.strictEqual(result, undefined);
    });
  });

  describe('Testing validateRange', function () {
    it('throws an error if minWidth is not an integer', () => {
      assert.throws(() => {
        validateRange(500.9123, 1000)
      })
    });

    it('throws an error if maxWidth is not an integer', () => {
      assert.throws(() => {
        validateRange(100, 500.9123)
      })
    });

    it('throws an error if minWidth is not <= 0', () => {
      assert.throws(() => {
        validateRange(-1, 100)
      })
    });

    it('throws an error if maxWidth is not <= 0', () => {
      assert.throws(() => {
        validateRange(100, -1)
      })
    });

    it('throws an error if maxWidth is not >= minWidth', () => {
      assert.throws(() => {
        validateRange(500, 100)
      })
    });

    it('succeeds silently', () => {
      let result = validateRange(100, 8192);
      assert.strictEqual(result, undefined);
    });
  });

  describe('Testing validateWidthTolerance', function () {
    it('throws if typeof widthTolerance is not a number', () => {
      assert.throws(() => {
        validateWidthTolerance('0.08')
      })
    });

    it('throws if widthTolerance is <= 0', () => {
      assert.throws(() => {
        validateWidthTolerance(0)
      })
    });

    it('succeeds silently', () => {
      let result = validateWidthTolerance(0.08);
      assert.strictEqual(result, undefined);
    });

    // TODO: should fail.
    it('succeeds silently when widthTolerance === 0.001', () => {
      let result = validateWidthTolerance(0.001);
      assert.strictEqual(result, undefined);
    });
  });

  describe('Testing validateVariableQuality', function () {
    it('throws an error if variable quality flag is not a boolean', () => {
      assert.throws(() => {
        validateVariableQuality('false')
      })

      assert.throws(() => {
        validateVariableQuality('true')
      })

      assert.throws(() => {
        validateVariableQuality(0)
      })

      assert.throws(() => {
        validateVariableQuality(1)
      })
    });
  });
});