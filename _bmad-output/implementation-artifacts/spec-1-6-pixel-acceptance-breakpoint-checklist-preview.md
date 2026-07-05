---
title: 'Story 1.6: Критерий пиксель-приёмки (SM-1) — брейкпоинт-чеклист и preview'
type: 'chore'
created: '2026-07-05'
status: 'done'
baseline_revision: '8d16c944ec58f33c887069042c0a288f2b9e4212'
final_revision: '8298665e833a59c62b237bfb3372c1a388f3ebdd'
review_loop_iteration: 1
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
warnings: [oversized]
---

<intent-contract>

## Intent

**Problem:** Приоритет №1 проекта — пиксель-в-пиксель по Handoff (SM-1), но нет формального, повторяемого способа подтвердить совпадение: «готово» для страницы определяется на глаз, а не по явному перечню целевых брейкпоинтов. Это заявленный Major-риск implementation-readiness (см. отчёт §Major #1) и он блокирует объективную приёмку страниц Epic 3–6.

**Approach:** Завести в репозитории (`docs/pixel-acceptance/`) чеклист приёмки на каждую из 6 страниц: README-протокол SM-1 (как поднять preview, как матчить визуал, реестр воспроизводимых дефектов AD-13, правило «страница не Done пока все брейкпоинт-пункты не отмечены») + по одному файлу-чеклисту на страницу с явным перечнем целевых desktop-брейкпоинтов (постраничные наборы из `@media`-границ прототипа, ≥768, вплоть до 1280) и mobile-композиции (≤768px, 440px-шелл), каноническими Handoff-референсами и постраничными «ожидаемыми» дефектами. Preview — локальная команда `npm run preview` (production-build + start), открываемая в responsive-режиме браузера на каждом брейкпоинте. Авто visual-regression/pixel-diff — не в scope (Deferred).

## Boundaries & Constraints

**Always:**
- Целевые desktop-брейкпоинты каждой страницы берутся ДОСЛОВНО из `@media`-границ её файла прототипа (`<Page>.html`), только те, что ≥768px (ниже 768 — mobile-композиция, в прод не отгружается, NFR-2/AD-3). Каждый брейкпоинт-бэнд — отдельный пункт «визуал совпал с отрисованным прототипом».
- Для каждой страницы указан канонический Handoff-референс: `<Page>.html` (desktop) + `<Page> Mobile.html` (mobile), пути внутри `rollun_handoff/rollun-web-site/project/`.
- Mobile-композиция каждой страницы — ровно один пункт: `≤768px`, letterbox-шелл 440px, референс `<Page> Mobile.html`.
- Воспроизводимые дефекты дизайна (AD-13, реестр §I) размечаются в чеклисте как «ожидаемо» (не расхождение). Реестр — единственный источник: `ARCHITECTURE-SPINE.md` AD-13. Постраничные дефекты приписываются своей странице.
- README фиксирует правило приёмки: страница Epic 3–6 не считается Done, пока все её брейкпоинт-пункты не отмечены; каждый эпик-страница ссылается на свой файл-чеклист.
- Preview-команда воспроизводима локально без внешней инфры (ASSUMPTION: конкретное staging уточняет владелец — Deferred). Достаточно `next build && next start`.

**Block If:**
- Файл прототипа страницы отсутствует или не содержит извлекаемых `@media`-границ, и целевые брейкпоинты нельзя определить дословно.

**Never:**
- Не строить авто visual-regression / pixel-diff / CI-гейт (явно Deferred, не блокирует).
- Не «примирять» и не «чинить» дефекты дизайна в чеклисте — только пометить «ожидаемо» (AD-13).
- Не менять runtime-код страниц/оболочки (это чистый doc-deliverable + npm-скрипт); не трогать токены/компоненты Story 1.1–1.5.
- Не изобретать брейкпоинты, которых нет в прототипе; не включать desktop-брейкпоинты <768 как отдельные пункты приёмки.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Приёмка страницы | ревьюер открыл `npm run preview`, взял `checklist-<page>.md` | проходит каждый desktop-бэнд + mobile-пункт, сверяя визуал с `<Page>.html`/`<Page> Mobile.html`, отмечает `[x]` | — |
| Воспроизводимый дефект | визуал расходится с «идеалом», но совпадает с прототипом и есть в реестре §I | пункт отмечается как совпавший; дефект в разделе «Ожидаемо» подтверждён, не заводится как баг | — |
| Реальное расхождение | визуал не совпал с прототипом на бэнде | пункт остаётся `[ ]`, страница не Done | — |
| Preview-запуск | `npm run preview` | сборка + старт локального сервера; 6 роутов открываются на каждом целевом брейкпоинте | сборка падает ⇒ приёмку не начинать |

</intent-contract>

## Code Map

- `docs/pixel-acceptance/README.md` -- (новый) протокол SM-1: цель, `npm run preview` + как открыть брейкпоинт (responsive-режим), методология «desktop-бэнды из `@media`-границ прототипа ≥768 + mobile 440-шелл», реестр воспроизводимых дефектов (из AD-13/§I), правило Done для Epic 3–6, индекс ссылок на 6 файлов-чеклистов.
- `docs/pixel-acceptance/checklist-home.md` -- (новый) `/`; референсы `Home.html`/`Home Mobile.html`; desktop-бэнды из границ {1100, 820}; mobile ≤768/440; дефект: Home mobile marketplaces без рейтингов (§I).
- `docs/pixel-acceptance/checklist-about.md` -- (новый) `/about`; `About Us.html`/`About Us Mobile.html`; границы {880, 820}; дефект: mobile-About без контакт-модалки + статичная карта. **Cert-lightbox тут НЕТ** (он на Our Brands — проверено: `About Us*.html` содержат 0 совпадений `cert`/`lightbox`).
- `docs/pixel-acceptance/checklist-catalog.md` -- (новый) `/catalog`; `Catalog.html`/`Catalog Mobile.html`; границы {1100, 980, 920} (+`min-width:981`); постраничных дефектов §I нет — писать «нет ИЗВЕСТНЫХ постраничных дефектов (перечень §I неисчерпывающий, AD-13)».
- `docs/pixel-acceptance/checklist-brands.md` -- (новый) `/brands`; `Our Brands.html`/`Our Brands Mobile.html`; граница {980}; дефект: **cert-lightbox сертификата только в mobile-DOM** (`Our Brands Mobile.html`; `≥6` совпадений `lightbox`, на About — 0); Esc: desktop навешан, но элемент мёртв; mobile — только клик (§I).
- `docs/pixel-acceptance/checklist-shops.md` -- (новый) `/shops`; `Our Shops.html`/`Our Shops Mobile.html`; граница {980}; дефект: видимый Houston TX 77039 vs `q=Conroe` в «GET DIRECTIONS».
- `docs/pixel-acceptance/checklist-contact.md` -- (новый) `/contact`; `Contact.html`/`Contact Mobile.html`; граница {980}; дефект: стартовый `src` карты жёстко закодирован `q=53%2F27…Aldine Mail Route Rd, Houston, TX 77039` — это адрес **Houston**, воспроизводим как есть. **НЕ помечать «Conroe»** (Conroe относится ТОЛЬКО к Our Shops; в `Contact.html` слова Conroe нет).
- `package.json` -- добавить скрипт `"preview": "next build && next start"` (SM-1 preview-команда); прочие скрипты не трогать.
- `rollun_handoff/rollun-web-site/project/{<Page>.html, <Page> Mobile.html}` -- ИСТОЧНИК ИСТИНЫ для брейкпоинтов и визуала (read-only).
- `_bmad-output/planning-artifacts/architecture/architecture-rollun-site-2026-07-02/ARCHITECTURE-SPINE.md` (AD-13) -- реестр воспроизводимых дефектов (read-only, для содержимого «Ожидаемо»).

## Tasks & Acceptance

**Execution:**
- [x] `docs/pixel-acceptance/README.md` -- протокол SM-1, `npm run preview` + инструкция открыть брейкпоинт, методология брейкпоинтов, полный реестр воспроизводимых дефектов (AD-13/§I), правило Done для Epic 3–6, индекс 6 чеклистов -- единый контракт приёмки, на который ссылаются эпики 3–6.
- [x] `docs/pixel-acceptance/checklist-{home,about,catalog,brands,shops,contact}.md` (6 файлов) -- на каждую страницу: канонические Handoff-референсы, по пункту `[ ]` на каждый desktop-бэнд (из `@media`-границ прототипа ≥768, представит. ширина + бэнд) + один mobile-пункт (≤768/440-шелл), раздел «Ожидаемо (AD-13)» с постраничными дефектами -- формальный перечень брейкпоинт-пунктов приёмки на страницу.
- [x] `package.json` -- добавить `"preview": "next build && next start"` -- воспроизводимая локальная SM-1 preview-команда.

**Acceptance Criteria:**
- Дано репозиторий, когда осмотрен `docs/pixel-acceptance/`, тогда есть README-протокол + ровно 6 файлов-чеклистов (по одному на роут `/`, `/about`, `/catalog`, `/brands`, `/shops`, `/contact`).
- Дано любой файл-чеклист, когда осмотрены его пункты, тогда перечислены целевые desktop-брейкпоинты, дословно соответствующие `@media`-границам ≥768 файла прототипа этой страницы, плюс ровно один mobile-пункт (≤768px, 440-шелл); ни один desktop-брейкпоинт <768 не вынесен отдельным пунктом.
- Дано любой файл-чеклист, когда осмотрены референсы, тогда указаны и `<Page>.html`, и `<Page> Mobile.html` корректными путями внутри `rollun_handoff/rollun-web-site/project/`.
- Дано воспроизводимые дефекты AD-13 (§I), когда осмотрены чеклисты, тогда каждый постраничный дефект размечен «ожидаемо» на СВОЕЙ странице: Home → mobile-marketplaces без рейтингов; Shops → видимый Houston 77039 vs `q=Conroe` в GET DIRECTIONS; Contact → жёсткий стартовый `src` карты `53%2F27…Houston` (без ярлыка «Conroe»); About → mobile без контакт-модалки + статичная карта; **Brands → cert-lightbox только mobile-DOM (Esc-квирк)**; Catalog → «нет известных дефектов (перечень неисчерпывающий)». Ни один дефект не приписан чужой странице.
- Дано README, когда осмотрен протокол, тогда зафиксировано: `npm run preview` как preview-команда, правило «страница Epic 3–6 не Done пока все брейкпоинт-пункты не отмечены», и что авто pixel-diff — Deferred и не блокирует.
- Дано `package.json`, когда запущен `npm run preview`, тогда проект собирается и стартует локально (production-build), 6 роутов открываются для ревью на каждом брейкпоинте.

## Spec Change Log

### 2026-07-05 — bad_spec amendment (review pass 1)
- **Триггер:** ревью выявило две фактические ошибки, унаследованные из самой спеки: (1) Design Notes-реестр приписал Contact-дефекту ярлык «(координаты Conroe)» — ложь: `Contact.html` содержит `q=53%2F27…Houston, TX 77039`, слова Conroe нет (Conroe — дефект только Our Shops); (2) Code Map/Design Notes приписали cert-lightbox странице About — проверка прототипа: `About Us*.html` = 0 совпадений `cert`/`lightbox`, а `Our Brands*.html` = 6–10 ⇒ дефект принадлежит Our Brands, при этом Brands ошибочно значился «без дефектов».
- **Что изменено (вне intent-contract):** Code Map (about: убран cert-lightbox; brands: добавлен cert-lightbox; contact: `53%2F27` = Houston, не Conroe; catalog: «нет ИЗВЕСТНЫХ дефектов»), AC-дефектов (постраничная привязка), Design Notes-реестр (Houston/Brands-атрибуция + пометка «перечень §I неисчерпывающий, AD-13»), golden-note (порог 768 — владелец один: desktop `≥768`, mobile `<768`; mobile тест ~390px и ~760px; верхние границы бэндов из `@media`, нижний порог desktop = порог AD-3, не `@media`).
- **Избегаемое known-bad:** дефект, приписанный чужой странице ⇒ ревьюер Brands «чинит» cert-lightbox (нарушение AD-13) / ревьюер Contact ищет несуществующий Conroe-квирк; двойной владелец пикселя 768.
- **KEEP (пережить ре-деривацию):** desktop-band math верна (Home 1280/1024/800; About 1280/860/800; Catalog 1280/1024/960/850; Brands/Shops/Contact 1280/900); структура файлов `### Desktop/### Mobile/### Ожидаемо` с `- [ ]`-пунктами; относительные ссылки индекса; скрипт `preview`; корректные дефекты Home (marketplaces-рейтинги), Shops (Houston/Conroe), About (mobile-модалка/статик-карта); desktop-границы <768 не выносить в пункты.

## Review Triage Log

### 2026-07-05 — Review pass
- intent_gap: 0
- bad_spec: 3: (high 0, medium 3, low 0)
- patch: 2: (high 0, medium 0, low 2)
- defer: 1: (high 0, medium 0, low 1)
- reject: 8: (high 0, medium 0, low 8)
- addressed_findings:
  - `[medium]` `[bad_spec]` cert-lightbox приписан About, а живёт на Our Brands (проверено по прототипу: About=0, Brands=6–10 совпадений); Brands ошибочно «без дефектов». Спека (Code Map/Design Notes/AC) исправлена, код ре-деривируется.
  - `[medium]` `[bad_spec]` Contact-дефект `53%2F27` ложно помечен «Conroe» — это Houston-адрес; Conroe только у Our Shops. Реестр и Code Map исправлены.
  - `[medium]` `[bad_spec]` реестр §I подан как закрытый, Catalog/Brands «дефектов нет» безусловно — источник AD-13 явно «включая, но не только». Добавлена пометка «неисчерпывающий» + формулировка «нет ИЗВЕСТНЫХ».
  - `[low]` `[patch]` порог 768 двойной (desktop-бэнд `768–…` и mobile `≤768`) — mobile переведён на `<768px`; desktop владеет 768.
  - `[low]` `[patch]` mobile тестируется только ~390px — добавлен второй сэмпл ~760px (внутри 440-летербокса иной рендер, чем full-width <440).

### 2026-07-05 — Review pass 2
- intent_gap: 0
- bad_spec: 0
- patch: 3: (high 0, medium 0, low 3)
- defer: 0
- reject: 7: (high 0, medium 0, low 7)
- addressed_findings:
  - `[low]` `[patch]` About «Ожидаемо» говорил «статичная карта», но `About Us Mobile.html` вообще не содержит карты (0 совпадений `map`; desktop имеет `.map-section`). Уточнено: mobile-About не содержит desktop-секций контакт-модалки и карты (README + checklist-about).
  - `[low]` `[patch]` README разрешал приёмку на `dev`, что не пиксель-эквивалентно проду — уточнено: отметку `[x]` ставить ТОЛЬКО на `npm run preview`; добавлена заметка про занятый порт 3000.
  - `[low]` `[patch]` добавлен блок «Условия ревью»: Chromium/zoom 100%/DPR 1/окно, тестировать чуть внутри границы бэнда (скроллбар ±15px может переключить `@media` на ровной границе) — воспроизводимость ручной пиксель-сверки.
- Ядро (брейкпоинт-математика и постраничная привязка дефектов) подтверждено обоими ревьюерами как корректное; Edge Case Hunter вернул пусто. Отклонено как noise/faithful/out-of-scope: Esc-формулировка (дословно из AD-13, смысл «рабочего Esc нет» тот же); отсутствие приёмки >1280 (эпик-AC «вплоть до 1280»; бэнд ≥top покрывает более широкие); «1280 вакуумен для single-layout» (аннотация бэнда `≥N` это и сообщает); «440-летербокс на 390» (два сэмпла ~390/~760 намеренно покрывают оба состояния); 53/27↔5327 (AD-14/Epic-7, вне scope; AD-13 — воспроизводить как есть); page→epic mapping (чеклисты адресуются по странице, mapping в epics.md); 77039 в футере Catalog (футер — часть пиксель-матча страницы, дефекта нет).

## Design Notes

**Golden — desktop-брейкпоинты из прототипа (извлечены из `@media`, только ≥768, вплоть до 1280).** Каждый бэнд = один пункт приёмки; представит. ширина для теста в скобках:

| Роут | `<Page>.html` | `@media`-границы (все) | Desktop-бэнды ≥768 (пункты) |
|------|---------------|------------------------|-----------------------------|
| `/` | Home | 1100, 820, 720 | ≥1101 (1280) · 821–1100 (1024) · 768–820 (800) |
| `/about` | About Us | 880, 820, 560 | ≥881 (1280) · 821–880 (860) · 768–820 (800) |
| `/catalog` | Catalog | 1100, 980, 920, 760, 720, min 981 | ≥1101 (1280) · 981–1100 (1024) · 921–980 (960) · 768–920 (850) |
| `/brands` | Our Brands | 980, 720 | ≥981 (1280) · 768–980 (900) |
| `/shops` | Our Shops | 980, 720 | ≥981 (1280) · 768–980 (900) |
| `/contact` | Contact | 980, 720 | ≥981 (1280) · 768–980 (900) |

**Порог 768 — владелец один (AD-3):** при `≥768px` рендерится desktop-композиция ⇒ desktop-бэнды включают 768 (нижний бэнд `768–…`), а mobile-пункт — `<768px` (НЕ `≤768`, иначе 768 двойной). Нижний порог desktop = 768 — это порог AD-3 desktop/mobile, а НЕ `@media`-граница прототипа (в desktop-файле переключение на 720/560, но в прод <768 отгружается mobile — потому desktop тестируем только до 768). Верхние границы бэндов — дословно из `@media` прототипа.

Границы <768 (720/760/560) — mobile-территория, в прод-desktop не отгружаются (NFR-2/AD-3), в чеклист desktop НЕ попадают. Mobile-пункт у каждой страницы один: `<768px, 440px-шелл`, референс `<Page> Mobile.html`; тестировать на ~390px (ниже 440-шелла — full-width) И у верхней границы ~760px (внутри летербокса 440px — иной рендер).

**Реестр воспроизводимых дефектов (AD-13 / addendum §I) — в README целиком, постранично в чеклистах. Перечень НЕИСЧЕРПЫВАЮЩИЙ (AD-13: «включая, но не только §I») — страница без пункта §I пишет «нет ИЗВЕСТНЫХ постраничных дефектов», не «дефектов нет».** Привязка дефекта к странице проверена по прототипу:
- **Contact** — стартовый `src` карты жёстко `q=53%2F27…Aldine Mail Route Rd, Houston, TX 77039` — адрес **Houston** (`53/27` — номер дома); в `Contact.html` слова «Conroe» НЕТ. Воспроизводим как есть. (Не путать с Our Shops — Conroe только там.)
- **Our Shops** — видимый адрес Houston TX 77039, но «GET DIRECTIONS» ведёт на `q=Conroe, Texas`.
- **Our Brands** — **cert-lightbox** сертификата только в mobile-DOM (`Our Brands Mobile.html`; `About Us*.html` его НЕ содержат); Esc: desktop навешан, но элемент мёртв; mobile — только клик. (Дефект Our Brands, НЕ About.)
- **About mobile** — без контакт-модалки + статичная карта.
- Расхождения таблицы часов между страницами — это разные атомы (AD-14), не примиряем. Помечать только на страницах с таблицей часов (Home, Shops, Contact); иначе — только в README.
- **Home mobile** «marketplaces» теряют рейтинги, которые есть на desktop-карточках.

**Формат пункта чеклиста (пример, Home):**
```markdown
### Desktop (референс: `rollun_handoff/rollun-web-site/project/Home.html`)
- [ ] 1280px (бэнд ≥1101) — визуал совпал с отрисованным прототипом
- [ ] 1024px (бэнд 821–1100) — визуал совпал с отрисованным прототипом
- [ ] 800px  (бэнд 768–820) — визуал совпал с отрисованным прототипом
### Mobile (референс: `... Home Mobile.html`)
- [ ] <768px, 440px-шелл (тест ~390px и ~760px) — визуал совпал с отрисованным прототипом
### Ожидаемо (AD-13, не расхождение)
- mobile «marketplaces» без рейтингов (есть на desktop) — §I
- расхождение таблицы часов с др. страницами — разные атомы (AD-14)
```

**Preview:** `next build && next start` даёт прод-близкую сборку (детерминизм пиксель-фиделити, NFR-3) на `localhost:3000`; ревьюер выставляет ширину через responsive-режим DevTools. `npm run dev` допустим для быстрой итерации, но каноничен `preview`.

## Verification

**Commands:**
- `npm run build` -- expected: `next build` собирается без ошибок (регресса рантайма нет; добавлен только скрипт + docs).
- `npm run lint` -- expected: чисто (docs/markdown линтом проекта не покрыты, регресса нет).

**Manual checks:**
- `docs/pixel-acceptance/` содержит `README.md` + 6 файлов `checklist-*.md`; каждый desktop-набор совпадает с golden-таблицей выше; у каждого один mobile-пункт; референсы `<Page>.html`+`<Page> Mobile.html` разрешаются (файлы существуют).
- `npm run preview` собирает и стартует сервер; `/`, `/about`, `/catalog`, `/brands`, `/shops`, `/contact` открываются; можно выставить каждую целевую ширину.
- Каждый дефект из реестра §I присутствует на своей странице в разделе «Ожидаемо».

## Auto Run Result

Status: done

### Что реализовано
Чистый doc-deliverable критерия пиксель-приёмки SM-1 + одна npm-команда. В `docs/pixel-acceptance/` создан README-протокол SM-1 и 6 файлов-чеклистов (по одному на роут). README фиксирует: цель (пиксель-в-пиксель по Handoff, AD-13), preview-команду `npm run preview` (=`next build && next start`, отметка `[x]` только на прод-сборке), методологию брейкпоинтов (desktop-бэнды дословно из `@media`-границ прототипа ≥768 вплоть до 1280; нижний порог 768 — AD-3 split; mobile — один пункт `<768px`, 440-шелл, тест ~390/~760px), НЕИСЧЕРПЫВАЮЩИЙ реестр воспроизводимых дефектов §I с постраничной привязкой, правило Done для Epic 3–6, блок «Условия ревью». Каждый чеклист — `### Desktop`/`### Mobile`/`### Ожидаемо` с `- [ ]`-пунктами на каждый брейкпоинт. Добавлен скрипт `package.json` `"preview": "next build && next start"`. Рантайм-код (`src/`, токены, компоненты) не тронут.

### Изменённые файлы
- `docs/pixel-acceptance/README.md` — (новый) протокол SM-1: цель, preview, методология, реестр §I, правило Done, условия ревью, индекс.
- `docs/pixel-acceptance/checklist-{home,about,catalog,brands,shops,contact}.md` — (6 новых) постраничные чеклисты: desktop-бэнды + mobile-пункт + «Ожидаемо».
- `package.json` — добавлен скрипт `preview`.

### Ревью
Две пары ревью (adversarial + edge-case), 2 прохода.
- Проход 1: bad_spec 3 (medium 3) — cert-lightbox был приписан About вместо Our Brands; Contact-дефект `53%2F27` ложно помечен «Conroe» (это Houston-адрес); реестр §I подан как закрытый. Спека исправлена (Code Map/AC/Design Notes-реестр/golden-note), код ре-деривирован. patch 2 (low) — порог 768 переведён на mobile `<768`, добавлен mobile-сэмпл ~760px. defer 1 (low) — hover-gated 981 + reduced-motion Catalog → `deferred-work.md`.
- Проход 2 (финальный): patch 3 (low 3) — уточнение About (в mobile-DOM карты нет, а не «статичная карта»); приёмка `[x]` только на `preview` (не dev); блок «Условия ревью» (zoom/DPR/окно + не тестировать ровно на границе бэнда из-за скроллбара). bad_spec 0, intent_gap 0. reject 7 (low). Оба ревьюера подтвердили корректность ядра (брейкпоинт-математика + постраничная привязка дефектов); Edge Case Hunter вернул пусто.

### Верификация (проведена лично)
- `npm run lint` — PASS (чисто).
- `npm run build` — PASS (Compiled successfully; 6 роутов `/`,`/about`,`/catalog`,`/brands`,`/shops`,`/contact` пререндерятся).
- Ground-truth grep против прототипа: About = 0 `cert`/`lightbox`/`map`; Our Brands mobile = lightbox есть; Contact = 0 «Conroe»; Our Shops = «Conroe» есть. Desktop-бэнды сверены с `@media`-границами (3/3/4/2/2/2 пункта). `preview`-скрипт валиден.

### Follow-up review: false
Финальный проход — 3 локализованных low-severity правки в markdown-документе (без влияния на рантайм/поведение/данные); ядро независимо подтверждено обоими ревьюерами (Edge Case Hunter пусто). Независимое повторное ревью не оправдано.

### Остаточные риски
- Ручная пиксель-сверка человеком (авто visual-diff — Deferred); воспроизводимость зависит от соблюдения блока «Условия ревью».
- Страницы Epic 3–6 ещё не построены — чеклисты активируются вместе с их реализацией; корректность привязки дефектов проверена по прототипу, но фактическая пиксель-сверка возможна только когда страница отрендерена.
- Catalog hover-gated `981` (`(hover:hover)`) + reduced-motion — отложено в `deferred-work.md` (принадлежит истории реализации Catalog, Epic 5).
