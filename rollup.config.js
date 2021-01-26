import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  // Browser-friendly UMD build.
  {
    input: 'src/index.mjs',
    output: {
      name: 'imgix-core-js',
      file: pkg.browser,
      format: 'umd',
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: ['node_modules/**'],
      }),
      uglify(),
    ],
  },
  {
    input: 'src/index.mjs',
    external: ['md5', 'js-base64', 'assert'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**'],
      }),
    ],
  },
];
