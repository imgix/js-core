var packageVersion = require('./package').version;
var distVersion = require('./dist/imgix-core-js').VERSION;

if (packageVersion === distVersion) {
  return 0;
} else {
  process.stdout.write("FAIL: package.json and lib/imgix-core-js.js versions do not match!\n");
  return 1;
}
