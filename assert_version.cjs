var packageVersion = require('./package').version;
var ImgixClient = require('./dist/index.cjs.js');

if (packageVersion.includes(ImgixClient.version())) {
  return 0;
} else {
  process.stdout.write(
    'FAIL: package.json and src/constants.mjs versions do not match!\n',
  );
  return 1;
}