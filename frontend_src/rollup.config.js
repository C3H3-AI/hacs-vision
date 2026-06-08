import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    dir: '../custom_components/hacs_vision/frontend',
    format: 'iife',
    name: 'HacsVisionPanel',
    entryFileNames: 'panel.js',
    sourcemap: false,
    // Keep all dynamic imports inlined so HA loads a single file
    inlineDynamicImports: true,
  },
  plugins: [
    resolve(),
    terser(),
  ],
};
