/*
var packageVersion = require('./package').version;

(async () => {
  const { VERSION } = await import('./src/constants.js');
  if (packageVersion === VERSION) {
    return 0;
  } else {
    process.stdout.write(
      'FAIL: package.json and src/constants.mjs versions do not match!\n',
    );
    return 1;
  }
})();
*/