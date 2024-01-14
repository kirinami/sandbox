import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import tsConfig from './tsconfig.json';

export default defineConfig({
  preview: {
    host: true,
  },
  server: {
    host: true,
  },
  resolve: {
    alias: Object.entries(tsConfig.compilerOptions.paths).map(
      ([key, [value]]) => ({
        find: key.replace('*', ''),
        replacement: path.resolve(value.replace('*', '')) + '/',
      })
    ),
  },
  plugins: [react()],
});
