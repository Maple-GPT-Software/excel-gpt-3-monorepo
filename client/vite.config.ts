import manifest from './manifest.json';
import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      '~shared': path.resolve('./shared'),
      '~src': path.resolve('./src'),
    },
  },
  build: {
    outDir: './extension',
  },
});
