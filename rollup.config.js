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
    external: ['md5', 'js-base64'],
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
  {
    input: 'test/test-buildSrcSet.js',
    external: ['md5', 'js-base64'],
    output: [
      { file: 'test/test-buildSrcSet.cjs', format: 'cjs' },
    ],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
];
