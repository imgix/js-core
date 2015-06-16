var packageVersion = require('./package').version;
var libVersion = require('./lib/imgix-core-js').VERSION;

if (packageVersion === libVersion) {
  return 0;
} else {
  process.stdout.write("FAIL: package.json and lib/imgix-core-js.js versions do not match!\n");
  return 1;
}
