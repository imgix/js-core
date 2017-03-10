var assert = require('assert');
var ImgixClient = require('../src/imgix-core-js');

describe('Client', function() {
  describe('contstructor', function() {
    it('initializes with correct defaults', function() {
      var client = new ImgixClient({ host: 'my-host.imgix.net' });
      assert.equal("my-host.imgix.net", client.settings.host);
      assert.equal(null, client.settings.secureURLToken);
      assert.equal(true, client.settings.useHTTPS);
    });

    it('initialized with a token', function() {
      var client = new ImgixClient({
        host: 'my-host.imgix.net',
        secureURLToken: 'MYT0KEN'
      });
      assert.equal("my-host.imgix.net", client.settings.host);
      assert.equal("MYT0KEN", client.settings.secureURLToken);
      assert.equal(true, client.settings.useHTTPS);
    });

    it('initialized in insecure mode', function() {
      var client = new ImgixClient({
        host: 'my-host.imgix.net',
        secureURLToken: 'MYT0KEN',
        useHTTPS: false
      });
      assert.equal("my-host.imgix.net", client.settings.host);
      assert.equal("MYT0KEN", client.settings.secureURLToken);
      assert.equal(false, client.settings.useHTTPS);
    });
  });

  describe('#buildURL', function() {
    var signedClient = new ImgixClient({
      host: 'my-social-network.imgix.net',
      secureURLToken: 'FOO123bar',
      includeLibraryParam: false
    });

    var unsignedClient = new ImgixClient({
      host: 'my-source.imgix.net',
      includeLibraryParam: false
    });

    it('tranforms to string correctly', function() {
      assert.equal(signedClient.buildURL('/users/1.png'), "https://my-social-network.imgix.net/users/1.png?s=6797c24146142d5b40bde3141fd3600c");
    });

    it('transforms a fully-qualified URL', function() {
      assert.equal(signedClient.buildURL('http://avatars.com/john-smith.png', { w: 400, h: 300 }), "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?w=400&h=300&s=61ea1cc7add87653bb0695fe25f2b534");
    });

    it('includes the `ixlib` parameter', function() {
      var testClient = new ImgixClient({
        host: 'my-social-network.imgix.net',
        secureURLToken: 'FOO123bar'
      });

      assert.ok(testClient.buildURL('/users/1.png').search(/ixlib=js-\d+\.\d+\.\d+/) > -1);
    });

    it('does not include the `ixlib` parameter', function() {
      var testClient = new ImgixClient({
        host: 'my-social-network.imgix.net',
        secureURLToken: 'FOO123bar',
        includeLibraryParam: false
      });

      assert.ok(testClient.buildURL('/users/1.png').search(/ixlib=js-\d+\.\d+\.\d+/) === -1);
    });

    it('transforms to string correctly', function() {
      var url = unsignedClient.buildURL('/path/to/image.png');
      assert.equal(url, "https://my-source.imgix.net/path/to/image.png");
    });

    it('adds a leading slash', function() {
      var url = unsignedClient.buildURL('path/to/image.png');
      assert.equal(url, "https://my-source.imgix.net/path/to/image.png");
    });

    it('creates an insecure string correctly', function() {
      var testClient = new ImgixClient({
        host: 'my-source.imgix.net',
        includeLibraryParam: false,
        useHTTPS: false
      });

      var url = testClient.buildURL('/path/to/image.png');
      assert.equal(url, "http://my-source.imgix.net/path/to/image.png");
    });

    it('encodes with a space in path correctly', function() {
      var url = signedClient.buildURL('/users/image 1.png');
      assert.equal(url, "https://my-social-network.imgix.net/users/image%201.png?s=193462f12470fe53927d0cf21e07d404");
    });

    it('encodes with a token correctly', function() {
      var url = signedClient.buildURL('/users/1.png');
      assert.equal(url, "https://my-social-network.imgix.net/users/1.png?s=6797c24146142d5b40bde3141fd3600c");
    });

    it('encodes a fully-qualified URL correctly', function() {
      var url = signedClient.buildURL('http://avatars.com/john-smith.png');
      assert.equal(url, "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?s=493a52f008c91416351f8b33d4883135");
    });

    it('encodes a fully-qualified URL with spaces in path correctly', function() {
      var url = signedClient.buildURL('http://awebsite.com/users dir/image 1.png');
      assert.equal(url, "https://my-social-network.imgix.net/http%3A%2F%2Fawebsite.com%2Fusers%20dir%2Fimage%201.png?s=a82cd70cc2b2edae1fd0d83fc86e7884");
    });

    it('encodes a simple path with parameters and a signature', function() {
      var url = signedClient.buildURL('/users/1.png', { w: 400, h: 300 });
      assert.equal(url, "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=c7b86f666a832434dd38577e38cf86d1");
    });

    it('encodes a fully-qualified URL with parameters and a signature', function() {
      var url = signedClient.buildURL('http://avatars.com/john-smith.png', { w: 400, h: 300 });
      assert.equal(url, "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?w=400&h=300&s=61ea1cc7add87653bb0695fe25f2b534");
    });

    it('encodes a fully-qualified HTTPS URL with parameters and a signature', function() {
      var url = signedClient.buildURL('https://avatars.com/john-smith.png', { w: 400, h: 300 });
      assert.equal(url, "https://my-social-network.imgix.net/https%3A%2F%2Favatars.com%2Fjohn-smith.png?w=400&h=300&s=7fb92b2af2526019d64ec26465388533");
    });

    it('encodes a fully-qualified URL with parameters and a signature, even when the path contains a leading slash', function() {
      var url = signedClient.buildURL('/http://avatars.com/john-smith.png', { w: 400, h: 300 });
      assert.equal(url, "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?w=400&h=300&s=61ea1cc7add87653bb0695fe25f2b534");
    });

    it('URL encodes param keys', function() {
      var url = unsignedClient.buildURL('demo.png', { 'hello world': 'interesting' });
      assert.equal(url, 'https://my-source.imgix.net/demo.png?hello%20world=interesting');
    });

    it('URL encodes param values', function() {
      var url = unsignedClient.buildURL('demo.png', { 'hello_world': '/foo"> <script>alert("hacked")</script><' });

      assert.equal(url, 'https://my-source.imgix.net/demo.png?hello_world=%2Ffoo%22%3E%20%3Cscript%3Ealert(%22hacked%22)%3C%2Fscript%3E%3C');
    });

    it('Base64 encodes Base64 param variants', function() {
      var url = unsignedClient.buildURL('~text', { 'txt64': 'I cannøt belîév∑ it wors! 😱' });

      assert.equal(url, 'https://my-source.imgix.net/~text?txt64=SSBjYW5uw7h0IGJlbMOuw6l24oiRIGl0IHdvcu-jv3MhIPCfmLE');
    });
  });
});
