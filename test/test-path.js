import assert from "assert";
import Path from "../src/path";

describe('Path', () => {
  describe('constructor', () => {
    it('initializes with the correct values', () => {
      let path = new Path('/path/to/image.png', 'my-source.imgix.net');
      assert.equal(path.path, "/path/to/image.png");
      assert.equal(path.host, "my-source.imgix.net");
      assert.equal(path.token, null);
      assert.equal(path.secure, true);
    });
  });

  describe('toString', () => {
    it('transforms to string correctly', () => {
      let path = new Path('/path/to/image.png', 'my-source.imgix.net', null, true, null);
      assert.equal(path.toString(), "https://my-source.imgix.net/path/to/image.png");
    });

    it('adds a leading slash', () => {
      let path = new Path('path/to/image.png', 'my-source.imgix.net', null, true, null);
      assert.equal(path.toString(), "https://my-source.imgix.net/path/to/image.png");
    });

    it('creates an insecure string correctly', () => {
      let path = new Path('/path/to/image.png', 'my-source.imgix.net', null, false, null);
      assert.equal(path.toString(), "http://my-source.imgix.net/path/to/image.png");
    });

    it('encodes with a token correctly', () => {
      let path = new Path('/users/1.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toString(), "https://my-social-network.imgix.net/users/1.png?s=6797c24146142d5b40bde3141fd3600c");
    });

    it('encodes a fully-qualified URL correctly', () => {
      let path = new Path('http://avatars.com/john-smith.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toString(), "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?s=493a52f008c91416351f8b33d4883135");
    });

    it('encodes a simple path with parameters and a signature', () => {
      let path = new Path('/users/1.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toUrl({ w: 400, h: 300 }).toString(), "https://my-social-network.imgix.net/users/1.png?w=400&h=300&s=c7b86f666a832434dd38577e38cf86d1");
    });

    it('encodes a fully-qualified URL with parameters and a signature', () => {
      let path = new Path('http://avatars.com/john-smith.png', 'my-social-network.imgix.net', 'FOO123bar', true, null);
      assert.equal(path.toUrl({ w: 400, h: 300 }).toString(), "https://my-social-network.imgix.net/http%3A%2F%2Favatars.com%2Fjohn-smith.png?w=400&h=300&s=61ea1cc7add87653bb0695fe25f2b534");
    });
  });
});
