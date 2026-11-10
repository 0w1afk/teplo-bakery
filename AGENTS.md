**Перед любой работой прочитай общие правила среды: `/Users/olegsmirnov/Projects/site-fabric/AGENTS.md`.** Инструменты, бюджеты, деплой — `/Users/olegsmirnov/Projects/site-fabric/TOOLS.md`. Скиллы подключены из `/Users/olegsmirnov/Projects/site-fabric/.claude/skills`.

# teplo-bakery

- **Этапы:** 1 стиль → 2 тексты → 3 дизайн-проект → 4 прототип (заглушки, без анимаций) → 5 анимации → 6 дизайн и изображения → 7 реализация на стеке. Правила и гейты — `/Users/olegsmirnov/Projects/site-fabric/AGENTS.md`.
- **Этапы 1–2, стиль и тексты:** `brief/BRIEF.md` и `brief/TEXTS.md` (скилл `brief`) — до `status: approved` дальше не идём.
- **Этап 3, дизайн-проект:** `brief/DESIGN.md` (скилл `design`).
- **Этапы 4–6, прототип:** `prototype/index.html` + `brief/PROTOTYPE.md` (скилл `prototype`): статика с заглушками → анимации → реальные изображения; утверждение дизайна — гейт перед реализацией.
- **Этап 7, реализация:** в `src/` — только после утверждения дизайна; приёмка — `npm run metrics` (скилл `metrics`).
- **Решения по ходу:** `brief/DECISIONS.md`.

## Структура

| Путь | Что |
|---|---|
| `brief/` | стиль (BRIEF), тексты (TEXTS), дизайн-проект (DESIGN), карточки прототипа (PROTOTYPE), референсы, решения |
| `prototype/` | упрощённые прототипы html+css+js (этапы 4–6), без сборки |
| `assets/prompts/` | style bible (`STYLE.md`) и промпты изображений (скилл `image-prompts`) |
| `assets/raw/` | исходники изображений (финалы генераций), в браузер не отдаются напрямую |
| `3d/source/` | исходные `.blend`; `3d/work/`, `3d/export/` — рабочие, не в git (скилл `blender-export`) |
| `public/models/` | оптимизированные GLB |
| `metrics/` | бюджеты, скрипт скролла, отчёты (скилл `metrics`) |
| `src/pages/`, `src/layouts/`, `src/components/` | страницы, лейауты, компоненты (React-острова — `client:visible`) |

## Команды

| Команда | Что |
|---|---|
| `npm run dev` | разработка |
| `npm run build` | prod-сборка |
| `npm run preview` | prod-сервер (http://localhost:4321) |
| `npm run metrics` | build → Lighthouse (mobile + desktop) → плавность скролла (скилл `metrics`) |
| `node /Users/olegsmirnov/Projects/site-fabric/bin/3d.mjs all` | 3D: `3d/work/*.blend` → `public/models/` (скилл `blender-export`) |
| `node /Users/olegsmirnov/Projects/site-fabric/bin/new-site.mjs --link` | после клонирования: восстановить ссылку `.claude/skills` |

## Соглашения

- Главы сайта размечаем `data-section="<имя>"` — по ним `metrics` показывает, какая глава тормозит.
- Smooth scroll — один на сайт, `src/scripts/smooth-scroll.ts`, подключается в `src/layouts/Base.astro` (скилл `lenis-scroll`). Не создавать Lenis в секциях.
- Каждая анимация уважает `prefers-reduced-motion`.

## Специфика проекта

<!-- Дополняется по ходу работы: решения, которые агенту нужно знать в каждой сессии. -->
