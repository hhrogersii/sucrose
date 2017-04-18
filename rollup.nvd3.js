import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';

export default {
  moduleName: 'nv',
  entry: './src/main.js',
  dest: './build/nv.d3.js',
  format: 'umd',
  // sourceMap: 'inline',
  external: ['d3', 'd3fc-rebind'],
  // treeshake: false,
  plugins: [
    replace({
      exclude: 'node_modules/**',
      values: {
        ENV_DEV: (process.env.DEV || true),
        ENV_BUILD: (process.env.BUILD || 'nv'),
        'sc-': 'nv-',
        'sucrose': 'nvd3',
      },
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
  ],
  globals: {
    'd3fc-rebind': 'fc',
    'd3': 'd3',
  },
};
