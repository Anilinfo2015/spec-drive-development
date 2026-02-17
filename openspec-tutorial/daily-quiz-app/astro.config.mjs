// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://anilinfo2015.github.io',
  base: '/spec-drive-development',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
        '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      },
    },
  }
});