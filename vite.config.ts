import * as path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  root: 'example',
  plugins: [react()],
  resolve: {
    alias: {
      '@efform/core': path.resolve(__dirname, './src'),
      '@efform/resolvers': path.resolve(__dirname, './resolvers'),
    },
  },
  server: {
    port: 3000,
  },
})
