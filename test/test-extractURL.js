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
    const proxyPath =
      'https://assets.imgix.net/https://sdk-test.imgix.net/amsterdam.jpg';
    it('should extract a proxy path if exists', () => {
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
