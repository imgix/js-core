import md5 from 'md5';
import assert from 'assert';
import ImgixClient from '../src/index.js';

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

describe('URL Builder:', function describeSuite() {
  describe('Calling _buildSrcSet()', function describeSuite() {
    let client, params, url, options;

    describe('on a one-step URL', function describeSuite() {
      url = 'https://testing.imgix.net/image.jpg';
      options = {
        includeLibraryParam: false,
        useHTTPS: true,
        secureURLToken: 'MYT0KEN',
      };
      client = ImgixClient;
      const srcset = client._buildSrcSet({
        url,
        params,
        options,
      });

      describe('with no parameters', function describeSuite() {
        params = {};
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
        params = { w: 100 };
        const DPR_QUALITY = [75, 50, 35, 23, 20];
        const srcset = client._buildSrcSet({
          url,
          params,
          options,
        });

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

        it('should override variable quality if quality parameter provided', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          params = { w: 800, q: QUALITY_OVERRIDE };
          const srcset = client._buildSrcSet({
            url,
            params,
            options,
          });

          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });

        it("should disable variable qualities if 'disableVariableQuality'", function testSpec() {
          params = { w: 800 };
          options = { ...options, disableVariableQuality: true };
          const srcset = client._buildSrcSet({
            url,
            params,
            options,
          });
          assertDoesNotIncludeQuality(srcset);
        });

        it('should respect quality param when variable qualities disabled', function testSpec() {
          const QUALITY_OVERRIDE = 100;
          params = { w: 800, q: QUALITY_OVERRIDE };
          options = { ...options, disableVariableQuality: true };
          const srcset = client._buildSrcSet({
            url,
            params,
            options,
          });
          assertIncludesQualityOverride(srcset, QUALITY_OVERRIDE);
        });
      });

      describe('using srcset parameters', function describeSuite() {
        describe('with a minWidth and/or maxWidth provided', function describeSuite() {
          const MIN = 500;
          const MAX = 2000;
          params = {};
          options = { ...options, minWidth: MIN, maxWidth: MAX };
          const srcset = client._buildSrcSet({
            url,
            params,
            options,
          });

          it('should return correct number of `url widthDescriptor` pairs', function testSpec() {
            assert.strictEqual(srcset.split(',').length, 11);
          });

          it('should generate the default srcset pair values', function testSpec() {
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
        });
      });
    });
  });
});
