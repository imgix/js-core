const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const pkg = require('./package.json');

export default [
  // Browser-friendly UMD build.
  {
    input: 'src/index.mjs',
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
    ],
  },
  {
    input: 'src/index.mjs',
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
