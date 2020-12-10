import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      name: 'imgix',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/**']
      })
    ]
  },
  {
    input: 'src/main.js',
    external: ['md5', 'js-base64', 'assert'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  },
  // Transpile test suite to cjs. This step allows us to write our
  // tests with es6 module syntax while keeping our CI testing simple
  // (as our CI environment expects to test in a node-based environment).
  ...testSuiteHelper()
];

// testSuiteHelper maps cjsConfig over the lists of test-files.
// The result is a list of configuration objects.
function testSuiteHelper() {
  const testFiles = [
    'test-buildSrcSet',
    'test-buildURL',
    'test-client',
    'test-validators'
  ];

  return testFiles.map(f => cjsConfig(f));
}

// cjsConfig accepts an extension-less file name and applies the
// appropriate configuration information before returning the
// configuration object.
function cjsConfig(testFile) {
  return {
    input: `test/${testFile}.js`,
    // Externalize dependencies so that they are excluded from the
    // final bundle.
    external: ['md5', 'js-base64', 'assert'],
    output: [
      { file: `test/build/${testFile}.cjs`, format: 'cjs' },
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
}