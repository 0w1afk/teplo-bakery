// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

// Основной адрес — тестовый поддомен https://teplo.zimorodok-dev.ru/ (base /).
// SITE_BASE остаётся для демо на GitHub Pages (/teplo-bakery), SITE_URL — для
// абсолютных адресов в разметке. Локально обе переменные пустые — сайт от корня.
const base = process.env.SITE_BASE || undefined
const site = process.env.SITE_URL || 'https://teplo.zimorodok-dev.ru'

export default defineConfig({
  site,
  base,
  integrations: [react()],
  build: {
    // Инлайн CSS в HTML: убирает render-blocking запрос стилей (бюджет LCP)
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [],
  },
})
