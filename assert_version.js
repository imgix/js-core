var packageVersion = require('./package').version;
var libVersion = require('./lib/imgix-core-js').VERSION;

if (packageVersion === libVersion) {
  process.stdout.write("FAIL: package.json and lib/imgix-core-js.js versions do not match!\n");
  return 0;
} else {
  return 1;
}
