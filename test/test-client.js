import assert from "assert";
import Client from "../src/client";

describe('Client', () => {
  describe('contstructor', () => {
    it('initializes with correct defaults', () => {
      let client = new Client('my-host.imgix.net');
      assert.equal("my-host.imgix.net", client.host);
      assert.equal(null, client.token);
      assert.equal(true, client.secure);
    });

    it('initialized with a token', () => {
      let client = new Client('my-host.imgix.net', 'MYT0KEN');
      assert.equal("my-host.imgix.net", client.host);
      assert.equal("MYT0KEN", client.token);
      assert.equal(true, client.secure);
    });

    it('initialized in insecure mode', () => {
      let client = new Client('my-host.imgix.net', 'MYT0KEN', false);
      assert.equal("my-host.imgix.net", client.host);
      assert.equal("MYT0KEN", client.token);
      assert.equal(false, client.secure);
    });
  });

  describe('#path', () => {
    let client = new Client('my-social-network.imgix.net', 'FOO123bar', true, null);

    it('tranforms to string correctly', () => {
      assert.equal(client.path('/users/1.png').toString(), "https://my-social-network.imgix.net/users/1.png?s=6797c24146142d5b40bde3141fd3600c");
    });

    it('transforms a fully-qualified URL', () => {
      assert.equal(client.path('http://avatars.com/john-smith.png').toUrl({ w: 400, h: 300 }).toString(), "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?w=400&h=300&s=61ea1cc7add87653bb0695fe25f2b534");
    });

    it('includes the `ixlib` parameter', () => {
      client = new Client('my-social-network.imgix.net', 'FOO123bar');
      assert.ok(client.path('/users/1.png').toString().search(/ixlib=js-\d+\.\d+\.\d+/) > -1);
    });

    it('does not include the `ixlib` parameter', () => {
      client = new Client('my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.ok(client.path('/users/1.png').toString().search(/ixlib=js-\d+\.\d+\.\d+/) === -1);
    });
  });
});
