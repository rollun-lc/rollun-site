---
title: 'Story 7.3 — Управляемый контент страниц: шесть Page Globals (источник слотов переезжает из статических content/* в Payload, разметка байт-в-байт неизменна)'
type: 'feature'
created: '2026-07-06'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'fb741e9dde3a7c7bd409438e8a5aaec2653f0881'
final_revision: '368a38d3091b4b164e9cb1e286456b9f2e8ec9a7'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-7-context.md'
warnings: [oversized]
---

<intent-contract>

## Intent

**Problem:** Тексты и картинки шести публичных страниц (`/`, `/about`, `/catalog`, `/shops`, `/brands`, `/contact`) захардкожены в статических модулях `src/content/*`. Менеджер не может править размеченный контент без разработчика и пересборки — а Epic 7 обещает управляемость при сохранении пиксель-в-пиксель (приоритет #1).

**Approach:** Ввести шесть Payload Globals (`HomeContent`, `AboutContent`, `CatalogContent`, `BrandsContent`, `ShopsContent`, `ContactContent`) — по образцу `SiteSettings` (7.1). Каждый Global держит ТОЛЬКО типизированные редактируемые слоты (🔴 контент-картинки, 🟡 правимый текст живых блоков), каждое поле с `defaultValue` = точный текущий литерал Фазы 1. Билдеры `content/*` перестают быть источником этих значений и вместо этого КОМПОНУЮТ значения слотов из Global с code-owned презентацией/структурой в тот же самый контент-объект, что секции уже потребляют. Меняется источник слотов — не разметка (AD-7). Хук ревалидации — Story 7.4.

## Boundaries & Constraints

**Always:**
- **Пиксель #1 / разметка байт-в-байт.** Отрендеренный DOM всех шести страниц на desktop И mobile идентичен Фазе 1 ДО любой правки в админке. Достигается parity-гарантией: каждое поле Global несёт `defaultValue` = точный текущий литерал; для картинок-слотов билдер падает на code-owned `/public`-путь, когда relationship пуст. `findGlobal` для несохранённого Global возвращает дефолты → первый билд пиксель-идентичен (как в 7.1).
- **Global = подмножество-слоты, не весь контент-объект (AD-6/AD-7).** В Global попадают ТОЛЬКО 🔴 редактируемые картинки и 🟡 правимый текст живых блоков. Структура, `{dk,mb}`-варианты, координаты/факты, styled-runs, микрокопи, юр./статичный текст, SVG-иконки, номера-плейсхолдеры — остаются в коде (билдер/JSX). Tie-break 🟡↔⚫ → по умолчанию ⚫ (в коде). При сомнении — гвоздями.
- **Билдер компонует, страница = f(контент) (AD-7).** Каждый `buildXContent(...)` принимает свой Page Global (плюс существующий `SiteSetting`, где уже принимает) и мёрджит значения слотов с code-owned презентацией в тот же тип контент-объекта, что секции получают сейчас. Разметка секций/страниц НЕ трогается. Тип Global — typecheck-совместимое подмножество контракта страницы.
- **Тип Global — контракт (AD-7).** Payload-генерённые типы (`generate:types`) — источник правды; `tsc --noEmit` в CI обязан проходить, доказывая совместимость Global-типов с контрактами страниц.
- **Кэш-тег на каждый Global (согласование с 7.4).** Каждый серверный аксессор оборачивается в `'use cache'` + `cacheTag(<PAGE>_CONTENT_TAG)` и экспортирует канонический тег — точь-в-точь `getSiteSettings`/`SITE_SETTINGS_TAG`. Под `cacheComponents:true` без этого страница ушла бы в dynamic; тег нужен, чтобы 7.4 мог `revalidateTag`.
- **Раскладка/конвенции 7.1.** `src/globals/<Page>Content.ts` (`GlobalConfig`, kebab-slug, `admin.group:'Content Pages'`, поля с `defaultValue`, `group`/`array` для структуры); регистрация в `payload.config.ts` `globals:[...]`; аксессоры зеркалят `src/lib/site-settings.ts`; миграции — `.ts`+`.json` закоммичены; чтение только через `getPayload` (AD-12).

**Block If:**
- Источник контента страницы нельзя перевести на её Global без изменения разметки/дрейфа пикселя на каком-либо слоте, И это НЕ отложенный hero/art-direction кейс (см. Never). Это страж пикселя #1 — HALT, не «примерно похоже».
- Payload 3.x не поддерживает `defaultValue` на поле нужного типа так, чтобы parity-первый-билд был точным литералом (и seed-миграция тоже недоступна) — HALT.

**Never:**
- **Не менять разметку/структуру/визуал.** Никаких правок JSX секций/страниц, кроме перевода `content`-источника и (для `/catalog`, `/brands`) превращения страницы в `async` RSC. Ни один существующий `<img>`/`background-image`/`eslint-disable no-img-element` не трогается.
- **Не слотить hero-мозаику и art-directed dual-composition картинки (AD-3).** Hero (`background-image`, bloom-анимация 3.2) и любые desktop|mobile двойные композиции (product-line слайды Home, team-tiles About) НЕ становятся слотами в 7.3 — остаются в коде/`/public`. Отложено (см. deferred-work.md); их переезд на Media — прогрессивно позже (7.2 Design Notes).
- **Никакого page-builder / абстрактной модели `Page` (AD-5).** Только фиксированные типизированные слоты. Свободной вёрстки менеджеру не даём.
- **Не форсить `<img>`→`next/image`/`MediaImage` ради самого перехода.** Промоушен рендера картинок на next/image — прогрессивный, не обязателен в 7.3; при риске пикселя — оставить существующий элемент (7.2 прямо отложил «везде next/image» на историю-за-историей).
- **Не трогать `SiteSettings` (7.1), `Media`/`MediaImage` (7.2), afterChange-ревалидацию (7.4), товары/бренды-коллекции (Epic 8).**

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Несохранённый Global (свежий прод) | админ ничего не правил | `findGlobal` отдаёт `defaultValue`-ы → страница пиксель-идентична Фазе 1 | нет ошибки (parity-инвариант) |
| Правка текст-слота | менеджер меняет 🟡 текст в `/admin` | новый текст в той же разметке; пиксель-структура не меняется | required-поля не пусты (валидация Payload) |
| Картинка-слот пуст (default) | Media-relationship не задан | билдер отдаёт code-owned `/public`-путь → рендерится как в Фазе 1 | пустой relationship ≠ битый `<img>` (fallback обязателен) |
| Картинка-слот задан | менеджер загрузил/выбрал Media | билдер резолвит URL Media-дока в тот же контент-объект; существующий элемент рендерит его | невалидный/непопулированный ref → fallback на code-путь |
| `/catalog`,`/brands` | были sync-static | становятся `async` RSC, `await` аксессор; та же разметка | — |

</intent-contract>

## Code Map

- `src/globals/SiteSettings.ts` -- ОБРАЗЕЦ `GlobalConfig` (slug, `admin.group`, поля с `defaultValue`, parity-доктрина). Шесть новых globals зеркалят его.
- `src/globals/HomeContent.ts`, `AboutContent.ts`, `CatalogContent.ts`, `BrandsContent.ts`, `ShopsContent.ts`, `ContactContent.ts` -- НОВЫЕ. Каждый — `GlobalConfig` со слотами-подмножеством (🔴/🟡) своей страницы, `admin.group:'Content Pages'`, `defaultValue` = текущий литерал.
- `payload.config.ts` -- добавить шесть импортов в `globals:[SiteSettings, ...]`.
- `src/lib/site-settings.ts` -- ОБРАЗЕЦ аксессора (`'use cache'`+`cacheTag`+экспорт тега). Шесть новых аксессоров зеркалят.
- `src/lib/home-content.ts` (и по одному на страницу, либо `src/lib/page-content.ts`) -- НОВЫЕ. `getHomeContent()` + `HOME_CONTENT_TAG` и т.д.
- `src/content/home.ts`, `about.ts`, `catalog.ts`, `shops.ts`, `brands.ts`, `contact.ts` -- РЕФАКТОР билдеров: принять Page Global, компоновать слоты + code-owned презентацию. Типы контент-объектов сохраняются (секции не трогаются). `catalog.ts`/`brands.ts` из статических инстансов → билдер-функции.
- `src/app/(site)/page.tsx`, `about/page.tsx`, `catalog/page.tsx`, `shops/page.tsx`, `brands/page.tsx`, `contact/page.tsx` -- перевести источник на `await getXContent()`; `/catalog`,`/brands` сделать `async`. Разметка не меняется.
- `src/lib/payload.ts` -- существующий `getPayload` (не меняется).
- `src/payload-types.ts` -- РЕГЕНЕРИРУЕТСЯ (`generate:types`): интерфейсы шести Globals в `Config.globals`.
- `src/migrations/<generated>` -- НОВАЯ миграция (таблицы шести globals); `.ts`+`.json` закоммитить, прогнать `migrate`.

## Tasks & Acceptance

**Execution:**
- [x] `src/globals/{Home,About,Catalog,Brands,Shops,Contact}Content.ts` -- Создать шесть `GlobalConfig` по образцу `SiteSettings`: kebab-`slug` (`home-content` и т.д.), `admin.group:'Content Pages'`, поля-слоты (`group`/`array`, отражающие секции контент-объекта) ТОЛЬКО для 🔴 контент-картинок и 🟡 правимого текста. КАЖДОЕ поле несёт `defaultValue` = точный текущий литерал из `content/*` (parity-гарантия AD-7). Картинка-слот = ОПЦИОНАЛЬНЫЙ `upload`-relationship на `media` (без `defaultValue`; пустой = fallback в билдере). НЕ включать: `{dk,mb}`-варианты, координаты/факты, styled-runs, микрокопи, юр./статичный текст, hero-мозаику, art-directed dual-composition слайды/тайлы (AD-6 tie-break → код).
- [x] `payload.config.ts` -- Импортировать шесть globals, добавить в `globals:[SiteSettings, HomeContent, AboutContent, CatalogContent, BrandsContent, ShopsContent, ContactContent]`.
- [x] `src/lib/{home,about,catalog,brands,shops,contact}-content.ts` (или единый `src/lib/page-content.ts`) -- По образцу `site-settings.ts`: на каждый Global экспортировать `get<Page>Content()` (`'use cache'` + `cacheTag(<PAGE>_CONTENT_TAG)` + `getPayload().findGlobal({slug})`, возвращает генерённый тип) и канонический `<PAGE>_CONTENT_TAG` (для 7.4). Только RSC/build-time вызывает.
- [x] `src/content/{home,about,shops,contact}.ts` -- Рефактор существующих билдеров: добавить параметр Page-Global; значения слотов брать из него (текст напрямую; картинка — `resolveMediaUrl(slot) ?? codeOwnedDefaultPath`), остальное (структура/варианты/микрокопи) оставить code-owned. Тип возврата (контент-объект) НЕ меняется — секции не трогаются.
- [x] `src/content/{catalog,brands}.ts` -- Превратить статические инстансы (`catalogContent`,`brandsContent`) в билдер-функции `buildCatalogContent(global)`/`buildBrandsContent(global)` с той же логикой компоновки; тип контент-объекта сохранить.
- [x] `src/app/(site)/{,about/,catalog/,shops/,brands/,contact/}page.tsx` -- Перевести источник на соответствующий `await get<Page>Content()` (+ `getSiteSettings()` там, где билдер его требует). `/catalog` и `/brands` сделать `async` RSC. НИКАКИХ правок разметки/JSX секций.
- [x] `npm run generate:types` -- Регенерировать `src/payload-types.ts`; убедиться, что интерфейсы шести Globals появились в `Config.globals` (keyed by slug) и импортируемы.
- [x] `src/migrations/<generated>` -- `npm run migrate:create page_content_globals`; закоммитить `.ts`+`.json` (+ обновлённый `index.ts`); прогнать `npm run migrate` — таблицы шести globals создаются без ошибок.
- [ ] Юнит/греп-проверка edge-матрицы -- где практично, проверить fallback картинки-слота (пустой relationship → code-путь) и parity текст-дефолтов; grep-подтвердить, что hero/art-directed файлы и существующие `<img>` не изменены.

**Acceptance Criteria:**
- Given несохранённые шесть Globals (свежая БД), when `next build` рендерит все шесть страниц, then каждая пиксель-идентична Фазе 1 на desktop и mobile (parity-дефолты = литералы; картинки-слоты падают на code-owned `/public`-пути), и НИ ОДИН файл секции/hero/`<img>` не изменён.
- Given `/admin`, when менеджер правит 🟡 текст-слот или загружает картинку в 🔴 слот, then изменение доступно через Global (в билд-выводе после ревалидации 7.4), а физически изменить вёрстку/структуру он НЕ может (только типизированные слоты; page-builder отсутствует — AD-5/SM-C2).
- Given `npm run generate:types` + `npx tsc --noEmit`, then шесть Global-интерфейсов присутствуют в `Config.globals`, и типы Globals typecheck-совместимы с контрактами контент-объектов страниц (AD-7) — сборка типов зелёная.
- Given `npm run build` под `cacheComponents:true`, then сборка успешна, шесть globals зарегистрированы, миграция применена, все шесть страниц остаются статически пререндеренными (каждый аксессор `use cache`+`cacheTag`), а `SiteSettings`/`Media`/hero (AD-3) не затронуты.

## Spec Change Log

<!-- Append-only. Populated by step-04 during review loops. -->

## Review Triage Log

<!-- Append-only. Populated by step-04 on EVERY review pass. -->

### 2026-07-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 3: (high 0, medium 1, low 2)
- defer: 0
- reject: 4
- addressed_findings:
  - `[medium]` `[patch]` `AboutContent.cta` был фантом-слотом: global + миграция-колонки + генерённый тип объявляли `cta.heading`/`cta.sub` редактируемыми, но `buildAboutContent` их не читал — правка CTA About в `/admin` не давала эффекта (Home-CTA при этом был подключён). Подключил `c.cta.heading`/`c.cta.sub` в `src/content/about.ts` (parity сохранён — дефолты = литералы).
  - `[low]` `[patch]` `resolveMediaUrl` использовал `media.url ?? undefined`: populated `Media`-док с `url === ''` (пустая строка) прошёл бы в `?? codePath` как `''` → пустой `src`. Заменил на `media.url || undefined`, чтобы пустая строка тоже падала на code-owned путь (документированный инвариант «никогда не битый `<img>`»).
  - `[low]` `[patch]` картинки-слоты (About/Brands/Catalog/Shops) молча полагались на дефолтную глубину `findGlobal` (2) для популяции upload-relationship; при её будущем снижении картинки тихо откатились бы на `/public`. Закрепил `depth: 2` явно в четырёх аксессорах с image-слотами (поведенчески no-op сейчас, гард на будущее).

<!-- Отклонено (reject, кратко для аудита): (1) дублирование дефолт-литералов в Payload `defaultValue` и SQL-`DEFAULT` миграции — авто-генерённое, Payload-запись колоночный дефолт не использует, приемлемо; (2) асимметрия optional-chaining `c.entrances?.` vs не-опциональные группы — сейчас корректно (Payload типизирует группу из одних optional-полей как optional), инференс-артефакт, не дефект; (3) `shops/page` awaitит два кэш-глобала последовательно вместо `Promise.all` — оба `use cache`, эффект ничтожен; (4) `findGlobal` бросает при недоступной БД → catalog/brands (ex-static) 500 — установленный AD-12 паттерн, 4 страницы уже читают SiteSettings так с 7.1; try/catch маскировал бы падение билда, нежелательно. -->

## Design Notes

- **Почему Global = подмножество-слоты, а не весь контент-объект.** AD-7 говорит «страница подаёт тот же тип из Payload», но эпик-контекст уточняет: тип Global — «typecheck-совместимое ПОДМНОЖЕСТВО». 7.1 доказал механизм: `SiteSettings` моделирует только сырые атомы, а `content/*`-билдеры компонуют их с code-owned презентацией. 7.3 повторяет это для контента страниц: Global держит слоты, билдер мёрджит. Так AD-6 (микрокопи/структура — в коде) и AD-7 (источник переключён, разметка та же) выполняются одновременно.
- **Parity-гарантия для картинок без seed-миграции.** Media-relationship нельзя дефолтить на `/public`-строку. Решение: слот-relationship ОПЦИОНАЛЕН; билдер `resolveMediaUrl(slot) ?? codeOwnedDefaultPath`. Пустой (несохранённый) Global → code-путь → пиксель-идентично Фазе 1; заполненный → Media-URL. Ноль seed-данных, ноль риска битого `<img>`, апаер может загрузить реальную картинку. Существующий рендер-элемент (`<img>`/`background-image`) сохраняется — промоушен на `MediaImage`/next/image отложен (7.2 прогрессивно).
- **Hero и dual-composition отложены (AD-3).** Hero-мозаика (background-image + bloom 3.2) и desktop|mobile двойные композиции (product-line слайды, team-tiles) — носители art-direction (одна композиция на вьюпорт). Их слотирование рискует пикселем #1 и AD-3 под unattended-прогоном без визуальной обратной связи. Остаются в коде/`/public`; переезд на Media — отдельная прогрессивная работа (deferred-work.md).
- **Пример поля-слота (образец на `about`, ceoPhoto — плоская картинка):**
  ```ts
  // AboutContent.ts (фрагмент)
  { name: 'team', type: 'group', fields: [
    { name: 'ceoPhoto', type: 'upload', relationTo: 'media' }, // опц.; пусто → code-путь
    { name: 'ceoName', type: 'text', defaultValue: '<точный литерал Фазы 1>' },
  ]}
  ```
- **Кэш-тег сейчас, хук — в 7.4.** Аксессоры получают `use cache`+`cacheTag`+экспорт тега уже сейчас (как `getSiteSettings` в 7.1), но `afterChange`→`revalidateTag` НЕ добавляется здесь — это Story 7.4. Без тега 7.4 не сможет ревалидировать, поэтому тег — часть 7.3.

## Verification

**Commands:**
- `docker compose up -d postgres` -- expected: postgres healthy (нужен для migrate/build).
- `npm run generate:types` -- expected: `src/payload-types.ts` содержит шесть Global-интерфейсов в `Config.globals`; git-diff показывает их добавление.
- `npm run migrate:create page_content_globals` && `npm run migrate` -- expected: таблицы шести globals создаются и применяются без ошибок; файлы миграции закоммичены.
- `npx tsc --noEmit` -- expected: 0 ошибок (Global-типы совместимы с контрактами контент-объектов — AD-7).
- `npm run lint` -- expected: без ошибок; ни один `eslint-disable no-img-element` не удалён (конвент сохранён).
- `npm run build` -- expected: сборка успешна под `cacheComponents:true`; все шесть страниц (`/`,`/about`,`/catalog`,`/shops`,`/brands`,`/contact`) остаются статически пререндеренными.

**Manual checks:**
- Свежая БД (globals не сохранены): открыть все шесть страниц — визуально пиксель-идентично Фазе 1 на desktop и mobile (спот-проверка ключевых секций).
- В `/admin`: у шести Globals группа `Content Pages`; правка текст-слота и загрузка картинки в слот доступны; структуру/вёрстку изменить нельзя (нет page-builder).
- Grep: hero (`Hero.tsx`,`HeroMosaic.client.tsx`), product-line dual-composition и существующие `<img>`-поверхности НЕ изменены (diff пуст вне новых globals/аксессоров/билдеров/конфига/миграций и перевода источника в `page.tsx`).

## Auto Run Result

Status: done

**Реализовано:** введены шесть Payload Globals — `HomeContent`/`AboutContent`/`CatalogContent`/`BrandsContent`/`ShopsContent`/`ContactContent` (`admin.group:'Content Pages'`, kebab-slug), по образцу `SiteSettings` (7.1). Каждый держит ТОЛЬКО типизированные редактируемые слоты: 🟡 правимый текст живых блоков (каждое поле `required` + `defaultValue` = точный литерал Фазы 1 → parity: несохранённый global рендерится пиксель-идентично) и 🔴 контент-картинки как ОПЦИОНАЛЬНЫЕ `upload`-relationship на `media`. Билдеры `content/*` перестали быть источником этих значений и теперь КОМПОНУЮТ значения слотов с code-owned презентацией/структурой в тот же тип контент-объекта, что секции уже потребляют, — разметка секций/страниц не тронута (AD-7). Картинки резолвятся `resolveMediaUrl(slot) ?? codeOwnedDefaultPath` (пустой слот → `/public`-путь → пиксель-идентично; заполненный → Media-URL), существующий `<img>`/`background-image` сохранён (промоушен на next/image отложен, 7.2). Каждый аксессор — `'use cache'` + `cacheTag(<PAGE>_CONTENT_TAG)` + экспорт канонического тега (хук `afterChange`→`revalidateTag` отложен на 7.4). `/catalog` и `/brands` переведены в `async` RSC. Слотированы ТОЛЬКО 🔴/🟡; `{dk,mb}`-варианты, координаты/факты, styled-runs, микрокопи, юр./статичный текст, паспорт-атомы, hero-мозаика и desktop|mobile art-directed композиции (product-line слайды, team-tiles) — оставлены в коде (AD-6/AD-3, tie-break → код).

**Изменённые/новые файлы:**
- `src/globals/{Home,About,Catalog,Brands,Shops,Contact}Content.ts` (новые) — шесть `GlobalConfig` со слотами-подмножеством и parity-дефолтами.
- `payload.config.ts` — шесть globals в `globals:[...]`.
- `src/lib/{home,about,catalog,brands,shops,contact}-content.ts` (новые) — аксессоры (`use cache`+`cacheTag`+тег), у image-backed (about/brands/catalog/shops) закреплён `depth:2`.
- `src/lib/resolve-media-url.ts` (новый) — резолвер image-слота с fallback на code-путь (`media.url || undefined`).
- `src/content/{home,about,shops,contact}.ts` — билдеры принимают Page Global; `src/content/{catalog,brands}.ts` — из статических инстансов в билдер-функции. Типы контент-объектов сохранены.
- `src/app/(site)/{,about,catalog,shops,brands,contact}/page.tsx` — источник переведён на `await get<Page>Content()`; catalog/brands → `async`. JSX не тронут.
- `src/payload-types.ts` — регенерирован (шесть Global-интерфейсов в `Config.globals`).
- `src/migrations/20260706_080705_page_content_globals.{ts,json}` + `index.ts` (новые) — таблицы шести globals, применены.

**Ревью (1 проход):** patch 3 (medium 1, low 2), reject 4, intent_gap/bad_spec/defer 0. Исправлено: (medium) подключён фантом-слот `AboutContent.cta` в билдер; (low) hardening `resolveMediaUrl` против пустой строки url; (low) явный `depth:2` на image-backed аксессорах. Отклонено 4 (SQL-дефолт дубли, optional-chaining инференс, shops await-waterfall, findGlobal-throws — установленный AD-12 паттерн).

**Верификация:** `docker compose up -d postgres` healthy; `generate:types` — 6 интерфейсов в `Config.globals`; `migrate:create`+`migrate` — чисто; `tsc --noEmit` — 0 ошибок (AD-7 типы совместимы); `lint` — чисто (ни один `eslint-disable no-img-element` не удалён); `build` — успешно под `cacheComponents:true`, все шесть страниц `○ (Static)` пререндер. Пост-патч перепрогон tsc/lint/build — зелёный, статик-пререндер сохранён.

**Остаточные риски:** визуальный пиксель-в-пиксель подтверждён по построению (разметка байт-в-байт, parity-дефолты) и статик-билдом, но НЕ живым визуальным диффом на реальных вьюпортах (unattended-прогон без браузера) — рекомендуется быстрый визуальный спот-чек desktop+mobile при следующем ручном заходе. Переезд hero и art-directed картинок на Media отложен (AD-3) — прогрессивная работа вне 7.3.
