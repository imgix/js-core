import md5 from 'md5';
import assert from 'assert';
import ImgixClient from '../src/index.mjs';

function assertWidthsIncreaseByTolerance(srcset, tolerance) {
  const srcsetWidths = srcset.split(',').map((u) => {
    const tail = u.split(' ')[1];
    const width = tail.slice(0, -1);
    return Number.parseFloat(width);
  });

  // Make two equal sized arrays one for the numerators, e.g.
  // [x1, x2, ..., xN] and another for the denominators, e.g.
  // [x0, x1,..., x(N-1)].
  const numerators = srcsetWidths.slice(1);
  const denominators = srcsetWidths.slice(0, -1);

  // Zip the numerator/denominator pairs.
  const pairs = numerators.map((n, i) => {
    return [n, denominators[i]];
  });

  // Be as tolerant as we can.
  const tolerancePlus = tolerance + 0.004;

  // Divide the zipped pairs, e.g. (x1 / x0), (x2 / x1)...
  pairs.map((p) => {
    assert(p[0] / p[1] - 1 < tolerancePlus);
  });
}

function assertCorrectSigning(srcset, path, token) {
  const _ = srcset.split(',').map((u) => {
    // Split srcset into list of URLs.
    const url = u.split(' ')[0];
    assert(url.includes('s='));

    // Get the signature without the otherParams.
    const signature = url.slice(url.indexOf('s=') + 2, url.length);

    // Use the otherParams, path, and token to create the expected signature.
    const otherParams = url.slice(url.indexOf('?'), url.indexOf('s=') - 1);
    const expected = md5(token + path + otherParams).toString();

    assert.strictEqual(signature, expected);
  });
}

function assertMinMaxWidthBounds(srcset, minBound, maxBound) {
  const srcsetSplit = srcset.split(',');
  const min = Number.parseFloat(srcsetSplit[0].split(' ')[1].slice(0, -1));
  const max = Number.parseFloat(
    srcsetSplit[srcsetSplit.length - 1].split(' ')[1].slice(0, -1),
  );
  assert(min >= minBound);
  assert(max <= maxBound);
}

function assertCorrectWidthDescriptors(srcset, descriptors) {
  const srcsetSplit = srcset.split(',');
  srcsetSplit.map((u, i) => {
    const width = parseInt(u.split(' ')[1].slice(0, -1), 10);
    assert.strictEqual(width, descriptors[i]);
  });
}

function assertIncludesQualities(srcset, qualities) {
  srcset.split(',').map((u, i) => {
    const url = u.split(' ')[0];
    assert(url.includes(`q=${qualities[i]}`));
  });
}

function assertIncludesQualityOverride(srcset, qOverride) {
  srcset.split(',').map((u) => {
    const url = u.split(' ')[0];
    assert(url.includes(`q=${qOverride}`));
  });
}

function assertIncludesDefaultDprParamAndDescriptor(srcset) {
  const srcsetSplit = srcset.split(',');
  assert.strictEqual(srcsetSplit.length, 5);

  const parts = srcsetSplit.map((u) => u.split(' '));

  // The firstParts contains the URLs without the width descriptors,
  // i.e. ['https://test.imgix.net/image.jpg?dpr=1...',...]
  const firstParts = parts.map((p) => p[0]);
  firstParts.map((u, i) => {
    assert(u.includes(`dpr=${i + 1}`));
  });

  // The lastParts contain the width descriptors without the URLs,
  // i.e. [ '1x', '2x', '3x', '4x', '5x' ]
  const lastParts = parts.map((p) => p[1]);
  lastParts.map((d, i) => {
    // assert 1x === `${0 + 1}x`, etc.
    assert.strictEqual(d, `${i + 1}x`);
  });
}

function assertDoesNotIncludeQuality(srcset) {
  const _ = srcset.split(',').map((u) => {
    const url = u.split(' ')[0];
    assert(!url.includes(`q=`));
  });
}

const RESOLUTIONS = [
  100,
  116,
  135,
  156,
  181,
  210,
  244,
  283,
  328,
  380,
  441,
  512,
  594,
  689,
  799,
  927,
  1075,
  1247,
  1446,
  1678,
  1946,
  2257,
  2619,
  3038,
  3524,
  4087,
  4741,
  5500,
  6380,
  7401,
  8192,
];

describe('SrcSet Builder:', function describeSuite() {
  describe('Calling buildSrcSet()', function describeSuite() {
    describe('using image parameters', function describeSuite() {
      describe('with no parameters', function describeSuite() {
        const client = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        });
        const srcset = client.buildSrcSet('image.jpg');

        it('memoizes default srcset width pairs', function testSpec() {
          const key = [0.08, 100, 8192].join('/');
          const cachedValue = client.targetWidthsCache[key];

          assert.notStrictEqual(cachedValue, undefined);
          assert.strictEqual(cachedValue.length, 31);
        });

        it('should generate the expected default srcset pair values', function testSpec() {
          assertCorrectWidthDescriptors(srcset, RESOLUTIONS);
        });

        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.strictEqual(srcset.split(',').length, 31);
        });

        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          assertMinMaxWidthBounds(srcset, 100, 8192);
        });

        // a 17% testing threshold is used to account for rounding
        it('should not increase more than 17% every iteration', function testSpec() {
          assertWidthsIncreaseByTolerance(srcset, 0.17);
        });

        it('should correctly sign each URL', function testSpec() {
          assertCorrectSigning(srcset, '/image.jpg', 'MYT0KEN');
        });
      });

      describe('with a width parameter provided', function describeSuite() {
        const DPR_QUALITY = [75, 50, 35, 23, 20];
        const srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        }).buildSrcSet('image.jpg', { w: 100 });

        it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should correctly sign each URL', function testSpec() {
          assertCorrectSigning(srcset, '/image.jpg', 'MYT0KEN');
        });

        it('should include a dpr param per specified src', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should include variable qualities by default', function testSpec() {
          assertIncludesQualities(srcset, DPR_QUALITY);
        });

        it('should override the variable quality if a quality parameter is provided', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet('image.jpg', { w: 800, q: QUALITY_OVERRIDE });

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });

        it("should correctly disable generated variable qualities via the 'disableVariableQuality' argument", function testSpec() {
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet(
            'image.jpg',
            { w: 800 },
            { disableVariableQuality: true },
          );

          assertDoesNotIncludeQuality(srcset);
        });

        it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet(
            'image.jpg',
            { w: 800, q: QUALITY_OVERRIDE },
            { disableVariableQuality: true },
          );

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });
      });

      describe('with a height parameter provided', function describeSuite() {
        const srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        }).buildSrcSet('image.jpg', { h: 100 });

        it('should respect the height parameter', function testSpec() {
          srcset.split(',').map(function (src) {
            assert(src.includes('h='));
          });
        });

        it('creates a DPR srcset with default DPR values', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should correctly sign each URL', function testSpec() {
          assertCorrectSigning(srcset, '/image.jpg', 'MYT0KEN');
        });
      });

      describe('with a width and height parameter provided', function describeSuite() {
        const DPR_QUALITY = [75, 50, 35, 23, 20];
        const srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        }).buildSrcSet('image.jpg', { w: 100, h: 100 });

        it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should correctly sign each URL', function testSpec() {
          assertCorrectSigning(srcset, '/image.jpg', 'MYT0KEN');
        });

        it('should include a dpr param per specified src', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should include variable qualities by default', function testSpec() {
          assertIncludesQualities(srcset, DPR_QUALITY);
        });

        it('should override the variable quality if a quality parameter is provided', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet('image.jpg', { w: 800, q: QUALITY_OVERRIDE });

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });

        it("should correctly disable generated variable qualities via the 'disableVariableQuality' argument", function testSpec() {
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet(
            'image.jpg',
            { w: 800 },
            { disableVariableQuality: true },
          );

          assertDoesNotIncludeQuality(srcset);
        });

        it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet(
            'image.jpg',
            { w: 800, q: QUALITY_OVERRIDE },
            { disableVariableQuality: true },
          );

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });

        it('should not modify input params and should be idempotent', function testSpec() {
          const client = new ImgixClient({ domain: 'test.imgix.net' });
          const params = {};
          const srcsetOptions = { widths: [100] };
          const srcset1 = client.buildSrcSet('', params, srcsetOptions);
          const srcset2 = client.buildSrcSet('', params, srcsetOptions);

          // Show idempotent, ie. calling buildSrcSet produces the same result given
          // the same input-parameters.
          assert.strictEqual(srcset1, srcset2);

          // Assert that the object remains unchanged.
          assert(
            Object.keys(params).length === 0 && params.constructor === Object,
          );
        });
      });

      describe('with an aspect ratio parameter provided', function describeSuite() {
        const srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        }).buildSrcSet('image.jpg', { ar: '3:2' });

        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.strictEqual(srcset.split(',').length, 31);
        });

        it('should generate the expected default srcset pair values', function testSpec() {
          assertCorrectWidthDescriptors(srcset, RESOLUTIONS);
        });

        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          assertMinMaxWidthBounds(srcset, 100, 8192);
        });

        // a 17% testing threshold is used to account for rounding
        it('should not increase more than 17% every iteration', function testSpec() {
          assertWidthsIncreaseByTolerance(srcset, 0.17);
        });

        it('should correctly sign each URL', function testSpec() {
          assertCorrectSigning(srcset, '/image.jpg', 'MYT0KEN');
        });
      });

      describe('with a width and aspect ratio parameter provided', function describeSuite() {
        const DPR_QUALITY = [75, 50, 35, 23, 20];
        const srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        }).buildSrcSet('image.jpg', { w: 100, ar: '3:2' });

        it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should correctly sign each URL', function testSpec() {
          assertCorrectSigning(srcset, '/image.jpg', 'MYT0KEN');
        });

        it('should include a dpr param per specified src', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should include variable qualities by default', function testSpec() {
          assertIncludesQualities(srcset, DPR_QUALITY);
        });

        it('should override the variable quality if a quality parameter is provided', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet('image.jpg', { w: 800, q: QUALITY_OVERRIDE });

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });

        it("should correctly disable generated variable qualities via the 'disableVariableQuality' argument", function testSpec() {
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet(
            'image.jpg',
            { w: 800 },
            { disableVariableQuality: true },
          );

          assertDoesNotIncludeQuality(srcset);
        });

        it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet(
            'image.jpg',
            { w: 800, q: QUALITY_OVERRIDE },
            { disableVariableQuality: true },
          );

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });
      });

      describe('with a height and aspect ratio parameter provided', function describeSuite() {
        const DPR_QUALITY = [75, 50, 35, 23, 20];
        const srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        }).buildSrcSet('image.jpg', { h: 100, ar: '3:2' });

        it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should correctly sign each URL', function testSpec() {
          assertCorrectSigning(srcset, '/image.jpg', 'MYT0KEN');
        });

        it('should include a dpr param per specified src', function testSpec() {
          assertIncludesDefaultDprParamAndDescriptor(srcset);
        });

        it('should include variable qualities by default', function testSpec() {
          assertIncludesQualities(srcset, DPR_QUALITY);
        });

        it('should override the variable quality if a quality parameter is provided', function testSpec() {
          const QUALITY_OVERRIDE = 100;

          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet('image.jpg', { w: 800, q: QUALITY_OVERRIDE });

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });

        it("should correctly disable generated variable qualities via the 'disableVariableQuality' argument", function testSpec() {
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet(
            'image.jpg',
            { w: 800 },
            { disableVariableQuality: true },
          );

          assertDoesNotIncludeQuality(srcset);
        });

        it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet(
            'image.jpg',
            { w: 800, q: QUALITY_OVERRIDE },
            { disableVariableQuality: true },
          );

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });
      });
    });

    describe('using srcset parameters', function describeSuite() {
      describe('with a minWidth and/or maxWidth provided', function describeSuite() {
        const MIN = 500;
        const MAX = 2000;
        const client = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        });

        const srcset = client.buildSrcSet(
          'image.jpg',
          {},
          { minWidth: MIN, maxWidth: MAX },
        );

        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.strictEqual(srcset.split(',').length, 11);
        });

        it('should generate the expected default srcset pair values', function testSpec() {
          const resolutions = [
            500,
            580,
            673,
            780,
            905,
            1050,
            1218,
            1413,
            1639,
            1901,
            2000,
          ];
          assertCorrectWidthDescriptors(srcset, resolutions);
        });

        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          assertMinMaxWidthBounds(srcset, 100, 8192);
        });

        it('errors with non-Number minWidth', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { minWidth: 'abc' });
          }, Error);
        });

        it('errors with negative maxWidth', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { maxWidth: -100 });
          }, Error);
        });

        it('errors with zero maxWidth', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { maxWidth: 0 });
          }, Error);
        });

        it('errors with two invalid widths', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { minWidth: 0, maxWidth: 0 });
          }, Error);
        });

        it('errors when the maxWidth is less than the minWidth', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { minWidth: 1000, maxWidth: 500 });
          }, Error);
        });

        it('generates a single srcset entry if minWidth and maxWidth are equal', function testSpec() {
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
            includeLibraryParam: false,
          }).buildSrcSet('image.jpg', {}, { minWidth: 1000, maxWidth: 1000 });
          assert(srcset, 'https://testing.imgix.net/image.jpg?w=1000 1000w');
        });

        it('does not include a minWidth or maxWidth URL parameter', function testSpec() {
          assert(!srcset.includes('minWidth='));
          assert(!srcset.includes('maxWidth='));
        });

        it('only includes one entry if maxWidth is equal to 100', function testSpec() {
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
            includeLibraryParam: false,
          }).buildSrcSet('image.jpg', {}, { maxWidth: 100 });

          assert.strictEqual(
            srcset,
            'https://testing.imgix.net/image.jpg?w=100 100w',
          );
        });

        it('only includes one entry if minWidth is equal to 8192', function testSpec() {
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
            includeLibraryParam: false,
          }).buildSrcSet('image.jpg', {}, { minWidth: 8192 });

          assert.strictEqual(
            srcset,
            'https://testing.imgix.net/image.jpg?w=8192 8192w',
          );
        });

        it('memoizes generated srcset width pairs', function testSpec() {
          const DEFAULT_WIDTH_TOLERANCE = 0.08;
          const key = [DEFAULT_WIDTH_TOLERANCE, MIN, MAX].join('/');
          const cachedValue = client.targetWidthsCache[key];

          assert.notStrictEqual(cachedValue, undefined);
          assert.strictEqual(cachedValue.length, 11);
        });
      });

      describe('with a widthTolerance parameter provided', function describeSuite() {
        const WIDTH_TOLERANCE = 0.2;
        const client = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
        });

        const srcset = client.buildSrcSet(
          'image.jpg',
          {},
          { widthTolerance: WIDTH_TOLERANCE },
        );

        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.strictEqual(srcset.split(',').length, 15);
        });

        it('should generate the expected default srcset pair values', function testSpec() {
          const resolutions = [
            100,
            140,
            196,
            274,
            384,
            538,
            753,
            1054,
            1476,
            2066,
            2893,
            4050,
            5669,
            7937,
            8192,
          ];
          assertCorrectWidthDescriptors(srcset, resolutions);
        });

        it('should not exceed the bounds of [100, 8192]', function testSpec() {
          assertMinMaxWidthBounds(srcset, 100, 8192);
        });

        it('should not increase more than (2 * widthTolerance) + 1 every iteration', function testSpec() {
          assertWidthsIncreaseByTolerance(srcset, WIDTH_TOLERANCE * 2);
        });

        it('errors with non-Number widthTolerance', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { widthTolerance: 'abc' });
          }, Error);
        });

        it('errors with negative widthTolerance', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { widthTolerance: -0.1 });
          }, Error);
        });

        it('errors with zero widthTolerance', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { widthTolerance: 0 });
          }, Error);
        });

        it('produces srcset with min and max widths when widthTolerance is large', function testSpec() {
          const srcset = new ImgixClient({
            domain: 'testing.imgix.net',
          }).buildSrcSet('image.jpg', {}, { widthTolerance: 999999.999 });

          const srcsetSplit = srcset.split(',');
          const actualLength = srcsetSplit.length;

          const srcsetMin = Number.parseFloat(
            srcsetSplit[0].split(' ')[1].slice(0, -1),
          );

          const srcsetMax = Number.parseFloat(
            srcsetSplit[srcsetSplit.length - 1].split(' ')[1].slice(0, -1),
          );

          assert.strictEqual(actualLength, 2);
          assert.strictEqual(srcsetMin, 100);
          assert.strictEqual(srcsetMax, 8192);
        });

        it('memoizes generated srcset width pairs', function testSpec() {
          const DEFAULT_MIN_WIDTH = 100;
          const DEFAULT_MAX_WIDTH = 8192;
          const key = [
            WIDTH_TOLERANCE,
            DEFAULT_MIN_WIDTH,
            DEFAULT_MAX_WIDTH,
          ].join('/');
          const cachedValue = client.targetWidthsCache[key];

          assert.notStrictEqual(cachedValue, undefined);
          assert.strictEqual(cachedValue.length, 15);
        });
      });

      describe('with a custom list of widths provided', function describeSuite() {
        const CUSTOM_WIDTHS = [100, 500, 1000, 1800];
        const srcset = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
          secureURLToken: 'MYT0KEN',
        }).buildSrcSet('image.jpg', {}, { widths: CUSTOM_WIDTHS });

        it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
          assert.strictEqual(srcset.split(',').length, 4);
        });

        it('should generate the expected default srcset pair values', function testSpec() {
          assertCorrectWidthDescriptors(srcset, CUSTOM_WIDTHS);
        });

        it('errors with non-array argument', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { widths: 'abc' });
          }, Error);
        });

        it('errors with non-positive value passed in to the argument', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { widths: [100, -200] });
          }, Error);
        });

        it('errors with non-integer value passed in to the argument', function testSpec() {
          assert.throws(function () {
            new ImgixClient({
              domain: 'testing.imgix.net',
            }).buildSrcSet('image.jpg', {}, { widths: [100, false] });
          }, Error);
        });
      });

      describe('ImgixClient.targetWidths', function describeSuite() {
        it('produces the default target width resolutions given default args', function testSpec() {
          const actual = ImgixClient.targetWidths();
          assert.deepStrictEqual(actual, RESOLUTIONS);
        });

        it('errors on invalid minWidth', function testSpec() {
          assert.throws(() => {
            ImgixClient.targetWidths(0);
          }, Error);
        });

        it('errors on invalid range', function testSpec() {
          assert.throws(() => {
            ImgixClient.targetWidths(100, 0);
          }, Error);
        });

        it('errors on invalid widthTolerance', function testSpec() {
          assert.throws(() => {
            ImgixClient.targetWidths(100, 8192, 0.001);
          }, Error);
        });
      });

      describe('with widthTolerance, minWidth, and maxWidth values which have caused duplicate values in the past', function describeSuite() {
        const client = new ImgixClient({
          domain: 'testing.imgix.net',
          includeLibraryParam: false,
        });

        const srcset = client.buildSrcSet(
          'image.jpg',
          {},
          { widthTolerance: 0.0999, minWidth: 1000, maxWidth: 1200 },
        );

        it('should not repeat the largest width when a running value just below maxWidth is reached', function testSpec() {
          const srcsetSplit = srcset.split(',');
          const maxWidth = srcsetSplit[srcsetSplit.length - 1]
            .split(' ')[1]
            .slice(0, -1);

          assert.strictEqual(parseInt(maxWidth, 10), 1200);

          assert.notStrictEqual(
            srcsetSplit[srcsetSplit.length - 2],
            srcsetSplit[srcsetSplit.length - 1],
          );
        });
      });
    });
  });
});
