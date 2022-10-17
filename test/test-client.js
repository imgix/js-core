import assert from 'assert';
import { VERSION } from '../src/constants.js';
import ImgixClient from '../src/index.js';

describe('Imgix client:', function describeSuite() {
  describe('The constructor', function describeSuite() {
    it('uses HTTPS by default', function testSpec() {
      const client = new ImgixClient({ domain: 'test.imgix.net' });
      assert.strictEqual(client.settings.useHTTPS, true);
    });

    it('has no assigned token by default', function testSpec() {
      const client = new ImgixClient({ domain: 'test.imgix.net' });
      assert.strictEqual(client.settings.secureURLToken, null);
    });

    it('initializes with a token', function testSpec() {
      const expectedToken = 'MYT0KEN';

      const client = new ImgixClient({
        domain: 'test.imgix.net',
        secureURLToken: expectedToken,
      });

      assert.strictEqual(client.settings.secureURLToken, expectedToken);
    });

    it('initializes with token when using HTTP', function testSpec() {
      const client = new ImgixClient({
        domain: 'my-host.imgix.net',
        secureURLToken: 'MYT0KEN',
        useHTTPS: false,
      });
      assert.strictEqual(client.settings.secureURLToken, 'MYT0KEN');
      assert.strictEqual(client.settings.useHTTPS, false);
    });

    it('appends ixlib param by default', function testSpec() {
      const domain = 'test.imgix.net';
      const expectedURL = `https://${domain}/image.jpg?ixlib=js-${VERSION}`;
      const client = new ImgixClient({ domain: domain });

      assert.strictEqual(client.buildURL('image.jpg'), expectedURL);
    });

    it('errors with invalid domain - appended slash', function testSpec() {
      assert.throws(function () {
        new ImgixClient({
          domain: 'my-host1.imgix.net/',
        });
      }, Error);
    });

    it('errors with invalid domain - prepended scheme ', function testSpec() {
      assert.throws(function () {
        new ImgixClient({
          domain: 'https://my-host1.imgix.net',
        });
      }, Error);
    });

    it('errors with invalid domain - appended dash ', function testSpec() {
      assert.throws(function () {
        new ImgixClient({
          domain: 'my-host1.imgix.net-',
        });
      }, Error);
    });

    it('errors when domain is any non-string value', function testSpec() {
      assert.throws(function () {
        new ImgixClient({
          domain: ['my-host.imgix.net', 'another-domain.imgix.net'],
        });
      }, Error);
    });

    it('errors when no domain is passed', function testSpec() {
      assert.throws(function () {
        new ImgixClient({});
      }, Error);
    });
  });

  describe('The `this.settings` setters', function describeSuite() {
    it('update the value of the settings property', function testSpec() {
      const client = new ImgixClient({
        domain: 'test.imgix.net',
        secureURLToken: 'foobar',
      });

      const newSettings = {
        domain: 'sdk-test.imgix.net',
        includeLibraryParam: false,
        urlPrefix: 'http://',
        secureURLToken: undefined,
      };

      client.domain = newSettings.domain;
      client.secureURLToken = newSettings.secureURLToken;
      client.includeLibraryParam = newSettings.includeLibraryParam;
      client.useHTTPS = false;
      const expectedURL = `http://${newSettings.domain}/image.jpg`;
      assert.strictEqual(client.buildURL('image.jpg'), expectedURL);
    });

    it('remove ixlib param when `includeLibraryParam` is falsy', function testSpec() {
      const domain = 'test.imgix.net';
      const expectedURL = `https://${domain}/image.jpg`;
      const client = new ImgixClient({ domain: domain });
      client.includeLibraryParam = false;
      assert.strictEqual(client.buildURL('image.jpg'), expectedURL);
    });
  });
});
