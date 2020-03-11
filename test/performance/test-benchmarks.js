var Benchmark = require('benchmark');
var ImgixClient = require('../../src/imgix-core-js');

var client = new ImgixClient({
    domain: 'testing.imgix.net',
    includeLibraryParam: false
});

var suite = new Benchmark.Suite('srcset generation', {
    'onStart': function() {
        console.log(`\tBenchmarking ${this.name}\n`);
    },

    'onCycle': function() {
        // clears the target width cache between runs to ensure that
        // memoization does not affect subsequent benchmark cycles
        var memoizedCache = ImgixClient.prototype.targetWidthsCache;
        Object.getOwnPropertyNames(memoizedCache).forEach(function (prop) {
            delete memoizedCache[prop];
        });
    },

    'onComplete': function() {
        for(var key in this) {
            var benchmark = this[key];
            try {
                if (benchmark.constructor.name == 'Benchmark') {
                    console.log("\t\t" + benchmark.toString() + "\n");
                }
            } catch (error) {
            }
        }
    }
});

suite.add('responsive', function() {
    client.buildSrcSet('image.jpg');
});

suite.add('responsive with fixed height', function() {
    client.buildSrcSet('image.jpg', { h:1000 });
});

suite.add('responsive with fixed aspect ratio', function() {
    client.buildSrcSet('image.jpg', { ar:"4:5" });
});

suite.add('fixed width', function() {
    client.buildSrcSet('image.jpg', { w:1000 });
});

suite.add('fixed width with aspect ratio', function() {
    client.buildSrcSet('image.jpg', { w:1000, ar:"4:5" });
});

suite.add('fixed width with variable quality disabled', function() {
    client.buildSrcSet('image.jpg', { w:1000 }, { disableVariableQuality:true });
});

suite.add('with custom widths', function() {
    client.buildSrcSet('image.jpg', {}, { widths:[100, 400, 800, 1200, 1800] });
});

suite.add('with minWidth and maxWidth defined', function() {
    client.buildSrcSet('image.jpg', {}, { minWidth:1800, maxWidth: 3000 });
});

suite.run({ 'async': false });
