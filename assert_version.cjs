var packageVersion = require('./package').version;

(async () => {
  const { VERSION } = await import('./src/constants.mjs');
  if (packageVersion === VERSION) {
    return 0;
  } else {
    process.stdout.write(
      'FAIL: package.json and @imgix/js-core versions do not match!\n',
    );
    return 1;
  }
})();
