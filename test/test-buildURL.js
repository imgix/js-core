var assert = require('assert');
var ImgixClient = require('../src/imgix-core-js');
var md5 = require("md5");

describe('URL Builder:', function describeSuite() {
    describe('Calling _sanitizePath()', function describeSuite() {
        var client;

        beforeEach(function setupClient() {
            client = new ImgixClient({
            domain: 'testing.imgix.net'
            });
        });

        describe('with a simple path', function describeSuite() {
            var path = 'images/1.png';

            it('prepends a leading slash', function testSpec() {
            var expectation = '/',
                result = client._sanitizePath(path);

            assert.equal(expectation, result.substring(0, 1));
            });

            it('otherwise returns the same exact path', function testSpec() {
            var expectation = path,
                result = client._sanitizePath(path);

            assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a path that contains a leading slash', function describeSuite() {
            var path = '/images/1.png';

            it('retains the leading slash', function testSpec() {
            var expectation = '/',
                result = client._sanitizePath(path);

            assert.equal(expectation, result.substring(0, 1));
            });

            it('otherwise returns the same exact path', function testSpec() {
            var expectation = path.substring(1),
                result = client._sanitizePath(path);

            assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a path that contains unencoded characters', function describeSuite() {
            var path = 'images/"image 1".png';

            it('prepends a leading slash', function testSpec() {
                var expectation = '/',
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(0, 1));
            });

            it('otherwise returns the same path, except with the characters encoded properly', function testSpec() {
                var expectation = encodeURI(path),
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a path that contains a hash character', function describeSuite() {
            var path = '#blessed.png';

            it('properly encodes the hash character', function testSpec() {
                var expectation = path.replace(/^#/, '%23'),
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a path that contains a question mark', function describeSuite() {
            var path = '?what.png';

            it('properly encodes the question mark', function testSpec() {
                var expectation = path.replace(/^\?/, '%3F'),
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a path that contains a colon', function describeSuite() {
            var path = ':emoji.png';

            it('properly encodes the colon', function testSpec() {
                var expectation = path.replace(/^\:/, '%3A'),
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a full HTTP URL', function describeSuite() {
            var path = 'http://example.com/images/1.png';

            it('prepends a leading slash, unencoded', function testSpec() {
                var expectation = '/',
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(0, 1));
            });

            it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
                var expectation = encodeURIComponent(path),
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a full HTTPS URL', function describeSuite() {
            var path = 'https://example.com/images/1.png';

            it('prepends a leading slash, unencoded', function testSpec() {
                var expectation = '/',
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(0, 1));
            });

            it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
                var expectation = encodeURIComponent(path),
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a full URL that contains a leading slash', function describeSuite() {
            var path = '/http://example.com/images/1.png';

            it('retains the leading slash, unencoded', function testSpec() {
                var expectation = '/',
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(0, 1));
            });

            it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
                var expectation = encodeURIComponent(path.substring(1)),
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(1));
            });
        });

        describe('with a full URL that contains encoded characters', function describeSuite() {
            var path = 'http://example.com/images/1.png?foo=%20';

            it('prepends a leading slash, unencoded', function testSpec() {
                var expectation = '/',
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(0, 1));
            });

            it('otherwise returns a fully-encoded version of the given URL', function testSpec() {
                var expectation = encodeURIComponent(path),
                    result = client._sanitizePath(path);

                assert.equal(expectation, result.substring(1));
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
            domain: 'testing.imgix.net',
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

        it('does not modify its input-argument', function testSpec() {
            var emptyParams = {};
            var emptyResult = client._buildParams(emptyParams);
            assert(Object.keys(emptyParams).length === 0);
        });

        it('includes an `ixlib` param if the `libraryParam` setting is truthy', function testSpec() {
            client.settings.libraryParam = 'test';

            var result = client._buildParams({});

            assert(result.match(/ixlib=test/));
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
            domain: 'testing.imgix.net',
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

    describe('Calling buildURL()', function describeSuite() {
        var client,
            path = 'images/1.png';

        beforeEach(function setupClient() {
            client = new ImgixClient({
            domain: 'test.imgix.net',
            includeLibraryParam: false
            });
        });

        it('is an idempotent operation with empty args', function testSpec() {
            var result1 = client.buildURL('', {});
            var result2 = client.buildURL('', {});
            assert.equal(result1, result2);
        });


        it('is an idempotent operation with args', function testSpec() {
            var path = '/image/stöked.png';
            var params = {w: 100};
            var result1 = client.buildURL(path, params);
            var result2 = client.buildURL(path, params);
            var expected = 'https://test.imgix.net/image/st%C3%B6ked.png?w=100'
            assert.equal(result1, expected);
            assert.equal(result2, expected)
        });


        it('does not modify empty args', function testSpec() {
            var path = '';
            var params = {};
            var result1 = client.buildURL(path, params);
            var result2 = client.buildURL(path, params);
            var expected = 'https://test.imgix.net/';


            assert.equal(path, '');
            assert.equal(expected, result1);
            assert.equal(expected, result2)
            assert(Object.keys(params).length === 0 && params.constructor === Object);
        });

        it('does not modify its args', function testSpec() {
            var path = 'image/1.png';
            var params = {w: 100};
            var result1 = client.buildURL(path, params);
            var result2 = client.buildURL(path, params);
            var expected = 'https://test.imgix.net/image/1.png?w=100';

            assert.equal(path, 'image/1.png');
            assert.equal(result1, result2, expected);
            assert(Object.keys(params).length === 1 && params.constructor === Object);
            assert.equal(params.w, 100);
        });
    });
});
