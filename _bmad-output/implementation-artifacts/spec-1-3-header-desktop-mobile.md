---
title: 'Story 1.3: Шапка (Header) — desktop и mobile'
type: 'feature'
created: '2026-07-05'
status: 'done'
baseline_revision: 'c65eaa8f873f2ae24ddd6c9e603b7d02f4be170a'
final_revision: 'dd29228ca96697370f39fbad1389fc024629c602'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
warnings: [oversized]
---

<intent-contract>

## Intent

**Problem:** После 1.2 есть DS-фундамент (токены/шрифты/кнопки), но `layout.tsx` рендерит только `{children}` — фирменной шапки нет ни на одной из 6 страниц. Без общего header из `components/shell` каждая страница безголовая, а пиксель-в-пиксель по Handoff (приоритет №1) недостижим.

**Approach:** Смонтировать в общий `(site)/layout.tsx` единый Header-компонент из `components/shell`, воспроизводящий Handeff-шапку дословно двумя SSR-композициями (desktop + mobile) в одном DOM, переключаемыми ТОЛЬКО CSS-медиа на 768px. Скролл-поведение (`scrolled`/`hide`) и подсветку активного роута реализовать листовым client-островком (`.client.tsx`), получающим nav-конфиг пропсами и не фетчащим. Логотип вендорится в `public/`.

## Boundaries & Constraints

**Always:**
- Один Header из `src/components/shell`, смонтированный в `(site)/layout.tsx` над `{children}` → присутствует на всех 6 роутах.
- **Две отдельные композиции desktop|mobile, обе SSR-рендерятся в DOM; переключение ТОЛЬКО CSS-媒иа на 768px** (desktop ≥768, mobile <768). JS-гейтинг (`useMediaQuery`/условный рендер по ширине) и server-side UA-сниффинг ЗАПРЕЩЕНЫ (AD-3, NFR-2) — иначе hydration-mismatch. Классы двух `.site-header` разведены scope'ом/суффиксом, чтобы не коллидировать в одном DOM.
- **Desktop (дословно):** `position:fixed`, bg `#141414`, высота 90px→76px в `.scrolled` (порог `scrollY>30`; **на `/about` порог 60** — AD-13), `.hide` = `translateY(-100%)` при скролле ВНИЗ и `y>200`, снимается при скролле вверх / `y<200`; scrolled-тень = `var(--shadow-header)`; лого `height:40px`; z-index 50.
- **Mobile (дословно):** `position:fixed`, центр в шелле `max-width:var(--spacing-shell-w)` (`left:50%;translateX(-50%)`), bg `#141414`, высота 62px→56px в `.scrolled` (порог `scrollY>20`, **без `hide`**); scrolled-тень `0 4px 18px rgba(0,0,0,.4)` (литерал, AD-13); лого `height:30px`; бургер-кнопка 44×44 (3 спана 24×2, gap 5); z-index 60.
- **Nav (обе композиции):** 6 ссылок в порядке прототипа — HOME→`/`, ABOUT US→`/about`, CATALOG→`/catalog`, OUR SHOPS→`/shops`, OUR BRANDS→`/brands`, CONTACT US→`/contact` — через `next/link`. Desktop-типографика по токенам: `--font-display`, `--text-nav` (14px/500/`0.04em`/uppercase), цвет `--color-white`; hover И активный роут → `--color-or`; `transition:color .2s`. Активный роут определяется `usePathname()`.
- Значения, существующие как токен (цвета `--color-or`/`--color-white`, `--text-nav`, `--font-display`, `--spacing-shell-w`, `--shadow-header`, spacing/motion), пишутся через токен; несуществующие как токен литералы прототипа (`#141414`, mobile-тень) — дословно (AD-13 > AD-2).
- Логотип `rollun-logo.png` (1106×224) вендорится в `public/` и отдаётся self-host (`next/image` или `<img>` с фикс-высотой).

**Block If:**
- Прототип требует значение, которого НЕТ ни как токен, ни как воспроизводимый литерал, и выбор требует решения владельца дизайна (при данном Handoff — не ожидается).

**Never:**
- НЕ реализовывать drawer/scrim/scroll-lock/`body.menu-open`/анимацию бургера-в-крест/`aria-expanded`-тоггл/закрытие по nav-клику — это Story 1.5. В 1.3 бургер отрендерен и инертен (`aria-expanded="false"` статично, без обработчика открытия).
- НЕ реализовывать footer (1.4), reveal-on-scroll (1.5), контент страниц.
- НЕ вводить JS-гейтинг/медиа-хуки/UA-сниффинг; поверхностные различия — только CSS-медиа.
- НЕ подключать orphaned `_ds/…/colors_and_type.css`; не хотлинкать шрифты/ассеты с CDN (NFR-3).
- НЕ трогать `<html lang>` (отдельный deferred-item из 1.2).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Desktop покой | ширина ≥768, `scrollY=0` | header 90px, bg `#141414`, лого 40px, nav белый, тени нет | — |
| Desktop scrolled | `scrollY>30` (`/about`: >60) | +`.scrolled` → 76px + `var(--shadow-header)` | — |
| Desktop hide | скролл вниз, `y>200` | +`.hide` → `translateY(-100%)`; при скролле вверх / `y<200` класс снят | — |
| Активный роут | `usePathname()` = href ссылки | эта nav-ссылка `--color-or`, остальные белые | нет матча → все белые |
| Mobile покой | ширина <768, `scrollY=0` | header 62px, центрирован в 440px-шелле, лого 30px, бургер 44px | — |
| Mobile scrolled | ширина <768, `scrollY>20` | +`.scrolled` → 56px + тень; `hide` НЕ применяется | — |
| Ресайз через 768px | пересечение брейкпоинта | CSS меняет видимую композицию; JS не ремоунтит, hydration-mismatch отсутствует | — |
| Бургер-тап (1.3) | клик по `#burger` | ничего (инертен до 1.5); кнопка доступна, `aria-expanded="false"` | — |

</intent-contract>

## Code Map

- `src/app/(site)/layout.tsx` -- общий шелл: импортировать `shell.css`, смонтировать `<Header/>` над `{children}`. Уже подключает `theme.css`→`components.css`.
- `src/components/shell/Header.client.tsx` -- (новый) client-островок: обе композиции (desktop+mobile) в JSX, nav через `next/link`, активный роут `usePathname()`, `useEffect` скролл-листенер (`scrolled`/`hide` desktop, `scrolled` mobile), порог зависит от pathname (`/about`→60). Устанавливает конвенцию `.client.tsx`.
- `src/components/shell/nav-config.ts` -- (новый) `NAV_ITEMS`: массив `{label, href}` в порядке прототипа (переиспользуется footer 1.4 / drawer 1.5).
- `src/styles/shell.css` -- (новый) CSS шапки, портированный дословно; две scope'нутые композиции + `@media` 768px; в `@layer components`; импорт в layout после `components.css`.
- `public/rollun-logo.png` -- (новый) вендорнутый логотип (из `rollun_handoff/rollun-web-site/project/rollun-logo.png`).
- `rollun_handoff/rollun-web-site/project/*.html` + `mobile.css`/`mobile.js` -- ИСТОЧНИК ИСТИНЫ значений/поведения (read-only).

## Tasks & Acceptance

**Execution:**
- [x] `public/rollun-logo.png` -- скопировать логотип из Handoff в `public/` -- self-host лого шапки (NFR-3).
- [x] `src/components/shell/nav-config.ts` -- экспортировать `NAV_ITEMS` (6 ссылок label→route в порядке прототипа) -- единый источник навигации.
- [x] `src/components/shell/Header.client.tsx` -- обе композиции desktop+mobile, `next/link`-nav, активный роут через `usePathname`, скролл-эффект (пороги 30/60/20, `hide` только desktop), инертный бургер 44px -- воспроизведение Handoff-шапки (AD-1, AD-3).
- [x] `src/styles/shell.css` -- дословный CSS обеих композиций (высоты/цвета/тени/лого/бургер/nav), scope-разведение, CSS-медиа-переключение на 768px, `@layer components` -- пиксель-в-пиксель (AD-13, NFR-2).
- [x] `src/app/(site)/layout.tsx` -- импортировать `shell.css`, смонтировать `<Header/>` над `{children}` -- header на всех 6 роутах.
- [x] Проверить edge-кейсы матрицы (скролл-пороги desktop/mobile, `hide`, активный роут, отсутствие CDN/UA-сниффинга) в preview/DOM; авто-тест опционален.

**Acceptance Criteria:**
- Дано любой из 6 роутов, когда он загружен, тогда сверху общий Header из одного `components/shell`-компонента, пиксель-в-пиксель по Handoff на desktop и mobile.
- Дано desktop, когда `scrollY` растёт, тогда header 90→76px при `.scrolled` (порог 30; на `/about` — 60), `hide` (`translateY(-100%)`) при скролле вниз и `y>200`, show при скролле вверх (UX-DR4).
- Дано mobile, когда `scrollY>20`, тогда header 62→56px, центрирован в 440px-шелле, бургер 44px присутствует, `hide` не применяется.
- Дано nav, когда текущий pathname совпадает с href ссылки, тогда эта ссылка подсвечена `--color-or`; все ссылки ведут на соответствующие роуты через `next/link`.
- Дано обе композиции, когда осмотрен DOM, тогда desktop И mobile SSR-отрендерены, переключение — только CSS-медиа на 768px; нет `useMediaQuery`/условного рендера по ширине/UA-сниффинга (AD-3).

## Spec Change Log

## Review Triage Log

### 2026-07-05 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 8: (high 0, medium 2, low 6)
- defer: 0
- reject: 6: (high 0, medium 0, low 6)
- addressed_findings:
  - `[medium]` `[patch]` Mobile-шапка шринкалась по общему desktop-порогу (30/60), а не по прототип-порогу mobile `scrollY>20`. Разведены независимые состояния `dkScrolled`(30/60) / `mbScrolled`(20); ре-верифицировано билдом.
  - `[medium]` `[patch]` Дыра брейкпоинта: desktop `min-width:768px` + mobile `max-width:767.98px` оставляли полосу 767.98–768px, где обе композиции `display:none` (шапка исчезала при дробной ширине/зуме). Mobile-запрос заменён на точный комплемент `not all and (min-width:768px)` — ровно одна композиция видима при любой ширине.
  - `[low]` `[patch]` `/about` использовал простую hide-логику вместо прототип-алгоритма с 4px-деадбендом (джиттер у y≈200). Добавлена ветка гистерезиса для `/about` (AD-13).
  - `[low]` `[patch]` Логотип `<img>` без `width/height` → горизонтальный CLS при загрузке. Проставлены интринсик `width={1106} height={224}` (CSS-высота управляет рендером, атрибуты резервируют место).
  - `[low]` `[patch]` Активная nav-ссылка матчилась только точным равенством → на вложенных роутах (Epic 5 `/catalog/tires`) пункт гас. `isActive` теперь: root — точно, остальные — `pathname===href || startsWith(href+'/')`.
  - `[low]` `[patch]` У активной ссылки не было a11y-семантики. Добавлен `aria-current="page"`.
  - `[low]` `[patch]` У nav-ссылок и бургера не было видимого focus-ring (WCAG 2.4.7). Добавлен `:focus-visible` оранжевый ринг по DS-конвенции 1.2 (невидим в покое → пиксель не затронут).
  - `[low]` `[patch]` Запланированный `requestAnimationFrame` не отменялся при cleanup/смене pathname. Добавлен `cancelAnimationFrame(raf)`.
- rejected (шум / вне scope / by-design):
  - Весь Header как client-компонент (не «листовой островок» в чистом виде) — by-design и предписано спекой: активный роут требует `usePathname()` (client), nav-разметка тривиальна; выигрыш от расщепления на RSC+тоггл ничтожен.
  - Не портированы прототип-правила `@media(max-width:720px)` для nav → «overflow 768–900» — ЛОЖНОЕ/faithful: единственный header-брейкпоинт прототипа — 720px (<768, в прод не отгружается, AD-3); собственный 720-брейк дизайна подтверждает, что полный nav рассчитан на ≥721px, наш диапазон ≥768 внутри него.
  - Токен-нит (`#141414`, mobile-тень `0 4px 18px…`, `margin-right:20px`, padding `18px`) — литералы прототипа без токена, санкционированы AD-13 > AD-2 (как и отклонения в ревью 1.2).
  - Фикс-шапка без `padding-top` у `body` → подлезание контента — by-design: в прототипе `body` без отступа, hero каждой страницы full-bleed уходит под шапку; заглушки-страницы контента не несут (герои — Epic 3–6).
  - Флеш начального scroll-состояния при перезагрузке в середине страницы — воспроизводит поведение прототипа (его JS тоже стартует после load), минорно.
  - Инертный бургер с `aria-expanded="false"` без обработчика — явно отложено в Story 1.5 (drawer/scroll-lock/анимация-в-крест); здесь бургер отрендерен по scope.

### 2026-07-05 — Follow-up review pass (review_loop_iteration 0)
- intent_gap: 0
- bad_spec: 0
- patch: 1: (high 0, medium 0, low 1)
- defer: 2: (high 0, medium 0, low 2)
- reject: 14: (high 0, medium 0, low 14)
- addressed_findings:
  - `[low]` `[patch]` `.burger span` использовал литерал `#fff` вместо токена `--color-white` — прямое отклонение от Boundary спеки («значения, существующие как токен … пишутся через токен»). Заменено на `var(--color-white)` (== `#fff` в `theme.css:36`, пиксель-идентично). Ре-верифицировано: tsc/lint/build PASS.
- deferred (новые записи в `deferred-work.md`, NEW-only):
  - `[low]` `[defer]` Нет skip-to-content перед постоянной навигацией (WCAG 2.4.1 A) — кросс-каттинг: нужен стабильный `<main id>`-ландмарк и решение по структуре страниц; не локально для header-диффа → фокус-проход shell/a11y.
  - `[low]` `[defer]` Нет `prefers-reduced-motion` для scroll-моции шапки (shrink + `translateY(-100%)` + тень; WCAG 2.3.3) — лучше решать DS-широко (1.5 добавит reveal-on-scroll, `theme.css` уже токенизирует моцию) одним `@media (prefers-reduced-motion: reduce)`-проходом, а не header-локальной полумерой.
- rejected (шум / вне scope / by-design / faithful-to-prototype):
  - **Scroll/hide-логика** (E2 «шапка застревает hidden при медленном скролле ВВЕРХ на /about»; претензия «rAF ломает verbatim»; «/about отличается от остальных роутов») — ВЕРНАЯ дословная копия прототипа, сверено с источником истины: `Home.html:1330-1336` (desktop без деадбенда) и `About Us.html:1695-1708` (`/about`: деадбенд ±4px + ТОТ ЖЕ `requestAnimationFrame`+`ticking`-throttle). Порт побайтно верен, rAF и всё; «застревание» присутствует в самом прототипе. Правка отклонила бы источник истины (AD-13, приоритет №1 — пиксель/поведение); это была бы несанкционированная дизайн-правка.
  - Фикс-шапка без body-offset (подлезание контента) — by-design/faithful: в прототипе `body` без `padding-top`, герои full-bleed уходят под шапку; заглушки контента не несут (уже отклонено в pass 1).
  - Mobile без работающей nav / инертный бургер с `aria-expanded="false"` — предписано спекой («Never»: drawer/scroll-lock = Story 1.5; «бургер отрендерен и инертен»).
  - Mobile 440px-шелл «плавает» над full-width контентом в 440–767px — предписано (`max-width:var(--spacing-shell-w)`); констрейнт контентной колонки = mobile-chassis 1.5; реального контента пока нет.
  - Весь Header — client-компонент (не «чистый островок») — by-design/предписано: активный роут требует `usePathname()` (уже отклонено в pass 1).
  - Токен-литералы: `#141414`×2 и mobile-тень (нет токена, AD-13), `margin-right:20px` (прототип-литерал), `padding:18px` (прототип; токен `--spacing-gutter-mobile`=20px ≠ 18 → 18px faithful), z-index 50/60 (нет token-шкалы, прототип-значения) — прототип-литералы (уже отклонено в pass 1).
  - Дубль header-DOM и near-дубль CSS (`.logo`) — ядро предписанной двухкомпозиционной SSR-архитектуры (AD-3); скрытая композиция `display:none` (вне a11y-дерева).
  - `usePathname()` null-краш (E1) — недостижимо: Next 16.2 типизирует возврат как non-null `string`; guard был бы мёртвым кодом. Билд с Cache Components/PPR прошёл при client-`usePathname`.
  - `var()` без фолбэков (E3) — все токены присутствуют в `theme.css` (сверено: `--spacing-shell-w`/`--shadow-header`/`--duration-*`/`--text-nav--*`); фолбэки — шум и маскировали бы будущие переименования.
  - Фокус на скрытой (`.hide`) шапке; отсутствие юнит-тестов (спека: авто-тест опционален; тест-харнесс = вне scope стори) — минорно / вне scope.
- already-deferred (не дублируется):
  - `<html lang="ru">` при EN-контенте (#4) — реальная a11y/SEO-проблема, но УЖЕ в `deferred-work.md` (source_spec 1-2, pre-existing из scaffold 1.1); по правилу NEW-only не пере-добавляется и не редактируется.

## Design Notes

**Архитектура двух композиций (одна из ключевых точек AD-3):** оба `<header>` всегда в DOM; CSS-медиа скрывает нерелевантную. Классы разведены (например `.site-header--dk` / `.site-header--mb` или scope-обёртки), чтобы одинаковое имя `.site-header` из двух прототип-файлов не конфликтовало. Точные имена — за кодом; инвариант — никакого JS-переключения по ширине.

**Скролл-островок:** `Header.client.tsx` — единственный носитель интерактива (`useEffect` + `usePathname`); nav-контент приходит из `NAV_ITEMS` пропсами/импортом, островок НЕ фетчит (AD-1/AD-4). Порог `scrolled` = `pathname==='/about' ? 60 : 30`; `hide` — только desktop-логика; rAF-throttle желателен. Бургер рендерится, но открытие drawer — 1.5.

**Golden CSS (дословно из прототипа; литералы вне токенов — по AD-13):**
```css
/* desktop */
.site-header { position:fixed; top:0; left:0; right:0; z-index:50; height:90px;
  display:flex; align-items:center; background:#141414;
  transition:transform .35s ease, height .25s ease, box-shadow .25s ease; }
.site-header.scrolled { height:76px; box-shadow:var(--shadow-header); }
.site-header.hide { transform:translateY(-100%); }
.nav a { color:var(--color-white); font-family:var(--font-display); font-weight:500;
  font-size:14px; letter-spacing:.04em; text-transform:uppercase; transition:color .2s; }
.nav a:hover, .nav a.active { color:var(--color-or); }
/* mobile (max-width:767.98px scope) */
.site-header { left:50%; transform:translateX(-50%); z-index:60; width:100%;
  max-width:var(--spacing-shell-w); height:62px; }
.site-header.scrolled { height:56px; box-shadow:0 4px 18px rgba(0,0,0,.4); }
.burger { width:44px; height:44px; display:flex; flex-direction:column;
  justify-content:center; align-items:center; gap:5px; background:transparent; border:0; }
.burger span { width:24px; height:2px; background:#fff; border-radius:2px; }
```

**Прим.:** desktop-лого 40px, mobile 30px; логотип 1106×224 (аспект ~4.94:1). `#141414` — прототип-bg шапки, отдельный от токена `--dark`(#1a1a1a); воспроизводится литералом (AD-13). Бургер-в-крест анимация (`body.menu-open .burger span`) — часть interaction-story 1.5, здесь НЕ добавляется.

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: типы проходят (включая `Header.client.tsx`, `nav-config.ts`).
- `npm run build` -- expected: `next build` собирается; 6 роутов рендерятся с header.
- `npm run lint` -- expected: чисто.
- `grep -rniE "usemediaquery|navigator.useragent|user-agent|fonts.googleapis|fonts.gstatic|colors_and_type" src/` -- expected: пусто (нет JS-гейтинга по ширине/UA-сниффинга/CDN-хотлинка).

**Manual checks (if no CLI):**
- `npm run dev`, открыть `/` и `/about`: desktop — скролл >30 (About >60) даёт shrink; скролл вниз >200 прячет, вверх — показывает. Сузить <768px: появляется mobile-шапка в 440px-шелле, скролл >20 = shrink, hide нет.
- В DOM обе `<header>`-композиции присутствуют одновременно; nav-ссылка текущего роута — оранжевая.
- `public/rollun-logo.png` существует; в Network нет запросов к внешним CDN за лого/шрифтами.

## Auto Run Result

Status: done

### Что реализовано
Фирменная шапка на всех 6 роутах, смонтированная в `(site)/layout.tsx`. Две SSR-композиции (desktop + mobile) живут в одном DOM и переключаются ТОЛЬКО CSS-медиа на 768px (точный комплемент запросов — ровно одна видима при любой ширине); JS-гейтинга по ширине/UA-сниффинга нет (AD-3). Desktop: `position:fixed`, bg `#141414`, 90→76px при `.scrolled` (порог 30, на `/about` — 60), `hide` = `translateY(-100%)` при скролле вниз и `y>200` (на `/about` — с 4px-гистерезисом прототипа), scrolled-тень `var(--shadow-header)`, лого 40px, nav по токенам (`--font-display`/`--text-nav`, белый → `--color-or` на hover/active). Mobile: центр в 440px-шелле, 62→56px при `scrollY>20` (без hide), лого 30px, инертный бургер 44px (drawer — Story 1.5). Активный роут — `usePathname()` (root — точно, вложенные — по префиксу), с `aria-current="page"`. Интерактив изолирован в первом `.client.tsx`-островке (конвенция установлена), nav-контент из `NAV_ITEMS` (переиспользуется 1.4/1.5). Логотип self-host в `public/`.

### Изменённые файлы
- `src/app/(site)/layout.tsx` — импорт `shell.css` (после `components.css`), монтаж `<Header/>` над `{children}`.
- `src/components/shell/Header.client.tsx` (новый) — client-островок: обе композиции, независимые `dkScrolled`/`mbScrolled`, hide (+About-гистерезис), активный роут по префиксу + `aria-current`, rAF-throttle с отменой, инертный бургер.
- `src/components/shell/nav-config.ts` (новый) — `NAV_ITEMS` (6 ссылок в порядке прототипа).
- `src/styles/shell.css` (новый) — CSS обеих композиций, `@layer components`, комплементарные media-запросы 768px, focus-visible ринги.
- `public/rollun-logo.png` (новый) — вендорнутый логотип (1106×224).

### Ревью
- **Патчей применено: 8** (medium 2, low 6): [med] mobile-порог шринка 20 (независимо от desktop 30/60); [med] закрыта дыра брейкпоинта 767.98–768px (комплемент `not all and (min-width:768px)`); [low] About-гистерезис hide (±4px); [low] `width/height` на лого (CLS); [low] активный роут по префиксу (вложенные роуты); [low] `aria-current="page"`; [low] `:focus-visible` ринги на nav/бургере (WCAG 2.4.7); [low] `cancelAnimationFrame` в cleanup.
- **Отклонено: 6** — весь-header-client (by-design/предписано), 720px-nav-правила/«overflow» (faithful, <768 не отгружается), токен-литералы (AD-13), фикс-шапка без body-offset (by-design, герои уходят под шапку), scroll-флеш при reload (как в прототипе), инертный бургер-ARIA (отложено в 1.5).
- **Отложено: 0.** intent_gap 0, bad_spec 0. `followup_review_recommended: true` — правки затронули центральную scroll/breakpoint-логику (2 medium + 6 low), независимый повторный проход полезен.

### Верификация (проведена лично после патчей)
- `npx tsc --noEmit` → PASS; `npm run lint` → PASS (чисто); `npm run build` → PASS (все 6 site-роутов рендерят header).
- `grep` по `src/` на `useMediaQuery`/UA-сниффинг/CDN-хотлинк/`colors_and_type` → пусто.
- `public/rollun-logo.png` существует (10870 bytes).

### Остаточные риски
- Пиксель-приёмка на реальных брейкпоинтах — формально закрывается Story 1.6 (SM-1 чеклист + preview); здесь проверено логикой/билдом, не визуальным диффом.
- Drawer/scroll-lock/анимация-бургера-в-крест/`body.menu-open`/reveal-on-scroll — Story 1.5 (бургер сейчас инертен, но доступен и озвучивается AT; обработчик и правдивый `aria-expanded` придут в 1.5).
- Заглушки-страницы контента не несут, поэтому подлезание под фикс-шапку не видно; для будущих страниц без full-bleed hero нужен собственный top-offset (герои — Epic 3–6).
- `<html lang="ru">` остаётся (deferred-item из 1.2, вне scope 1.3).

### Follow-up review (2026-07-05, iteration 0)

Независимый повторный проход (рекомендованный pass 1, т.к. правки затронули центральную scroll/breakpoint-логику). Blind Hunter + Edge Case Hunter запущены параллельно на дифф от baseline `c65eaa8`; финальная severity/триаж — оркестратором с полным контекстом (severity сабагентов отброшена).

**Ключевой результат — верификация против источника истины.** Scroll/hide-поведение сверено напрямую с прототип-JS: `Home.html:1330-1336` (desktop, без деадбенда) и `About Us.html:1695-1708` (`/about`, деадбенд ±4px + rAF-throttle). Порт pass 1 — побайтно верная копия, включая rAF-семантику и edge-поведение. Все три «scroll-бага» ревьюеров (застревание hidden при медленном скролле вверх на /about, «rAF ломает verbatim», расхождение /about vs остальных) — это ФАЙТ­ФУЛ-репродукция прототипа; правка деградировала бы фиделити (AD-13). Отклонены.

**Итог триажа:** 1 patch (low), 2 defer (low), 14 reject; intent_gap 0, bad_spec 0 (лупбэка нет).

**Изменённые файлы (этот проход):**
- `src/styles/shell.css` — `.burger span` `background:#fff` → `var(--color-white)` (Boundary-комплаенс спеки; пиксель-идентично, `--color-white:#fff`).
- `_bmad-output/implementation-artifacts/deferred-work.md` — 2 новые записи (skip-to-content WCAG 2.4.1; `prefers-reduced-motion` WCAG 2.3.3).

**Отложено (новое в ledger):** skip-to-content link (кросс-каттинг, нужен `<main id>`); DS-широкая `prefers-reduced-motion` политика (1.5 добавит reveal-on-scroll). `<html lang>` НЕ дублирован — уже в ledger из 1.2.

**Верификация (лично, после патча):** `npx tsc --noEmit` → PASS; `npm run lint` → PASS; `npm run build` → PASS (11/11 страниц, все 6 site-роутов; Cache Components/PPR ок при client-`usePathname`); grep-гард (useMediaQuery/UA/CDN/colors_and_type) → пусто.

**Follow-up recommendation: false.** Проход внёс одну low, пиксель-идентичную, zero-behavior CSS-подстановку токена — недостаточно для ещё одного независимого ревью. Центральная логика подтверждена верной, не изменена.

**Остаточные риски:** без изменений к pass 1 (визуальная пиксель-приёмка — Story 1.6; drawer/scroll-lock/reveal — 1.5; `<html lang>` — deferred из 1.2). Новые deferred-айтемы (skip-link, reduced-motion) — низкий приоритет, вынесены в фокус-проходы.
