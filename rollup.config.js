import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';
import {getBabelOutputPlugin} from '@rollup/plugin-babel';

// rollup.config.js
export default {
    input: 'src/main.js',
    output: [
      {
        file: 'build/spreadsheet_ai.jsx',
        format: 'esm',
      },
      {
        file: 'build/spreadsheet_ai.min.jsx',
        format: 'esm',
        name: 'version',
        plugins: [terser()]
      }
    ],
    plugins: [json(), getBabelOutputPlugin({ presets: ['extendscript'] })]
  };