import {
  MIN_SRCSET_WIDTH,
  MAX_SRCSET_WIDTH,
  DEFAULT_SRCSET_WIDTH_TOLERANCE,
} from './constants.mjs';

export function validateAndDestructureOptions(options) {
  let widthTolerance;
  if (options.widthTolerance !== undefined) {
    validateWidthTolerance(options.widthTolerance);
    widthTolerance = options.widthTolerance;
  } else {
    widthTolerance = DEFAULT_SRCSET_WIDTH_TOLERANCE;
  }

  const minWidth =
    options.minWidth === undefined ? MIN_SRCSET_WIDTH : options.minWidth;
  const maxWidth =
    options.maxWidth === undefined ? MAX_SRCSET_WIDTH : options.maxWidth;

  // Validate the range unless we're using defaults for both
  if (minWidth != MIN_SRCSET_WIDTH || maxWidth != MAX_SRCSET_WIDTH) {
    validateRange(minWidth, maxWidth);
  }

  return [widthTolerance, minWidth, maxWidth];
}

export function validateRange(min, max) {
  if (
    !(Number.isInteger(min) && Number.isInteger(max)) ||
    min <= 0 ||
    max <= 0 ||
    min > max
  ) {
    throw new Error(
      'The min and max srcset widths can only be passed positive Number values',
    );
  }
}

export function validateWidthTolerance(widthTolerance) {
  if (typeof widthTolerance != 'number' || widthTolerance < 0.01) {
    throw new Error(
      'The srcset widthTolerance must be a number greater than or equal to 0.01',
    );
  }
}

export function validateWidths(customWidths) {
  if (!Array.isArray(customWidths) || !customWidths.length) {
    throw new Error(
      'The widths argument can only be passed a valid non-empty array of integers',
    );
  } else {
    const allPositiveIntegers = customWidths.every(function (width) {
      return Number.isInteger(width) && width > 0;
    });
    if (!allPositiveIntegers) {
      throw new Error(
        'A custom widths argument can only contain positive integer values',
      );
    }
  }
}

export function validateVariableQuality(disableVariableQuality) {
  if (typeof disableVariableQuality != 'boolean') {
    throw new Error(
      'The disableVariableQuality argument can only be passed a Boolean value',
    );
  }
}
