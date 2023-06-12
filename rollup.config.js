const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { uglify } = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');

export default [
  // Browser-friendly UMD build.
  {
    input: 'src/index.js',
    output: {
      name: 'ImgixClient',
      file: 'dist/imgix-js-core.umd.js',
      format: 'umd',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/**'],
      }),
      uglify(),
    ],
  },
  {
    input: 'src/index.js',
    external: ['md5', 'js-base64', 'assert'],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'default'},
      { file: pkg.module, format: 'es', exports: 'default' },
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
    ],
  },
];
