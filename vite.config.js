import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    global: {},
  },
  build: {
    target: 'esnext',
  },
  types: ['vite/client'],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
});
