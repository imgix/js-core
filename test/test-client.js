var assert = require('assert');
var ImgixClient = require('../src/imgix-core-js');

describe('Imgix client:', function describeSuite() {
  describe('The constructor', function describeSuite() {
    it('initializes with correct defaults', function testSpec() {
      var client = new ImgixClient({ domains: 'my-host.imgix.net' });
      assert.equal(client.settings.domains.length, 1);
      assert.equal("my-host.imgix.net", client.settings.domains[0]);
      assert.equal(null, client.settings.secureURLToken);
      assert.equal(true, client.settings.useHTTPS);
      assert.equal(ImgixClient.SHARD_STRATEGY_CRC, client.settings.shard_strategy);
    });

    it('initializes with a token', function testSpec() {
      var client = new ImgixClient({
        domains: 'my-host.imgix.net',
        secureURLToken: 'MYT0KEN'
      });
      assert.equal(client.settings.domains.length, 1);
      assert.equal("my-host.imgix.net", client.settings.domains[0]);
      assert.equal("MYT0KEN", client.settings.secureURLToken);
      assert.equal(true, client.settings.useHTTPS);
    });

    it('initializes in insecure mode', function testSpec() {
      var client = new ImgixClient({
        domains: 'my-host.imgix.net',
        secureURLToken: 'MYT0KEN',
        useHTTPS: false
      });
      assert.equal(client.settings.domains.length, 1);
      assert.equal("my-host.imgix.net", client.settings.domains[0]);
      assert.equal("MYT0KEN", client.settings.secureURLToken);
      assert.equal(false, client.settings.useHTTPS);
    });

    it('initializes with domains list', function testSpec() {
      var client = new ImgixClient({
        domains: ['my-host1.imgix.net', 'my-host2.imgix.net'],
        secureURLToken: 'MYT0KEN',
        useHTTPS: false
      });
      assert.equal(client.settings.domains.length, 2);
      assert.equal("my-host1.imgix.net", client.settings.domains[0]);
      assert.equal("my-host2.imgix.net", client.settings.domains[1]);
      assert.equal("MYT0KEN", client.settings.secureURLToken);
      assert.equal(false, client.settings.useHTTPS);
    });

    it('errors with invalid shard strategy', function testSpec() {
      assert.throws(function() {
        new ImgixClient({
          domains: ['my-host1.imgix.net', 'my-host2.imgix.net'],
          secureURLToken: 'MYT0KEN',
          shard_strategy: 'invalid',
          useHTTPS: false
        })
      }, Error);
    });
  });

  describe('Calling _sanitizePath()', function describeSuite() {
    var client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domains: 'testing.imgix.net'
      });
    });

    describe('with a simple path', function describeSuite() {
      var path = 'images/1.png';

      it('prepends a leading slash', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns the same exact path', function testSpec() {
        var expectation = path,
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a path that contains a leading slash', function describeSuite() {
      var path = '/images/1.png';

      it('retains the leading slash', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns the same exact path', function testSpec() {
        var expectation = path.substr(1),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a path that contains unencoded characters', function describeSuite() {
      var path = 'images/"image 1".png';

      it('prepends a leading slash', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns the same path, except with the characters encoded properly', function testSpec() {
        var expectation = encodeURI(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a full HTTP URL', function describeSuite() {
      var path = 'http://example.com/images/1.png';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a full HTTPS URL', function describeSuite() {
      var path = 'https://example.com/images/1.png';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a full URL that contains a leading slash', function describeSuite() {
      var path = '/http://example.com/images/1.png';

      it('retains the leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path.substr(1)),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });
    });

    describe('with a full URL that contains encoded characters', function describeSuite() {
      var path = 'http://example.com/images/1.png?foo=%20';

      it('prepends a leading slash, unencoded', function testSpec() {
        var expectation = '/',
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(0, 1));
      });

      it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
        var expectation = encodeURIComponent(path),
            result = client._sanitizePath(path);

        assert.equal(expectation, result.substr(1));
      });

      it('double-encodes the original encoded characters', function testSpec() {
        var expectation1 = -1,
            expectation2 = encodeURIComponent(path).length - 4;
            result = client._sanitizePath(path);

        // Result should not contain the string "%20"
        assert.equal(expectation1, result.indexOf('%20'));

        // Result should instead contain the string "%2520"
        assert.equal(expectation2, result.indexOf('%2520'));
      });
    });
  });

  describe('Calling _buildParams()', function describeSuite() {
    var client;

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domains: 'testing.imgix.net',
        includeLibraryParam: false
      });
    });

    it('returns an empty string if no parameters are given', function testSpec() {
      var params = {},
          expectation = '',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('returns a properly-formatted query string if a single parameter is given', function testSpec() {
      var params = {
              w: 400
            },
          expectation = '?w=400',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('returns a properly-formatted query string if multiple parameters are given', function testSpec() {
      var params = {
              w: 400,
              h: 300
            },
          expectation = '?w=400&h=300',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('includes an `ixlib` param if the `libraryParam` setting is truthy', function testSpec() {
      var params = {
              w: 400
            },
          expectation = '?w=400&ixlib=test',
          result;

      client.settings.libraryParam = 'test';

      result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('url-encodes parameter keys properly', function testSpec() {
      var params = {
              'w$': 400
            },
          expectation = '?w%24=400',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('url-encodes parameter values properly', function testSpec() {
      var params = {
              w: '$400'
            },
          expectation = '?w=%24400',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });

    it('base64-encodes parameter values whose keys end in `64`', function testSpec() {
      var params = {
              txt64: 'lorem ipsum'
            },
          expectation = '?txt64=bG9yZW0gaXBzdW0',
          result = client._buildParams(params);

      assert.equal(expectation, result);
    });
  });

  describe('Calling _signParams()', function describeSuite() {
    var client,
        path = 'images/1.png';

    beforeEach(function setupClient() {
      client = new ImgixClient({
        domains: 'testing.imgix.net',
        secureURLToken: 'MYT0KEN',
        includeLibraryParam: false
      });
    });

    it('returns a query string containing only a proper signature parameter, if no other query parameters are provided', function testSpec() {
      var expectation = '?s=6d82410f89cc6d80a6aa9888dcf85825',
          result = client._signParams(path, '');

      assert.equal(expectation, result);
    });

    it('returns a query string with a proper signature parameter appended, if other query parameters are provided', function testSpec() {
      var expectation = '?w=400&s=990916ef8cc640c58d909833e47f6c31',
          result = client._signParams(path, '?w=400');

      assert.equal(expectation, result);
    });
  });

  describe('Sharding', function describeSuite() {
    describe('CRC', function describeSuite() {
      it('path resolves to same domain', function testSpec() {
        var domains = ['my-host1.imgix.net', 'my-host2.imgix.net'];
        var client = new ImgixClient({
          domains: domains,
          shard_strategy: ImgixClient.SHARD_STRATEGY_CRC
        });
        assert.ok(client.buildURL('/users/1.png').match(domains[0]));
        assert.ok(client.buildURL('/users/2.png').match(domains[0]));
        assert.ok(client.buildURL('/users/a.png').match(domains[1]));
        assert.ok(client.buildURL('/users/1.png').match(domains[0]));
        assert.ok(client.buildURL('/users/a.png').match(domains[1]));
        assert.ok(client.buildURL('/users/2.png').match(domains[0]));
        assert.ok(client.buildURL('/users/b.png').match(domains[1]));
        assert.ok(client.buildURL('/users/a.png').match(domains[1]));
      });

      it('single domain sharding', function testSpec() {
        var domain = 'my-host1.imgix.net';
        var client = new ImgixClient({
          domains: domain,
          shard_strategy: ImgixClient.SHARD_STRATEGY_CRC
        });
        assert.ok(client.buildURL('/users/1.png').match(domain));
        assert.ok(client.buildURL('/users/2.png').match(domain));
        assert.ok(client.buildURL('/users/a.png').match(domain));
        assert.ok(client.buildURL('/users/1.png').match(domain));
        assert.ok(client.buildURL('/users/a.png').match(domain));
        assert.ok(client.buildURL('/users/2.png').match(domain));
        assert.ok(client.buildURL('/users/b.png').match(domain));
        assert.ok(client.buildURL('/users/a.png').match(domain));
      });
    });

    describe('Cyclic', function describeSuite() {
      it('domains cycle', function testSpec() {
        var domains = ['my-host1.imgix.net', 'my-host2.imgix.net', 'my-host3.imgix.net'];
        var client = new ImgixClient({
          domains: domains,
          shard_strategy: ImgixClient.SHARD_STRATEGY_CYCLE
        });
        assert.ok(client.buildURL('/users/1.png').match(domains[0]));
        assert.ok(client.buildURL('/users/2.png').match(domains[1]));
        assert.ok(client.buildURL('/users/a.png').match(domains[2]));
        assert.ok(client.buildURL('/users/1.png').match(domains[0]));
        assert.ok(client.buildURL('/users/a.png').match(domains[1]));
        assert.ok(client.buildURL('/users/2.png').match(domains[2]));
        assert.ok(client.buildURL('/users/b.png').match(domains[0]));
        assert.ok(client.buildURL('/users/a.png').match(domains[1]));
      });

      it('single domain sharding', function testSpec() {
        var domain = 'my-host1.imgix.net';
        var client = new ImgixClient({
          domains: domain,
          shard_strategy: ImgixClient.SHARD_STRATEGY_CYCLE
        });
        assert.ok(client.buildURL('/users/1.png').match(domain));
        assert.ok(client.buildURL('/users/2.png').match(domain));
        assert.ok(client.buildURL('/users/a.png').match(domain));
        assert.ok(client.buildURL('/users/1.png').match(domain));
        assert.ok(client.buildURL('/users/a.png').match(domain));
        assert.ok(client.buildURL('/users/2.png').match(domain));
        assert.ok(client.buildURL('/users/b.png').match(domain));
        assert.ok(client.buildURL('/users/a.png').match(domain));
      });

    });
  });

});
