**Перед любой работой прочитай общие правила среды: `/Users/olegsmirnov/Projects/site-fabric/AGENTS.md`.** Инструменты и бюджеты — `/Users/olegsmirnov/Projects/site-fabric/TOOLS.md`, деплой — `/Users/olegsmirnov/Projects/site-fabric/DEPLOY.md`. Скиллы подключены из `/Users/olegsmirnov/Projects/site-fabric/.agents/skills`.

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
| `prototype/` | прототип html+css+js (этапы 4–6), исторический артефакт — не обновляется |
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
| `node /Users/olegsmirnov/Projects/site-fabric/bin/new-site.mjs --link` | после клонирования: восстановить ссылку `.agents/skills` |

## Соглашения

- Главы сайта размечаем `data-section="<имя>"` — по ним `metrics` показывает, какая глава тормозит.
- Smooth scroll — один на сайт, `src/scripts/smooth-scroll.ts`, подключается в `src/layouts/Base.astro` (скилл `lenis-scroll`). Не создавать Lenis в секциях.
- Каждая анимация уважает `prefers-reduced-motion`.

## Специфика проекта

- **Бренд:** «Тепло» (на этапах 1–6 — «Мука»); идентификатор проекта — `teplo-bakery`.
- **Документы:** `BRIEF.md`, `DESIGN.md`, `PROTOTYPE.md` — исторические записи этапов 1–6; актуальные отличия от них — `DECISIONS.md`. Тексты сайта — `TEXTS.md` (включая микротексты корзины), это источник истины.
- **Корзина:** деморежим без бэкенда. Выбор хранится в `localStorage`; телефон вводится в браузере и никуда не отправляется. Не добавлять отправку и сбор данных без отдельного решения.
- **Анимации:** намеренно нет fade-reveal; работают только параллакс портретов, таймлайн «пульта» и кивок иконки скролла. Не возвращать reveal без решения.
- **Таймлайн:** старт 21:00 закреплён, текущее время считается от прогресса скролла (шаг 5 минут, дни 1–3).
- **Изображения:** рабочие копии — `src/assets/` (astro:assets), мобильный hero — `public/images/*.avif`; `assets/raw/` — архив генераций, в браузер не подключается. `prototype/assets/` — артефакт прототипа.
- **Проверка перед сдачей:** `npm run check` (astro check) должен проходить без ошибок; бюджеты — `metrics/budgets.json`, mobile Performance — 0.9 по брифу.
