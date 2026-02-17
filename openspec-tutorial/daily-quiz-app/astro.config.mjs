// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://anilinfo2015.github.io',
  base: '/spec-drive-development',
  vite: {
    plugins: [tailwindcss()]
  }
});