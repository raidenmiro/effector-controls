import { DEFAULT_EXTENSIONS } from '@babel/core'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import { defineConfig } from 'rollup'
import dts from 'rollup-plugin-dts'
import { swc } from 'rollup-plugin-swc3'

import pkg from './package.json'

const src = (file) => `src/${file}`

const external = [...Object.keys(pkg.devDependencies), ...Object.keys(pkg.peerDependencies)]

const bundle = (config) =>
  defineConfig({
    input: src('index.ts'),
    external,
    ...config,
    plugins: [...(config.plugins || [])],
  })

const dist = {
  cjs: (file) => `dist/cjs/${file}`,
  esm: (file) => `dist/esm/${file}`,
  base: (file) => `dist/${file}`,
}

const extensions = [...DEFAULT_EXTENSIONS, '.ts', '.tsx']

const babelPlugin = () =>
  babel({
    babelHelpers: 'bundled',
    extensions,
    exclude: /node_modules.*/,
  })

// eslint-disable-next-line import/no-default-export
export default defineConfig([
  bundle({
    plugins: [resolve(), babelPlugin(), swc({ minify: process.env.NODE_ENV === 'production' })],
    output: {
      file: dist.cjs('index.js'),
      format: 'cjs',
    },
  }),
  bundle({
    plugins: [resolve(), babelPlugin(), swc({ minify: process.env.NODE_ENV === 'production' })],
    output: {
      file: dist.esm('index.js'),
      format: 'esm',
    },
  }),
  bundle({
    plugins: [resolve(), dts()],
    output: {
      file: dist.base('index.d.ts'),
    },
  }),
])
