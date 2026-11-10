// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// SITE_BASE задаёт GitHub Actions при сборке под https://gussy-pussy.ru/teplo-bakery/.
// Локально и для собственного домена переменная пустая — сайт собирается от корня.
const base = process.env.SITE_BASE || undefined

export default defineConfig({
  base,
  // site: 'https://example.ru', // нужен для sitemap и абсолютных URL
  integrations: [react()],
  build: {
    // Инлайн CSS в HTML: убирает render-blocking запрос стилей (бюджет LCP)
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [],
  },
})
