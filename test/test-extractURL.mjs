import assert from 'assert';
import { extractUrl } from '../src/helpers.mjs';

describe('extractURL', () => {
  describe('For non-proxy path URLs', () => {
    const image = 'https://assets.imgix.net/bridge.jpg?w=100';
    const expectation = {
      host: 'assets.imgix.net',
      pathname: '/bridge.jpg',
      search: '?w=100',
    };
    const result = extractUrl({ url: image });
    it('should extract a host from URL', () => {
      assert.strictEqual(result.host, expectation.host);
    });
    it('should extract a pathname from URL', () => {
      assert.strictEqual(result.pathname, expectation.pathname);
    });
    it('should extract existing query from URL', () => {
      assert.strictEqual(result.search, expectation.search);
    });
  });
  describe('For proxy path URLs', () => {
    it('should extract a proxy path from full URLs', () => {
      const proxyPath =
        'https://assets.imgix.net/https://sdk-test.imgix.net/amsterdam.jpg';
      const result = extractUrl({ url: proxyPath });
      const expectation = {
        host: 'assets.imgix.net',
        pathname: '/https://sdk-test.imgix.net/amsterdam.jpg',
      };
      assert.strictEqual(result.host, expectation.host);
      assert.strictEqual(result.pathname, expectation.pathname);
    });

    it('should extract a proxy path from partial URLs', () => {
      const proxyPath =
        'assets.imgix.net/https://sdk-test.imgix.net/amsterdam.jpg';
      const result = extractUrl({ url: proxyPath });
      const expectation = {
        host: 'assets.imgix.net',
        pathname: '/https://sdk-test.imgix.net/amsterdam.jpg',
      };
      assert.strictEqual(result.host, expectation.host);
      assert.strictEqual(result.pathname, expectation.pathname);
    });

    it('should not modify proxy scheme', () => {
      const proxyPath =
        'https://assets.imgix.net/http://sdk-test.imgix.net/amsterdam.jpg';
      const result = extractUrl({
        url: proxyPath,
        options: { useHttps: true },
      });
      const expectation = {
        host: 'assets.imgix.net',
        pathname: '/http://sdk-test.imgix.net/amsterdam.jpg',
      };
      assert.strictEqual(result.host, expectation.host);
      assert.strictEqual(result.pathname, expectation.pathname);
    });

    it('should prepend source scheme when missing', () => {
      const proxyPath =
        'assets.imgix.net/http://sdk-test.imgix.net/amsterdam.jpg';
      const result = extractUrl({
        url: proxyPath,
        options: { useHttps: false },
      });
      const expectation = {
        protocol: 'http:',
        host: 'assets.imgix.net',
        pathname: '/http://sdk-test.imgix.net/amsterdam.jpg',
      };
      assert.strictEqual(result.protocol, expectation.protocol);
      assert.strictEqual(result.host, expectation.host);
      assert.strictEqual(result.pathname, expectation.pathname);
    });

    it('should use https for source when defined in options', () => {
      const proxyPath =
        'assets.imgix.net/http://sdk-test.imgix.net/amsterdam.jpg';
      const result = extractUrl({
        url: proxyPath,
        useHttps: true,
      });
      const expectation = {
        protocol: 'https:',
        host: 'assets.imgix.net',
        pathname: '/http://sdk-test.imgix.net/amsterdam.jpg',
      };
      assert.strictEqual(result.protocol, expectation.protocol);
      assert.strictEqual(result.host, expectation.host);
      assert.strictEqual(result.pathname, expectation.pathname);
    });
  });
});
