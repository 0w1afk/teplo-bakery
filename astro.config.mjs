// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  // site: 'https://example.ru', // нужен для sitemap и абсолютных URL
  integrations: [react()],
  vite: {
    plugins: [],
  },
})
