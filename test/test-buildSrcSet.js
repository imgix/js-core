var assert = require('assert');
var ImgixClient = require('../src/imgix-core-js');
var md5 = require("md5");

describe('SrcSet Builder:', function describeSuite() {
    describe('Calling buildSrcSet()', function describeSuite() {
        describe('using image parameters', function describeSuite(){
            describe('with no parameters', function describeSuite() {
                var client = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false,
                    secureURLToken: 'MYT0KEN'
                });
                var srcset = client.buildSrcSet('image.jpg');

                it('memoizes default srcset width pairs', function testSpec() {
                    var key = [.08, 100, 8192].join('/');
                    var cachedValue = client.targetWidthsCache[key];

                    assert(cachedValue !== undefined && cachedValue.length == 31);
                });

                it('should generate the expected default srcset pair values', function testSpec(){
                    resolutions = [100, 116, 134, 156, 182, 210, 244, 282,
                                    328, 380, 442, 512, 594, 688, 798, 926,
                                    1074, 1246, 1446, 1678, 1946, 2258, 2618,
                                    3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
                    srclist = srcset.split(",");
                    src = srclist.map(function (srcline){
                        return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
                    });

                    for (var i = 0; i < srclist.length; i++) {
                        assert.equal(src[i], resolutions[i]);
                    }
                });

                it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
                    assert.equal(srcset.split(',').length, 31);
                });

                it('should not exceed the bounds of [100, 8192]', function testSpec() {
                    var srcsetSplit = srcset.split(",");
                    var min = Number.parseFloat(
                        srcsetSplit[0]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    var max = Number.parseFloat(
                        srcsetSplit[srcsetSplit.length-1]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    assert(min >= 100);
                    assert(max <= 8192);
                });

                // a 17% testing threshold is used to account for rounding
                it('should not increase more than 17% every iteration', function testSpec() {
                    var INCREMENT_ALLOWED = 0.17;

                    var srcsetWidths = function() {
                        return srcset.split(",")
                        .map(function (srcsetSplit) {
                        return srcsetSplit.split(" ")[1];
                        })
                        .map(function (width) {
                        return width.slice(0, -1);
                        })
                        .map(Number.parseFloat);
                    }();

                    let prev = srcsetWidths[0];

                    for (let index = 1; index < srcsetWidths.length; index++) {
                        var element = srcsetWidths[index];
                        assert((element / prev) < (1 + INCREMENT_ALLOWED));
                        prev = element;
                    }
                });

                it('should correctly sign each URL', function testSpec() {
                    var path = '/image.jpg';
                    var param, signatureBase, expected_signature;

                    srcset.split(",")
                    .map(function (srcsetSplit) {
                        // split the url portion of each srcset entry
                        return srcsetSplit.split(" ")[0];
                    }).map(function (src) {
                        // asserts that the expected 's=' parameter is being generated per entry
                        assert(src.includes("s="));

                        // param will have all params except for '&s=...'
                        param = src.slice(src.indexOf('?'), src.length);
                        param = param.slice(0, param.indexOf('s=')-1);
                        generated_signature = src.slice(src.indexOf('s=')+2, src.length);
                        signatureBase = 'MYT0KEN' + path + param;
                        expected_signature = md5(signatureBase);

                        assert.equal(expected_signature, generated_signature);
                    });
                });
            });

            describe('with a width parameter provided', function describeSuite() {
                var DPR_QUALITY = [75, 50, 35, 23, 20];
                var srcset = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false,
                    secureURLToken: 'MYT0KEN'
                }).buildSrcSet('image.jpg', {w:100});

                it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
                    assert(srcset.split(",").length == 5);

                    var devicePixelRatios = srcset.split(",")
                    .map(function (srcsetSplit){
                        return srcsetSplit.split(" ")[1];
                    });

                    assert(devicePixelRatios[0] == '1x');
                    assert(devicePixelRatios[1] == '2x');
                    assert(devicePixelRatios[2] == '3x');
                    assert(devicePixelRatios[3] == '4x');
                    assert(devicePixelRatios[4] == '5x');
                });

                it('should correctly sign each URL', function testSpec() {
                    var path = '/image.jpg';
                    var param, signatureBase, expected_signature;

                    srcset.split(",")
                    .map(function (srcsetSplit) {
                        return srcsetSplit.split(" ")[0];
                    }).map(function (src) {
                        // asserts that the expected 's=' parameter is being generated per entry
                        assert(src.includes("s="));

                        // param will have all params except for '&s=...'
                        param = src.slice(src.indexOf('?'), src.indexOf('s=')-1);
                        generated_signature = src.slice(src.indexOf('s=')+2, src.length);
                        signatureBase = 'MYT0KEN' + path + param;
                        expected_signature = md5(signatureBase);

                        assert.equal(expected_signature, generated_signature);
                    });
                });

                it('should include a dpr param per specified src', function testSpec() {
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`dpr=${i+1}`));
                    }
                });

                it('should include variable qualities by default', function testSpec() {
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${DPR_QUALITY[i]}`));
                    }
                });

                it('should override the variable quality if a quality parameter is provided', function testSpec() {
                    var QUALITY_OVERRIDE = 100;
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800, q:QUALITY_OVERRIDE});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${QUALITY_OVERRIDE}`));
                    }
                });

                it('should correctly disable generated variable qualities via the \'disableVariableQuality\' argument', function testSpec() {
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800}, {disableVariableQuality: true});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(!src.includes(`q=`));
                    }
                });

                it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
                    var QUALITY_OVERRIDE = 100;
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800, q:QUALITY_OVERRIDE}, {disableVariableQuality: true});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${QUALITY_OVERRIDE}`));
                    }
                });
            });

            describe('with a height parameter provided', function describeSuite() {
                var srcset = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false,
                    secureURLToken: 'MYT0KEN'
                }).buildSrcSet('image.jpg', {h:100});

                it('should generate the expected default srcset pair values', function testSpec(){
                    resolutions = [100, 116, 134, 156, 182, 210, 244, 282,
                                    328, 380, 442, 512, 594, 688, 798, 926,
                                    1074, 1246, 1446, 1678, 1946, 2258, 2618,
                                    3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
                    srclist = srcset.split(",");
                    src = srclist.map(function (srcline){
                        return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
                    });

                    for (var i = 0; i < srclist.length; i++) {
                        assert.equal(src[i], resolutions[i]);
                    }
                });

                it('should respect the height parameter', function testSpec(){
                    srcset.split(',').map(function (src) {
                        assert(src.includes('h='));
                    });
                });

                it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
                    assert.equal(srcset.split(',').length, 31);
                });

                it('should not exceed the bounds of [100, 8192]', function testSpec() {
                    var srcsetSplit = srcset.split(",");
                    var min = Number.parseFloat(
                        srcsetSplit[0]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    var max = Number.parseFloat(
                        srcsetSplit[srcsetSplit.length-1]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    assert(min >= 100);
                    assert(max <= 8192);
                });

                // a 17% testing threshold is used to account for rounding
                it('should not increase more than 17% every iteration', function testSpec() {
                    var INCREMENT_ALLOWED = 0.17;
                    
                    var srcsetWidths = function() {
                        return srcset.split(",")
                        .map(function (srcsetSplit) {
                        return srcsetSplit.split(" ")[1];
                        })
                        .map(function (width) {
                        return width.slice(0, -1);
                        })
                        .map(Number.parseFloat);
                    }();

                    let prev = srcsetWidths[0];

                    for (let index = 1; index < srcsetWidths.length; index++) {
                        var element = srcsetWidths[index];
                        assert((element / prev) < (1 + INCREMENT_ALLOWED));
                        prev = element;
                    }
                });

                it('should correctly sign each URL', function testSpec() {
                    var path = '/image.jpg';
                    var param, signatureBase, expected_signature;

                    srcset.split(",")
                    .map(function (srcsetSplit) {
                        // split the url portion of each srcset entry
                        return srcsetSplit.split(" ")[0];
                    }).map(function (src) {
                        // asserts that the expected 's=' parameter is being generated per entry
                        assert(src.includes("s="));

                        // param will have all params except for '&s=...'
                        param = src.slice(src.indexOf('?'), src.length);
                        param = param.slice(0, param.indexOf('s=')-1);
                        generated_signature = src.slice(src.indexOf('s=')+2, src.length);
                        signatureBase = 'MYT0KEN' + path + param;
                        expected_signature = md5(signatureBase);
                        
                        assert.equal(expected_signature, generated_signature);
                    });
                });
            });

            describe('with a width and height parameter provided', function describeSuite() {
                var DPR_QUALITY = [75, 50, 35, 23, 20];
                var srcset = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false,
                    secureURLToken: 'MYT0KEN'
                }).buildSrcSet('image.jpg', {w:100,h:100});

                it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
                    assert(srcset.split(",").length == 5);

                    var devicePixelRatios = srcset.split(",")
                    .map(function (srcsetSplit){
                        return srcsetSplit.split(" ")[1];
                    });

                    assert(devicePixelRatios[0] == '1x');
                    assert(devicePixelRatios[1] == '2x');
                    assert(devicePixelRatios[2] == '3x');
                    assert(devicePixelRatios[3] == '4x');
                    assert(devicePixelRatios[4] == '5x');
                });

                it('should correctly sign each URL', function testSpec() {
                    var path = '/image.jpg';
                    var param, signatureBase, expected_signature;

                    srcset.split(",")
                    .map(function (srcsetSplit) {
                        return srcsetSplit.split(" ")[0];
                    }).map(function (src) {
                        // asserts that the expected 's=' parameter is being generated per entry
                        assert(src.includes("s="));

                        // param will have all params except for '&s=...'
                        param = src.slice(src.indexOf('?'), src.indexOf('s=')-1);
                        generated_signature = src.slice(src.indexOf('s=')+2, src.length);
                        signatureBase = 'MYT0KEN' + path + param;
                        expected_signature = md5(signatureBase);
                        
                        assert.equal(expected_signature, generated_signature);
                    });
                });

                it('should include a dpr param per specified src', function testSpec() {
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`dpr=${i+1}`));
                    }
                });

                it('should include variable qualities by default', function testSpec() {
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${DPR_QUALITY[i]}`));
                    }
                });

                it('should override the variable quality if a quality parameter is provided', function testSpec() {
                    var QUALITY_OVERRIDE = 100;
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800, q:QUALITY_OVERRIDE});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${QUALITY_OVERRIDE}`));
                    }
                });

                it('should correctly disable generated variable qualities via the \'disableVariableQuality\' argument', function testSpec() {
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800}, {disableVariableQuality: true});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(!src.includes(`q=`));
                    }
                });

                it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
                    var QUALITY_OVERRIDE = 100;
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800, q:QUALITY_OVERRIDE}, {disableVariableQuality: true});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${QUALITY_OVERRIDE}`));
                    }
                });

                it('should not modify input params and should be idempotent', function testSpec() {
                    var client = new ImgixClient({ domain: 'test.imgix.net' });
                    var params = {};
                    var srcsetOptions = { widths: [100] };
                    var srcset1 = client.buildSrcSet('', params, srcsetOptions);
                    var srcset2 = client.buildSrcSet('', params, srcsetOptions);

                    // Show idempotent, ie. calling buildSrcSet produces the same result given
                    // the same input-parameters.
                    assert(srcset1 == srcset2);

                    // Assert that the object remains unchanged.
                    assert(Object.keys(params).length === 0 && params.constructor === Object);
                });
            });

            describe('with an aspect ratio parameter provided', function describeSuite() {
                var srcset = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false,
                    secureURLToken: 'MYT0KEN'
                }).buildSrcSet('image.jpg',{ar:'3:2'});

                it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
                    assert.equal(srcset.split(',').length, 31);
                });

                it('should generate the expected default srcset pair values', function testSpec(){
                    resolutions = [100, 116, 134, 156, 182, 210, 244, 282,
                                    328, 380, 442, 512, 594, 688, 798, 926,
                                    1074, 1246, 1446, 1678, 1946, 2258, 2618,
                                    3038, 3524, 4088, 4742, 5500, 6380, 7400, 8192];
                    srclist = srcset.split(",");
                    src = srclist.map(function (srcline){
                        return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
                    });

                    for (var i = 0; i < srclist.length; i++) {
                        assert.equal(src[i], resolutions[i]);
                    }
                });

                it('should not exceed the bounds of [100, 8192]', function testSpec() {
                    var srcsetSplit = srcset.split(",");
                    var min = Number.parseFloat(
                        srcsetSplit[0]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    var max = Number.parseFloat(
                        srcsetSplit[srcsetSplit.length-1]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    assert(min >= 100);
                    assert(max <= 8192);
                });

                // a 17% testing threshold is used to account for rounding
                it('should not increase more than 17% every iteration', function testSpec() {
                    var INCREMENT_ALLOWED = 0.17;

                    var srcsetWidths = function() {
                        return srcset.split(",")
                        .map(function (srcsetSplit) {
                        return srcsetSplit.split(" ")[1];
                        })
                        .map(function (width) {
                        return width.slice(0, -1);
                        })
                        .map(Number.parseFloat);
                    }();

                    let prev = srcsetWidths[0];

                    for (let index = 1; index < srcsetWidths.length; index++) {
                        var element = srcsetWidths[index];
                        assert((element / prev) < (1 + INCREMENT_ALLOWED));
                        prev = element;
                    }
                });

                it('should correctly sign each URL', function testSpec() {
                    var path = '/image.jpg';
                    var param, signatureBase, expected_signature;

                    srcset.split(",")
                    .map(function (srcsetSplit) {
                        // split the url portion of each srcset entry
                        return srcsetSplit.split(" ")[0];
                    }).map(function (src) {
                        // asserts that the expected 's=' parameter is being generated per entry
                        assert(src.includes("s="));

                        // param will have all params except for '&s=...'
                        param = src.slice(src.indexOf('?'), src.length);
                        param = param.slice(0, param.indexOf('s=')-1);
                        generated_signature = src.slice(src.indexOf('s=')+2, src.length);
                        signatureBase = 'MYT0KEN' + path + param;
                        expected_signature = md5(signatureBase);

                        assert.equal(expected_signature, generated_signature);
                    });
                });
            });

            describe('with a width and aspect ratio parameter provided', function describeSuite() {
                var DPR_QUALITY = [75, 50, 35, 23, 20];
                var srcset = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false,
                    secureURLToken: 'MYT0KEN'
                }).buildSrcSet('image.jpg', {w:100,ar:'3:2'});

                it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
                    assert(srcset.split(",").length == 5);

                    var devicePixelRatios = srcset.split(",")
                    .map(function (srcsetSplit){
                        return srcsetSplit.split(" ")[1];
                    });

                    assert(devicePixelRatios[0] == '1x');
                    assert(devicePixelRatios[1] == '2x');
                    assert(devicePixelRatios[2] == '3x');
                    assert(devicePixelRatios[3] == '4x');
                    assert(devicePixelRatios[4] == '5x');
                });

                it('should correctly sign each URL', function testSpec() {
                    var path = '/image.jpg';
                    var param, signatureBase, expected_signature;

                    srcset.split(",")
                    .map(function (srcsetSplit) {
                        return srcsetSplit.split(" ")[0];
                    }).map(function (src) {
                        // asserts that the expected 's=' parameter is being generated per entry
                        assert(src.includes("s="));

                        // param will have all params except for '&s=...'
                        param = src.slice(src.indexOf('?'), src.indexOf('s=')-1);
                        generated_signature = src.slice(src.indexOf('s=')+2, src.length);
                        signatureBase = 'MYT0KEN' + path + param;
                        expected_signature = md5(signatureBase);
                        
                        assert.equal(expected_signature, generated_signature);
                    });
                });

                it('should include a dpr param per specified src', function testSpec() {
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`dpr=${i+1}`));
                    }
                });

                it('should include variable qualities by default', function testSpec() {
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${DPR_QUALITY[i]}`));
                    }
                });

                it('should override the variable quality if a quality parameter is provided', function testSpec() {
                    var QUALITY_OVERRIDE = 100;
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800, q:QUALITY_OVERRIDE});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${QUALITY_OVERRIDE}`));
                    }
                });

                it('should correctly disable generated variable qualities via the \'disableVariableQuality\' argument', function testSpec() {
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800}, {disableVariableQuality: true});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(!src.includes(`q=`));
                    }
                });

                it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
                    var QUALITY_OVERRIDE = 100;
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800, q:QUALITY_OVERRIDE}, {disableVariableQuality: true});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${QUALITY_OVERRIDE}`));
                    }
                });
            });

            describe('with a height and aspect ratio parameter provided', function describeSuite() {
                var DPR_QUALITY = [75, 50, 35, 23, 20];
                var srcset = new ImgixClient({
                        domain: 'testing.imgix.net',
                        includeLibraryParam: false,
                        secureURLToken: 'MYT0KEN'
                }).buildSrcSet('image.jpg', {h:100,ar:'3:2'});

                it('should be in the form src 1x, src 2x, src 3x, src 4x, src 5x', function testSpec() {
                    assert(srcset.split(",").length == 5);

                    var devicePixelRatios = srcset.split(",")
                    .map(function (srcsetSplit){
                        return srcsetSplit.split(" ")[1];
                    });

                    assert(devicePixelRatios[0] == '1x');
                    assert(devicePixelRatios[1] == '2x');
                    assert(devicePixelRatios[2] == '3x');
                    assert(devicePixelRatios[3] == '4x');
                    assert(devicePixelRatios[4] == '5x');
                });

                it('should correctly sign each URL', function testSpec() {
                    var path = '/image.jpg';
                    var param, signatureBase, expected_signature;

                    srcset.split(",")
                    .map(function (srcsetSplit) {
                        return srcsetSplit.split(" ")[0];
                    }).map(function (src) {
                        // asserts that the expected 's=' parameter is being generated per entry
                        assert(src.includes("s="));

                        // param will have all params except for '&s=...'
                        param = src.slice(src.indexOf('?'), src.indexOf('s=')-1);
                        generated_signature = src.slice(src.indexOf('s=')+2, src.length);
                        signatureBase = 'MYT0KEN' + path + param;
                        expected_signature = md5(signatureBase);

                        assert.equal(expected_signature, generated_signature);
                    });
                });

                it('should include a dpr param per specified src', function testSpec() {
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`dpr=${i+1}`));
                    }
                });

                it('should include variable qualities by default', function testSpec() {
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${DPR_QUALITY[i]}`));
                    }
                });

                it('should override the variable quality if a quality parameter is provided', function testSpec() {
                    var QUALITY_OVERRIDE = 100;
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800, q:QUALITY_OVERRIDE});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${QUALITY_OVERRIDE}`));
                    }
                });

                it('should correctly disable generated variable qualities via the \'disableVariableQuality\' argument', function testSpec() {
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800}, {disableVariableQuality: true});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(!src.includes(`q=`));
                    }
                });

                it('should respect a provided quality parameter when variable qualities are disabled', function testSpec() {
                    var QUALITY_OVERRIDE = 100;
                    var srcset = new ImgixClient({domain: 'testing.imgix.net'}).buildSrcSet('image.jpg', {w:800, q:QUALITY_OVERRIDE}, {disableVariableQuality: true});
                    srclist = srcset.split(",");
                    for(var i = 0; i < srclist.length; i++)
                    {
                        src = srclist[i].split(" ")[0];
                        assert(src.includes(`q=${QUALITY_OVERRIDE}`));
                    }
                });
            });
        });

        describe('using srcset parameters', function describeSuite(){
            describe('with a minWidth and/or maxWidth provided', function describeSuite() {
                var MIN = 500;
                var MAX = 2000;
                var client = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false,
                    secureURLToken: 'MYT0KEN'
                });
                var srcset = client.buildSrcSet('image.jpg', {}, {minWidth: MIN, maxWidth: MAX});

                it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
                    assert.equal(srcset.split(',').length, 11);
                });

                it('should generate the expected default srcset pair values', function testSpec(){
                    resolutions = [500, 580, 672, 780, 906, 1050, 1218, 1414, 1640, 1902, 2000];
                    srclist = srcset.split(",");
                    src = srclist.map(function (srcline){
                        return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
                    });

                    for (var i = 0; i < srclist.length; i++) {
                        assert.equal(src[i], resolutions[i]);
                    }
                });

                it('should not exceed the bounds of [100, 8192]', function testSpec() {
                    var srcsetSplit = srcset.split(",");
                    var min = Number.parseFloat(
                        srcsetSplit[0]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    var max = Number.parseFloat(
                        srcsetSplit[srcsetSplit.length-1]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    assert(min >= MIN);
                    assert(max <= MAX);
                });

                it('errors with non-Number minWidth', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {minWidth: 'abc'});
                    }, Error);
                });

                it('errors with negative maxWidth', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {maxWidth: -100});
                    }, Error);
                });

                it('errors with zero maxWidth', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {maxWidth: 0});
                    }, Error);
                });

                it('errors with two invalid widths', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {minWidth: 0, maxWidth: 0});
                    }, Error);
                });

                it('errors when the maxWidth is less than the minWidth', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {minWidth: 1000, maxWidth: 500});
                    }, Error);
                });

                it('generates a single srcset entry if minWidth and maxWidth are equal', function testSpec() {
                    var srcset = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false
                    }).buildSrcSet('image.jpg', {}, {minWidth: 1000, maxWidth: 1000});
                    assert(srcset, 'https://testing.imgix.net/image.jpg?w=1000 1000w');
                });

                it('does not include a minWidth or maxWidth URL parameter', function testSpec() {
                    assert(!srcset.includes('minWidth='));
                    assert(!srcset.includes('maxWidth='));
                });

                it('only includes one entry if maxWidth is equal to 100', function testSpec() {
                    var srcset = new ImgixClient({
                        domain: 'testing.imgix.net',
                        includeLibraryParam: false
                    }).buildSrcSet('image.jpg', {}, {maxWidth: 100});

                    assert.equal('https://testing.imgix.net/image.jpg?w=100 100w', srcset);
                });

                it('only includes one entry if minWidth is equal to 8192', function testSpec() {
                    var srcset = new ImgixClient({
                        domain: 'testing.imgix.net',
                        includeLibraryParam: false
                    }).buildSrcSet('image.jpg', {}, {minWidth: 8192});

                    assert.equal('https://testing.imgix.net/image.jpg?w=8192 8192w', srcset);
                });

                it('memoizes generated srcset width pairs', function testSpec() {
                    var DEFAULT_WIDTH_TOLERANCE = 0.08;
                    var key = [DEFAULT_WIDTH_TOLERANCE, MIN, MAX].join('/');
                    var cachedValue = client.targetWidthsCache[key];

                    assert(cachedValue !== undefined && cachedValue.length == 11);
                });
            });

            describe('with a widthTolerance parameter provided', function describeSuite() {
                var WIDTH_TOLERANCE = .20;
                var client = new ImgixClient({
                    domain: 'testing.imgix.net',
                    includeLibraryParam: false
                })
                var srcset = client.buildSrcSet('image.jpg', {}, {widthTolerance: WIDTH_TOLERANCE});

                it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
                    assert.equal(srcset.split(',').length, 15);
                });

                it('should generate the expected default srcset pair values', function testSpec(){
                    resolutions = [100, 140, 196, 274, 384, 538, 752, 1054, 1476, 2066, 2892, 4050, 5670, 7938, 8192];
                    srclist = srcset.split(",");
                    src = srclist.map(function (srcline){
                        return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
                    });

                    for (var i = 0; i < srclist.length; i++) {
                        assert.equal(src[i], resolutions[i]);
                    }
                });

                it('should not exceed the bounds of [100, 8192]', function testSpec() {
                    var srcsetSplit = srcset.split(",");
                    var min = Number.parseFloat(
                        srcsetSplit[0]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    var max = Number.parseFloat(
                        srcsetSplit[srcsetSplit.length-1]
                        .split(" ")[1]
                        .slice(0, -1)
                    );
                    assert(min >= 100);
                    assert(max <= 8192);
                });

                it('should not increase more than (2 * widthTolerance) + 1 every iteration', function testSpec() {
                    var INCREMENT_ALLOWED = (WIDTH_TOLERANCE * 2) + 1;

                    var srcsetWidths = function() {
                        return srcset.split(",")
                        .map(function (srcsetSplit) {
                        return srcsetSplit.split(" ")[1];
                        })
                        .map(function (width) {
                        return width.slice(0, -1);
                        })
                        .map(Number.parseFloat);
                    }();

                    let prev = srcsetWidths[0];

                    for (let index = 1; index < srcsetWidths.length; index++) {
                        var element = srcsetWidths[index];
                        assert((element / prev) < (1 + INCREMENT_ALLOWED));
                        prev = element;
                    }
                });

                it('errors with non-Number widthTolerance', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {widthTolerance: 'abc'});
                    }, Error);
                });

                it('errors with negative widthTolerance', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {widthTolerance: -0.10});
                    }, Error);
                });

                it('errors with zero widthTolerance', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {widthTolerance: 0});
                    }, Error);
                });

                it('memoizes generated srcset width pairs', function testSpec() {
                    var DEFAULT_MIN_WIDTH = 100;
                    var DEFAULT_MAX_WIDTH = 8192;
                    var key = [WIDTH_TOLERANCE, DEFAULT_MIN_WIDTH, DEFAULT_MAX_WIDTH].join('/');
                    var cachedValue = client.targetWidthsCache[key];

                    assert(cachedValue !== undefined && cachedValue.length == 15);
                });
            });

            describe('with a custom list of widths provided', function describeSuite() {
                var CUSTOM_WIDTHS = [100, 500, 1000, 1800];
                var srcset = new ImgixClient({
                domain: 'testing.imgix.net',
                includeLibraryParam: false,
                secureURLToken: 'MYT0KEN'
                }).buildSrcSet('image.jpg', {}, {widths:CUSTOM_WIDTHS});

                it('should return the expected number of `url widthDescriptor` pairs', function testSpec() {
                    assert.equal(srcset.split(',').length, 4);
                });

                it('should generate the expected default srcset pair values', function testSpec(){
                    resolutions = CUSTOM_WIDTHS;
                    srclist = srcset.split(",");
                    src = srclist.map(function (srcline){
                        return parseInt(srcline.split(" ")[1].slice(0,-1), 10);
                    });

                    for (var i = 0; i < srclist.length; i++) {
                        assert.equal(src[i], resolutions[i]);
                    }
                });

                it('errors with non-array argument', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {widths: 'abc'});
                    }, Error);
                });

                it('errors with non-positive value passed in to the argument', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {widths: [100, -200]});
                    }, Error);
                });

                it('errors with non-integer value passed in to the argument', function testSpec() {
                    assert.throws(function() {
                        new ImgixClient({
                        domain: 'testing.imgix.net'
                        }).buildSrcSet('image.jpg', {}, {widths: [100, false]});
                    }, Error);
                });
            });
        });
    });
});