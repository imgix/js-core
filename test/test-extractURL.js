import assert from 'assert';
import { extractUrl } from '../src/helpers.js';

describe('extractURL', () => {
  describe('For non-proxy path URLs', () => {
    const image = 'https://assets.imgix.net/bridge.jpg';
    it('should extract a path from URL', () => {
      const result = extractUrl({ url: image });
      const expectation = {
        domain: 'assets.imgix.net',
        path: 'bridge.jpg',
      };
      assert.strictEqual(result.domain, expectation.domain);
      assert.strictEqual(result.path, expectation.path);
    });
  });
  describe('For proxy path URLs', () => {
    it('should extract a proxy path from full URLs', () => {
      const proxyPath =
        'https://assets.imgix.net/https://sdk-test.imgix.net/amsterdam.jpg';
      const result = extractUrl({ url: proxyPath });
      const expectation = {
        domain: 'assets.imgix.net',
        path: 'https://sdk-test.imgix.net/amsterdam.jpg',
      };
      assert.strictEqual(result.domain, expectation.domain);
      assert.strictEqual(result.path, expectation.path);
    });

    it('should extract a proxy path from partial URLs', () => {
      const proxyPath =
        'assets.imgix.net/https://sdk-test.imgix.net/amsterdam.jpg';
      const result = extractUrl({ url: proxyPath });
      const expectation = {
        domain: 'assets.imgix.net',
        path: 'https://sdk-test.imgix.net/amsterdam.jpg',
      };
      assert.strictEqual(result.domain, expectation.domain);
      assert.strictEqual(result.path, expectation.path);
    });
  });
});
