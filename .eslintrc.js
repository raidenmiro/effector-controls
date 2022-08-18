const { configure, presets } = require('eslint-kit')

module.exports = configure({
  presets: [
    presets.imports({
      sort: {
        newline: true,
      },
      alias: {
        '@efform/resolvers': ['./resolvers'],
        '@efform/resolvers/*': ['./resolvers/*'],
        '@efform/core': ['./src'],
        '@efform/core/*': ['./src/*'],
      },
    }),
    presets.node(),
    presets.prettier(),
    presets.typescript(),
    presets.react({
      version: 'detect',
      newJSXTransform: true,
    }),
    presets.effector({
      future: true,
    }),
  ],
  extend: {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
})
