---
title: 'Story 4.2: US Presence — интерактивная D3-карта (desktop)'
type: 'feature'
created: '2026-07-06'
status: 'done'
baseline_revision: '5fa1072eb06b048a7f67807c30311536e1efe475'
final_revision: '3b9e820f0e06f2ff1df252e724d1dc87abcc655c'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/rollun_handoff/rollun-web-site/project/About Us.html'
  - '{project-root}/docs/pixel-acceptance/checklist-about.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-4-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-4-1-about-scaffold-composition-sections.md'
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** Секция US Presence (06) на desktop сейчас — статичный scaffold из Story 4.1: пустой `#map`, пустой `#loc-popup`, статичный `live-count=30`, `.map-hint`. Нужна живая интерактивная D3-карта США: штаты, кликабельные маркеры (HQ Sheridan WY, Store Houston TX, ~30 supplier-warehouse), поповер с деталями по клику, count-up live-счётчика 0→30 и empty-state при сбое загрузки.

**Approach:** Ввести листовой островок `'use client'` `UsPresenceMap.client.tsx`, смонтированный ТОЛЬКО в desktop-поддереве `UsPresence.tsx`. По образцу `StatsCounter` островок **рендерит `null` и обогащает готовый SSR-scaffold на месте** (не переписывает DOM): вся работа в `useEffect`, гейт — `IntersectionObserver` на `.about-dk.map-section`. При пересечении островок динамически (`await import(...)`) подгружает вендоренные `d3-geo`/`d3-selection`/`topojson-client`/`us-atlas`, строит SVG-карту внутри `#map`, вешает клик-поповеры и запускает count-up. Данные локаций живут в `content/about.ts` (`AboutContent.usPresence.locations`) как плоский сериализуемый массив и передаются островку пропсом (AD-7; островок данные не фетчит сам). Гейт по IntersectionObserver означает: на mobile `.about-dk` = `display:none` → секция никогда не пересекается → D3-чанк не грузится вовсе (art-direction без UA-сниффинга/JS-гейтинга ширины).

## Boundaries & Constraints

**Always:**
- Прототип desktop `About Us.html` — единственный источник истины пикселя, разметки, данных и поведения. Скрипт карты (`initUSMap`, `buildPopup`, `positionPopup`, `openPopup`/`closePopup`, count-up live-счётчика) портируется ДОСЛОВНО по семантике (проекция `geoAlbersUsa().fitSize([960,600], states)`, `geoPath`, `topojson.feature`/`mesh`, viewBox `0 0 960 600`, `preserveAspectRatio xMidYMid meet`, `id="us-map"`).
- Данные локаций дословно из прототипа (`PRIMARY` = hq Sheridan WY + store Houston TX; `WAREHOUSES` = 30 городов с адресами поставщиков). Порядок отрисовки — warehouses, затем primary (primary поверх), как в прототипе `LOCATIONS = [...WAREHOUSES, ...PRIMARY]`.
- Островок ENHANCES существующий scaffold: читает `#map`, `#loc-popup`, `#live-count`, `.map-hint`, `.about-dk.map-section` из DOM; данные координат/поповеров берёт из пропа `locations`. Возвращает `null`, эффект кейован `usePathname()`, cleanup отключает observer/listeners/rAF (как все island'ы проекта).
- Гейт D3-инициализации и count-up — `IntersectionObserver` (threshold `0.3`, как `mapIO` прототипа), играет ОДИН раз (disconnect после первого пересечения).
- Вендоринг: `d3-geo`, `d3-selection`, `topojson-client`, `us-atlas` — npm-зависимости (версии линейки d3@7 / topojson-client@3 / us-atlas@3), подгружаются ЛИШЬ динамическим `import()` внутри островка (code-split; без CDN-хотлинка). Атлас — `import('us-atlas/states-10m.json')`.
- Count-up live-счётчика по образцу `StatsCounter`: при motion-allowed + IO сбросить `#live-count` в `0` на mount, затем тикать `0→30` шагами по `180ms` (дословный порт `setTimeout(tick,180)` прототипа) при пересечении. Финальное `30` (SSR) — фолбэк для no-JS.
- `prefers-reduced-motion: reduce` ИЛИ отсутствие `IntersectionObserver`: count-up НЕ играет (SSR-финал `30` виден сразу). Карта (не «движение») всё равно строится при пересечении/видимости.
- Маркерные/поповерные CSS-правила прототипа (`#us-map .state`/`.nation`, `.mk*`, `.mk-chip*`, `.loc-popup.open/.below/::after`, `.lp-*`, box-shadow/transition/padding поповера) добавить в `src/styles/about.css` внутри desktop-медиаблока `@media (min-width:768px)`, под `.about-dk`; литеральные токены прототипа замапить на проектные (`--ink→--color-ink`, `--ink-soft→--color-ink-soft`, `--ink-mute→--color-ink-mute`, `--line→--color-line`, `--or→--color-or`, `--green→--color-green`, `--bg→--color-bg`, `'Poppins'→--font-display`, mono→`--font-mono`). `--map-accent` уже задан на `.map-wrap`.
- Empty-state: если динамический импорт/построение карты падает — `.map-hint` показывает `Map could not load.` (дословный `.catch` прототипа).

**Block If:**
- Требуемый прототипом маршрут/семантика карты неоднозначны и не выводимы из `About Us.html` — HALT `blocked` с описанием неоднозначности.
- Пакет `us-atlas`/`d3-geo`/`topojson-client` недоступен для установки (offline registry) — HALT `blocked`.

**Never:**
- Не трогать mobile-композицию US Presence (`.about-mb`) — статический список локаций/чипы городов это Story 4.3; островок НЕ монтируется в mobile-поддерево и НЕ грузит D3 на mobile.
- Не вводить UA-сниффинг и JS-гейтинг по ширине окна; выбор композиции — только CSS-медиа (AD-3). Единственный триггер работы островка — фактическое пересечение/видимость.
- Не переписывать RSC-scaffold `UsPresence.tsx` desktop-разметку (`#map`/`#loc-popup`/`#live-count`/`.map-hint` остаются как есть) — островок только монтируется в неё и обогащает.
- Не хотлинкать D3/topojson/атлас с CDN; не грузить полный пакет `d3` (только гранулярные `d3-geo`/`d3-selection`).
- Не менять Automation/Team/прочие секции и общий layout.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Desktop, секция в вьюпорте | scaffold + проп `locations` | Строится SVG-карта США (штаты+границы), 32 маркера (hq/store/wh) на верных координатах; live-count тикает 0→30 | — |
| Клик по маркеру | `loc` из `locations` | Открывается `#loc-popup` с деталями (primary → kicker/desc/rows; wh → список suppliers), позиционируется над/под точкой, стрелка `::after`; маркер `.is-active` | — |
| Закрытие поповера | клик по канве / `Esc` / `.lp-close` | Поповер скрывается (`open` снят), `.is-active` снят | — |
| Resize окна с открытым поповером | `resize` | Поповер репозиционируется относительно текущей точки | — |
| Mobile (<768px) | `.about-dk` = display:none | Секция не пересекается → D3-чанк НЕ грузится, островок ничего не делает; mobile-список — Story 4.3 | — |
| Сбой загрузки карты | throw в динамическом import/build | `.map-hint` → `Map could not load.`; страница не падает | graceful |
| `prefers-reduced-motion` / нет IO | reduced-motion вкл. | Карта строится, count-up не играет (`#live-count` остаётся `30`); маркеры без пульс-анимации | — |

</intent-contract>

## Code Map

- `src/content/about.ts` -- РАСШИРИТЬ: в тип `AboutContent['usPresence']` добавить `locations: AboutMapLocation[]` (+ новые типы `AboutMapLocation`/`AboutMapRow`/`AboutMapSupplier`, плоские сериализуемые, Payload-совместимые); в инстанс — дословные данные прототипа (hq, store, 30 wh). Порядок массива: 30 warehouses, затем hq, store.
- `src/components/about/UsPresenceMap.client.tsx` -- НОВЫЙ island (`'use client'`): `return null`; в `useEffect` (кей `usePathname()`) вешает IntersectionObserver на `.about-dk.map-section`, при пересечении динамически импортит d3/topojson/us-atlas и строит карту в `#map`, вешает поповеры (`#loc-popup`) и count-up (`#live-count`); empty-state в `.map-hint`; полный cleanup.
- `src/components/about/UsPresence.tsx` -- ПРАВКА (минимальная): в desktop-поддереве смонтировать `<UsPresenceMap locations={usPresence.locations} />` (внутри `.map-wrap`, рядом со scaffold). Mobile-поддерево не трогать.
- `src/styles/about.css` -- ДОБАВИТЬ marker/state/popup-internal CSS прототипа в desktop-медиаблок под `.about-dk` (после текущих `.map-overlay`-правил, до Team).
- `package.json` -- ДОБАВИТЬ deps `d3-geo`,`d3-selection`,`topojson-client`,`us-atlas` (+ dev `@types/d3-geo`,`@types/d3-selection`,`@types/topojson-client`).
- `src/components/home/StatsCounter.client.tsx` -- ЭТАЛОН island-паттерна (null + enhance + IO + reduced-motion + cleanup). Не менять.
- `rollun_handoff/rollun-web-site/project/About Us.html` -- источник истины: скрипт `initUSMap` (~1804-1936), данные `PRIMARY`/`WAREHOUSES` (~1755-1806), CSS маркеров/поповера (~628-706).

## Tasks & Acceptance

**Execution:**
- [x] `src/content/about.ts` -- добавить типы `AboutMapLocation`/`AboutMapRow`/`AboutMapSupplier` и поле `usPresence.locations`; заполнить дословно данными прототипа (2 primary + 30 wh, координаты `[lng,lat]`, адреса поставщиков) -- сериализуемый источник данных карты (AD-7), переиспользуемый Story 4.3.
- [x] `package.json` -- установить `d3-geo`/`d3-selection`/`topojson-client`/`us-atlas` (+ типы) -- вендоринг D3-стека без CDN.
- [x] `src/components/about/UsPresenceMap.client.tsx` -- island: null-рендер, IO-гейт (threshold 0.3, once), динамический импорт d3/topojson/атласа, построение SVG-карты + маркеров в `#map`, клик-поповер (`buildPopup`/`positionPopup`/open/close по клику-канве/Esc/`.lp-close`/resize), count-up `#live-count` 0→30 (reduced-motion/no-IO → финал сразу), empty-state `.map-hint`, cleanup всего.
- [x] `src/components/about/UsPresence.tsx` -- смонтировать `<UsPresenceMap locations={usPresence.locations} />` в desktop-поддереве (`.map-wrap`); mobile не трогать.
- [x] `src/styles/about.css` -- портировать CSS штатов/маркеров/чипов/поповера в desktop-медиаблок; токены прототипа → проектные токены; не дублировать уже существующие `.map-wrap`/`.map-canvas`/`.map-overlay`/`.map-hint`.

**Acceptance Criteria:**
- Given `/about` на desktop (≥768px), when секция US Presence входит в вьюпорт, then строится D3-карта США со штатами и 32 кликабельными маркерами на верных координатах, а live-count анимируется 0→30; визуал совпадает с `About Us.html`.
- Given desktop, when клик по маркеру, then открывается `#loc-popup` с корректным содержимым (primary: kicker/desc/rows; warehouse: список suppliers/адресов), позиционированный у точки; закрытие по клику-канве, `Esc` и кнопке `×` работает.
- Given mobile (<768px), when загружена страница, then D3-чанк не запрашивается и островок бездействует (`.about-dk` не пересекается); D3-карты в mobile-DOM нет.
- Given сбой загрузки карты, when динамический import/build бросает, then `.map-hint` показывает `Map could not load.` и страница остаётся рабочей.
- Given `prefers-reduced-motion: reduce` или отсутствие `IntersectionObserver`, when секция видима, then count-up не играет (`#live-count` = `30` сразу), карта строится без пульс-анимации маркеров.
- Given SPA-навигацию прочь со страницы, when островок размонтируется, then observer/listeners/rAF очищены (ничего не течёт).

## Design Notes

**Island = null + enhance (эталон `StatsCounter`).** Островок НЕ владеет разметкой — scaffold из 4.1 (`#map`, `#loc-popup`, `#live-count`, `.map-hint`) уже в DOM; островок строит SVG внутри `#map` императивно (d3-selection, как прототип: `svg.append('g')`, маркеры `g.append('circle'/'text'/'rect')`, чип-ширина через `getComputedTextLength()`). Данные поповера — статический контент из `locations` (доверенный), `popup.innerHTML` — дословный порт прототипа.

**IO-гейт даёт art-direction «бесплатно».** `display:none`-элемент никогда не «intersecting» → на mobile динамический `import()` не выполняется → D3-чанк не грузится. Фолбэк при отсутствии `IntersectionObserver`: строить карту только если `.about-dk.map-section` реально отображается (`offsetParent !== null` — проверка CSS-видимости, НЕ ширины/UA).

**Скелет островка:**
```tsx
'use client'
export default function UsPresenceMap({ locations }: { locations: AboutMapLocation[] }) {
  const pathname = usePathname()
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('.about-dk.map-section')
    const canvas = document.getElementById('map'); const popup = document.getElementById('loc-popup')
    const liveEl = document.getElementById('live-count'); if (!section || !canvas || !popup) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let cleanupFns: Array<() => void> = []
    const start = () => { countUp(liveEl, reduced); buildMap(canvas, popup, locations, cleanupFns) /* async, .catch → mapHint */ }
    // IO threshold 0.3, once → start(); no-IO fallback: if section.offsetParent !== null → start()
    return () => cleanupFns.forEach(fn => fn())
  }, [pathname])
  return null
}
```
- `geoAlbersUsa().fitSize([960,600], states)` + `geoPath`; `topojson.feature(us, us.objects.states)` для штатов, `topojson.mesh(..., (a,b)=>a!==b)` для `.nation`. viewBox `0 0 960 600`.
- Count-up: дословно `setTimeout(tick,180)` целочисленно 0→30; reduced/no-IO → `#live-count` не трогать (SSR=30).
- Данные: `AboutMapLocation = { id; city; state; coord:[number,number]; type:'hq'|'store'|'wh'; kicker?; desc?; rows?:{k;v}[]; suppliers?:{name;address}[] }`.

## Verification

**Commands:**
- `npm install` -- expected: d3-geo/d3-selection/topojson-client/us-atlas (+типы) установлены без ошибок.
- `npm run lint` -- expected: без ошибок.
- `npm run build` -- expected: strict typecheck + сборка проходят; `/about` компилируется; островок и `AboutContent.usPresence.locations` типобезопасны.

**Manual checks:**
- `npm run preview` → http://localhost:3000/about (≥1280px): карта строится при скролле к секции 06, 32 маркера кликабельны, поповеры открываются/закрываются (клик-канва/Esc/×), live-count анимируется 0→30; сверка с `About Us.html` по `docs/pixel-acceptance/checklist-about.md`.
- DevTools Network при загрузке mobile-вьюпорта (<768px): чанк d3/us-atlas НЕ запрашивается.
- Эмуляция сбоя (throw в build) → `.map-hint` = `Map could not load.`

## Spec Change Log

_(no bad_spec loopbacks — empty)_

## Review Triage Log

### 2026-07-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 1: (high 0, medium 1, low 0)
- defer: 0
- reject: 18
- addressed_findings:
  - `[medium]` `[patch]` Островок напрямую импортит типы `Topology`/`GeometryCollection` из `topojson-specification`, но пакет `@types/topojson-specification` (1.0.5) присутствовал только транзитивно (хойстнут через `@types/topojson-client`), не объявлен в `package.json`. При чистой установке с иным хойстингом или минорным апдейтом `tsc` мог сломаться. Fixed: `@types/topojson-specification: ^1.0.5` добавлен явно в `devDependencies`; lint + build пере-прогнаны — PASS.
- rejected (not defects): дословный порт прототипа `About Us.html` и/или прецеденты Story 3.4 `StatsCounter` — сброс `#live-count` в `0` на mount + count-up по IntersectionObserver (эталон `StatsCounter`, секция 06 ниже фолда — свап не виден; threshold 0.3 на `.map-section` — дословно из `mapIO` прототипа); гейт построения карты по тому же IO (by-design из intent-contract ради «нет D3 на mobile»); клик-only маркеры без keyboard/ARIA (дословный порт; epic: пиксель приоритетнее a11y); reduced-motion гасит только JS-счётчик, микро-transition'ы поповера остаются (эталон `StatsCounter`; в прототипе rm-проверки нет вовсе); вендоренный атлас 114KB в чанке вместо CDN-fetch (by-design, «без CDN»); blanket `catch` может оставить частичный `#us-map` + hint (крайне маловероятно, статик-данные, структура как в прототипном `.catch`); `esc(undefined)` (все передаваемые поля non-nullable по типам либо уже гейтятся `?? ''`); TDZ у `coords` (вызывается только после популяции); teardown не удаляет SVG (само-лечится через `existing?.remove()`, эталон `StatsCounter`); dep `[locations]` (стабильный модульный импорт); касты вокруг loose `us-atlas` decl (необходимы); no-IO fallback строит по `offsetParent` (редкая ветка, вымершие браузеры); `getComputedTextLength` fallback (на момент build DOM разложен); прочие спекулятивные/косметические.

## Auto Run Result

Status: done

### Summary
Секция US Presence (06) на desktop получила живую интерактивную D3-карту США. Введён листовой островок `UsPresenceMap.client.tsx` (`'use client'`, `return null`), смонтированный ТОЛЬКО в desktop-поддереве `UsPresence.tsx`: по образцу `StatsCounter` он обогащает готовый SSR-scaffold Story 4.1 на месте (не переписывает DOM). Гейт — `IntersectionObserver` (threshold 0.3, once) на `.about-dk.map-section`; при пересечении островок динамически (`Promise.all` + `import()`) подгружает вендоренные `d3-geo`/`d3-selection`/`topojson-client`/`us-atlas`, строит SVG-карту (`geoAlbersUsa().fitSize([960,600])`, `geoPath`, `topojson.feature`/`mesh`, viewBox 960×600) и 32 маркера (hq/store/wh) в `#map`, вешает клик-поповеры (`#loc-popup`, открытие/закрытие клик-канва/Esc/`.lp-close`, репозиция на resize) и count-up `#live-count` 0→30 (дословные 180ms-тики). Данные локаций (30 warehouse + hq Sheridan WY + store Houston TX, порядок как в прототипном `LOCATIONS`) добавлены в `content/about.ts` как плоский сериализуемый `AboutContent.usPresence.locations` (AD-7, Payload-совместимо; переиспользуемо Story 4.3). Гейт по IO даёт art-direction «бесплатно»: `.about-dk` = `display:none` <768px → секция не пересекается → D3-чанк на mobile не грузится вовсе, без UA-сниффинга/JS-гейтинга. Empty-state: сбой построения → `.map-hint` = «Map could not load.»; reduced-motion/no-IO → count-up не играет (SSR-финал `30`), карта всё равно строится.

### Files changed
- `src/components/about/UsPresenceMap.client.tsx` (new) — островок D3-карты (null-рендер, IO-гейт, динамический импорт d3/topojson/атласа, маркеры + клик-поповеры + count-up + empty-state + полный cleanup через `AbortController`/disconnect/timers/rAF).
- `src/content/about.ts` — новые типы `AboutMapLocation`/`AboutMapRow`/`AboutMapSupplier` + поле `usPresence.locations` (32 локации дословно из прототипа).
- `src/components/about/UsPresence.tsx` — смонтирован `<UsPresenceMap locations={usPresence.locations} />` в desktop `.map-wrap` (mobile-поддерево не тронуто).
- `src/styles/about.css` — добавлены CSS штатов/границы/маркеров/чипов и внутренностей поповера (`#us-map .state`/`.nation`, `.mk*`, `.mk-chip*`, `.loc-popup.open`/`.below`/`::after`, `.lp-*`) в desktop-медиаблок; токены прототипа → проектные.
- `src/types/us-atlas.d.ts` (new) — ambient-декларация `us-atlas/states-10m.json` (loose `unknown`).
- `package.json` / `package-lock.json` — deps `d3-geo`/`d3-selection`/`topojson-client`/`us-atlas` + типы `@types/d3-geo`/`@types/d3-selection`/`@types/topojson-client`/`@types/topojson-specification`.

### Review findings
- Patches applied (1): [medium] явно объявлен `@types/topojson-specification` (был лишь транзитивным при прямом импорте из `topojson-specification`).
- Deferred: 0.
- Rejected (18): дословный порт прототипа и прецеденты `StatsCounter` (детали — Review Triage Log).

### Verification
- `npm install` → deps установлены.
- `npm run lint` → PASS (без ошибок), пере-прогон после патча — PASS.
- `npm run build` → PASS (`✓ Compiled successfully`; `/about` = ○ Static prerender; островок и `usPresence.locations` типобезопасны). D3/topojson — в отдельных async-чанках (code-split подтверждён), вне основного бандла `/about` и вне mobile.

### Residual risks
- Пиксель-приёмка карты (позиции маркеров, поповеры, чипы) в браузере по `docs/pixel-acceptance/checklist-about.md` и проверка «D3-чанк не грузится на mobile» через DevTools Network — ручные шаги (SM-1), автоматически не отмечены.
- Построение карты и count-up гейтятся одним IntersectionObserver (threshold 0.3 на `.map-section`, дословно из прототипа): на аномально коротком окне/очень высокой секции карта может не построиться, если 30% секции не станет видимо — низкий риск для реальных desktop-вьюпортов.
