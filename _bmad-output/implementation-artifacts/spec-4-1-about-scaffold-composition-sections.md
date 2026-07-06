---
title: 'Story 4.1: Каркас About Us — композиция и секции'
type: 'feature'
created: '2026-07-06'
status: 'done'
baseline_revision: '3224f4e95f3d84e1bcad82646987141a788b95fb'
final_revision: 'db839b5bca1117727baeaf1a6fd743b0a70292a2'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/rollun_handoff/rollun-web-site/project/About Us.html'
  - '{project-root}/rollun_handoff/rollun-web-site/project/About Us Mobile.html'
  - '{project-root}/docs/pixel-acceptance/checklist-about.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-4-context.md'
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** Страница `/about` — заглушка из Story 1.1 (`<main>Rollun — About (scaffold)</main>`). Нужна полностью собранная страница About Us: все 8 секций Handoff в правильном порядке, пиксель-в-пиксель desktop+mobile, со статичным контентом и готовыми точками монтажа для островков следующих стори.

**Approach:** Ввести типизированный контент-объект `AboutContent` (`content/about.ts`) со всем статическим текстом, портированным дословно из прототипа, и переписать `about/page.tsx` как чистую функцию этого объекта (AD-7). Секции — RSC-компоненты в `components/about/*`, каждый рендерит ОБЕ композиции (desktop+mobile) в один DOM, переключение только CSS-медиа на 768px (AD-3). Интерактив/анимация НЕ реализуются здесь — рендерится статичный финальный кадр с готовой разметкой и mount-точками; островки добавят Stories 4.2 (D3-карта desktop), 4.3 (mobile-список локаций) и 4.4 (Automation-анимации) поверх. Кнопка `GET IN TOUCH` монтирует готовый `<GetInTouch/>` из Epic 2.

## Boundaries & Constraints

**Always:**
- Прототип — единственный источник истины пикселя и текста: desktop = `About Us.html`, mobile = `About Us Mobile.html`. Весь текст (заголовки, микрокопи, значения счётчиков, lede/quote, названия/подписи) портируется ДОСЛОВНО, включая различия desktop↔mobile.
- Секции строго в порядке Handoff: Hero (01) → Snapshot (02) → Approach (03) → Automation (04) → KeepToShip (05) → US Presence (06) → Team (07) → CTA (08). Footer уже монтируется в `layout.tsx` из Epic 1 — здесь не дублировать; Header тоже из layout.
- `AboutContent` — плоские сериализуемые данные (строки/числа/массивы/объекты, без функций и JSX), typecheck-совместимые с будущим Payload Global `AboutContent` (AD-7, шов к Фазе 2). Страница получает контент только пропсами; никакого клиентского фетча.
- Обе композиции SSR-рендерятся в DOM; выбор видимой — только CSS `@media` на 768px, паттерн `.home-dk`/`.home-mb` (эталон — Home/Header/Footer). JS-гейтинг ширины и UA-сниффинг запрещены.
- Секции кроме hero получают класс `.reveal` (island `RevealOnScroll` уже смонтирован в layout — новый island не создавать).
- Переиспользовать существующие глобальные стили/токены: `.btn/.btn-or/.btn-ghost` (components.css), `.reveal`/`.in`, `.container`, `.or-txt`, токены `theme.css`. Оранжевый focus-ring и семантический HTML сохраняются.
- Шрифт Caveat (рукописный акцент, About only) применяется через уже сконфигуренный role-токен `--font-hand` там, где прототип использует cursive (напр. `.love-word` в Team). Кавеат уже подключён в `lib/fonts.ts` / `theme.css` — новых `next/font`-импортов не добавлять.
- `GET IN TOUCH` монтирует ровно ОДИН `<GetInTouch/>` (в desktop-поддереве); mobile-поддерево использует plain `<Link href="/contact">`. Монтаж `<GetInTouch/>` в ОБА поддерева запрещён — это даёт дубли `id="contactForm"`/полей и два `role="dialog"` в DOM (усвоенный дефект Story 3.1).
- Воспроизводимый дефект (AD-13) оставить как есть: в Team элемент `.team-tile.tr` сохраняет литеральный цвет `#ea7b07` — НЕ нормализовать в токен `--or`.
- KeepToShip: внешний CTA «LEARN MORE» → `https://keeptoship.com/`, `target="_blank" rel="noopener"`.

**Block If:**
- Пиксель-в-пиксель требует решения, не выводимого из прототипа (реальная неоднозначность разметки/стиля) — HALT `blocked`, условие описывает неоднозначность.
- Требуемый прототипом ассет отсутствует и в каталоге прототипа `rollun_handoff/rollun-web-site/project/`, и в его подпапках — HALT `blocked`.

**Never:**
- Не реализовывать интерактив/анимации следующих стори: D3-карта US Presence desktop (4.2), статический mobile-список локаций/чипы городов (4.3), count-up счётчиков + coin-tower + workforce-фигуры Automation (4.4). Здесь — статичный финальный кадр: счётчики показывают ФИНАЛЬНЫЕ значения; контейнеры `#coinTower`/`#peopleRow` и mount-точка карты `#map` присутствуют как пустой scaffold; live-count карты — финальное `30`.
- Не реализовывать contact-форму на странице: прототипную инлайн-разметку модалки/формы (`#contactOverlay`/`#contactForm`) НЕ портировать — её роль закрывает `<GetInTouch/>` из Epic 2. На mobile контакт-модалки нет вовсе (триггер → `/contact`, AD-13).
- Не переписывать Header/Footer/ContactForm/GetInTouch/RevealOnScroll — только монтировать/переиспользовать.
- Не «чинить» известный дефект AD-13 (`#ea7b07`); не менять пиксель ради a11y при конфликте (приоритет у дизайна).
- Не вводить Payload-запросы/глобалы в этой стори (Фаза 2).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Загрузка `/about` desktop (≥768px) | статический `aboutContent` | Все 8 секций в порядке Handoff, desktop-композиция видима, пиксель совпадает с `About Us.html` | — |
| Загрузка `/about` mobile (<768px) | тот же `aboutContent` | Видима mobile-композиция, пиксель совпадает с `About Us Mobile.html`; карты и контакт-модалки в mobile-DOM нет (AD-13) | — |
| GET IN TOUCH desktop | клик по кнопке в CTA-секции | Открывается модалка ContactForm (Epic 2) | — |
| GET IN TOUCH mobile | тап по триггеру | Навигация на `/contact` (модалки на mobile нет) | — |
| Automation в вьюпорте | статичный рендер | Счётчики показаны ФИНАЛЬНЫМИ (`50,000+`, `80%`, `30%`); `#coinTower`/`#peopleRow` — пустой scaffold без анимации | — |
| US Presence desktop | статичный рендер | Секция-шелл: head (title+intro), `.map-wrap` с mount-точкой `#map`, live-count=`30`, `.map-hint`; D3-остров не смонтирован (4.2) | — |
| Team фото не загрузилось | битый `src` плитки | Плитка не ломает вёрстку (фолбэк-фон плитки); `.team-tile.tr` и так без img (сплошной `#ea7b07`) | graceful |
| `prefers-reduced-motion` | reduced-motion вкл. | Статичный рендер и так без движения — визуал не меняется | — |

</intent-contract>

## Code Map

- `src/app/(site)/about/page.tsx` -- ПЕРЕПИСАТЬ: чистая функция `aboutContent`, композит 8 секций в порядке Handoff; `import '@/styles/about.css'`.
- `src/content/about.ts` -- НОВЫЙ: тип `AboutContent` + инстанс `aboutContent` (весь статический текст дословно из прототипа; варианты desktop/mobile там, где текст различается).
- `src/components/about/Hero.tsx` -- НОВЫЙ RSC: hero (01) — tag, headline с `.or-txt`, subheading, CTA; без `.reveal`.
- `src/components/about/Snapshot.tsx` -- НОВЫЙ RSC: секция 02 (`id="focus"`) — section-title + контент snapshot; `.reveal`.
- `src/components/about/Approach.tsx` -- НОВЫЙ RSC: секция 03 — section-title + контент approach; `.reveal`.
- `src/components/about/Automation.tsx` -- НОВЫЙ RSC: секция 04 — heading (accent `reliability`), lede, 3 stat-блока с ФИНАЛЬНЫМИ значениями; пустые scaffold-контейнеры `#coinTower`/`#peopleRow` для Story 4.4; `.reveal`.
- `src/components/about/KeepToShip.tsx` -- НОВЫЙ RSC: секция 05 — tag, heading (accent `KeepToShip`), абзацы, cta-block с внешним `LEARN MORE`→keeptoship.com, визуал; `.reveal`.
- `src/components/about/UsPresence.tsx` -- НОВЫЙ RSC: секция 06 (`id`/классы как в прототипе) — desktop map-head + `.map-wrap` шелл с mount-точкой `#map`, live-count `30`, `.map-hint`; mobile — контейнер секции + heading (список локаций наполняет Story 4.3); `.reveal`.
- `src/components/about/Team.tsx` -- НОВЫЙ RSC: секция 07 — 4 плитки (`.tr` = литерал `#ea7b07`, без img, AD-13), team-text с рукописным `.love-word` (Caveat/`--font-hand`), quote, подпись CEO; `.reveal`.
- `src/components/about/CtaSection.tsx` -- НОВЫЙ RSC c `id="cta"`: секция 08 — heading/sub/hours, соц-иконки (GitHub/LinkedIn), монтирует `<GetInTouch/>` (desktop) / `<Link href="/contact">` (mobile); `.reveal`.
- `src/styles/about.css` -- НОВЫЙ: стили всех about-секций (desktop+mobile), портированы из встроенного CSS `About Us.html` и `About Us Mobile.html`; медиа-переключение на 768px; не дублировать `.btn`/`.reveal`/`.container`.
- `public/` -- скопировать требуемые About-ассеты (team-фото, ceo, KeepToShip-визуал, hero/snapshot/approach — см. задачу assets).
- `src/components/contact-form/GetInTouch.client.tsx` -- ПЕРЕИСПОЛЬЗОВАТЬ (не менять): дефолтный label `GET IN TOUCH`, desktop-модалка / mobile-`/contact`.
- `src/components/home/CtaSection.tsx` -- эталон паттерна монтажа `<GetInTouch/>` + соц-иконок (не менять).
- `src/content/home.ts` -- эталон паттерна content-модуля (тип + инстанс, AD-14).
- `docs/pixel-acceptance/checklist-about.md` -- чеклист приёмки (отмечается в review-проходе).

## Tasks & Acceptance

**Execution:**
- [x] `src/content/about.ts` -- определить тип `AboutContent` и экспортировать инстанс `aboutContent`; весь статический текст 8 секций портировать ДОСЛОВНО из `About Us.html`/`About Us Mobile.html`, включая desktop/mobile-различия и намеренный дефект AD-13 -- единый типизированный источник контента (AD-7/AD-14).
- [x] `public/` (assets) -- скопировать в `public/` (с сохранением относительных путей ссылок) требуемые About-ассеты из `rollun_handoff/rollun-web-site/project/` (team-*.jpg, ceo-photo.png, KeepToShip-визуал, hero/snapshot/approach-изображения); ссылаться root-абсолютными URL -- изображения секций доступны рантайму.
- [x] `src/styles/about.css` -- портировать стили всех about-секций для обеих композиций; переключение только `@media` на 768px; переиспользовать существующие токены/классы -- пиксель-в-пиксель раскладка.
- [x] `src/components/about/Hero.tsx` -- RSC hero (01): обе композиции, tag/headline с `.or-txt`/subheading/CTA; первая секция без `.reveal`.
- [x] `src/components/about/Snapshot.tsx` -- RSC (02, `id="focus"`): обе композиции, section-title + контент; `.reveal`.
- [x] `src/components/about/Approach.tsx` -- RSC (03): обе композиции, section-title + контент; `.reveal`.
- [x] `src/components/about/Automation.tsx` -- RSC (04): обе композиции; 3 stat-блока с ФИНАЛЬНЫМИ значениями/юнитами (форматирование как в прототипе, без анимации); пустые `#coinTower`/`#peopleRow` для 4.4; `.reveal`.
- [x] `src/components/about/KeepToShip.tsx` -- RSC (05): обе композиции; tag/heading(accent)/абзацы, cta-block с внешним `LEARN MORE`→`https://keeptoship.com/` (`target=_blank rel=noopener`), визуал; `.reveal`.
- [x] `src/components/about/UsPresence.tsx` -- RSC (06): desktop — map-head + `.map-wrap` шелл (`#map` mount, live-count `30` статично, `.map-hint`); mobile — контейнер секции + heading (наполнение списком — Story 4.3); никаких D3-импортов; `.reveal`.
- [x] `src/components/about/Team.tsx` -- RSC (07): обе композиции; 4 плитки (`.tr` — литерал `#ea7b07` без img, AD-13), heading с рукописным `.love-word` (Caveat), quote, подпись CEO; `.reveal`.
- [x] `src/components/about/CtaSection.tsx` -- RSC c `id="cta"` (08): heading/sub/hours, соц-иконки, монтирует ОДИН `<GetInTouch/>` в desktop-поддереве и `<Link href="/contact">` в mobile-поддереве; `.reveal`.
- [x] `src/app/(site)/about/page.tsx` -- переписать: `import '@/styles/about.css'`, отрендерить 8 секций из `aboutContent` в порядке Handoff внутри `<main>` -- страница = чистая функция контента.

**Acceptance Criteria:**
- Given маршрут `/about`, when страница загружена на desktop и на mobile, then отрендерены все 8 секций Handoff в правильном порядке и визуал совпадает с соответствующим прототипом (desktop `About Us.html` / mobile `About Us Mobile.html`).
- Given реализацию, when проверяется тип, then страница типизирована как чистая функция `AboutContent`, а `aboutContent` — статический инстанс из `content/*`, форма которого совместима с будущим Payload Global (плоские сериализуемые данные).
- Given любой вьюпорт, when открыт DOM, then обе композиции присутствуют, переключение видимого дерева — только CSS-медиа 768px; в mobile-композиции нет D3-карты и контакт-модалки (AD-13).
- Given desktop, when клик по `GET IN TOUCH`, then открывается модалка формы Epic 2; given mobile, when тап по триггеру, then навигация на `/contact`.
- Given секцию Team, when она отрендерена, then `.team-tile.tr` использует литеральный `#ea7b07` (дефект AD-13 воспроизведён, не нормализован в `--or`).
- Given секции Automation и US Presence, when они отрендерены в 4.1, then показан статичный финальный кадр с mount-точками (`#coinTower`/`#peopleRow` пустые; `#map` пуст, live-count=`30`), без D3-острова и анимаций (они — Stories 4.2/4.4).

## Design Notes

**Форма `AboutContent` (скелет; поля-строки заполнить дословно из прототипа).** Различия desktop↔mobile выражать явными полями, а не рантайм-логикой:

```ts
export type AboutStat = { value: number; unit?: string; label: string } // финальные значения
export type AboutContent = {
  hero: { tag: string; headline: /* сегменты с флагом accent для .or-txt */; subheading: string; cta?: string }
  snapshot: { title: string; /* тело секции 02 */ }
  approach: { title: string; /* тело секции 03 */ }
  automation: { heading: /* accent 'reliability' */; lede: string; stats: AboutStat[] } // 50000+, 80%, 30%
  keeptoship: { tag: string; heading: /* accent 'KeepToShip' */; paragraphs: string[]; ctaText: string; ctaLabel: string; ctaHref: string }
  usPresence: { title: string; intro: string; liveCount: number; mapHint: string } // локации/чипы — Story 4.3
  team: { tiles: {...}; heading: /* с love-word */; quote: string; ceoName: string; ceoRole: string }
  cta: { heading: string; sub: string; hours: string } // GetInTouch — компонент, не контент
}
```

- **Композиция AD-3 (эталон — Home/Footer/Header):** каждый секционный компонент выводит desktop-поддерево (`.about-dk` или аналог из прототипа) и mobile-поддерево (`.about-mb`); видимость решает `@media` на 768px. Точные имена оболочек — как в прототипе.
- **Статичный финальный кадр:** счётчики сразу финальные (формат `50,000` и т.д.); `#coinTower`/`#peopleRow`/`#map` присутствуют как пустой scaffold, чтобы Stories 4.2/4.4 добавили `'use client'`-островки поверх без переписывания DOM. live-count карты = `30` статично.
- **GetInTouch:** компонент сам рендерит обе триггер-композиции; монтируется ОДИН раз в desktop-поддереве секции CTA, mobile-поддерево — отдельный `<Link href="/contact">`. Точный паттерн — `src/components/home/CtaSection.tsx`.
- **Контент-модуль** повторяет паттерн `content/home.ts`: типы + один инстанс (AD-14), никакого хардкода строк в JSX секций (капс-микрокопи CTA допустимо держать в контенте).

## Verification

**Commands:**
- `npm run lint` -- expected: без ошибок.
- `npm run build` -- expected: strict typecheck + сборка проходят; `AboutContent`/`aboutContent` типобезопасны, `/about` компилируется как чистая функция контента (○ Static prerender).

**Manual checks:**
- `npm run preview` → http://localhost:3000/about : сверить визуал против `About Us.html` (1280/860/800px) и `About Us Mobile.html` (~390px и ~760px, 440px-шелл) по `docs/pixel-acceptance/checklist-about.md`. Отсутствие карты/модалки на mobile (AD-13) — не расхождение.
- `GET IN TOUCH`: desktop открывает модалку, mobile ведёт на `/contact`.
- В DOM подтвердить: `.team-tile.tr` = `#ea7b07`; `#coinTower`/`#peopleRow`/`#map` присутствуют пустыми; обе композиции в DOM, видима одна.

## Spec Change Log

_(no bad_spec loopbacks — empty)_

## Review Triage Log

### 2026-07-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2: (high 0, medium 1, low 1)
- defer: 0
- reject: 13
- addressed_findings:
  - `[medium]` `[patch]` Mobile-якорь hero «Explore our work» (`href="#focus"`, портирован дословно из mobile-прототипа) вёл в никуда: `id="focus"` был только на desktop-поддереве Snapshot (`display:none` на mobile → нет layout-box → скролл не срабатывает). Fixed: `id="focus"` перенесён на wrapper `<div>`, охватывающий ОБА поддерева Snapshot, — якорь резолвится на всех вьюпортах, без дублей id. (Home решает аналог через реальный роут; здесь целевой скролл внутристраничный, поэтому wrapper.)
  - `[low]` `[patch]` Мёртвое CSS-правило: `.about-dk .map-hint b` не матчило ничего — `Rich` рендерит выделение как `<strong>`, а не `<b>`. Fixed: селектор → `.about-dk .map-hint strong`, чтобы портированный из прототипа bold в map-hint получал цвет/вес.
- rejected (not defects): совпадают с прецедентами Story 3.1 или дословный порт прототипа — `rel="noopener"` без `noreferrer` (noopener уже закрывает tabnabbing; порт дословно, отклонено и в 3.1); индексный доступ `stats[0..2]`/`cards[2]`/`ICONS[i]` на ФИКСИРОВАННОМ статик-инстансе (спекулятивный OOB, отклонено и в 3.1); отсутствие `onError` у Team-фото/CEO (committed-ассеты, отклонено и в 3.1); `alt="CEO"` и `aria-label="Team photo slot"` — дословно из прототипа; хардкод `GET IN TOUCH` в mobile-CTA — точно повторяет смонтированный паттерн Home `CtaSection`; несоответствие alt desktop↔mobile (пер-композишн разметка прототипа, a11y-нит); inline-`style` цвета (косметика); React-ключи по индексу/контенту (статик-контент); одинаковый label с разным поведением hero-CTA (совпадает с Home); `Rich` роняет комбинацию accent+strong (спекулятивно, текущий контент не комбинирует); `<img src="">` при пустом ceoPhoto (committed-ассет); допущение о наличии роута `/contact` (роут присутствует — подтверждено сборкой).

## Auto Run Result

Status: done

### Summary
Страница About Us (`/about`) собрана как чистая функция типизированного `AboutContent`: заглушка Story 1.1 заменена композитом из 8 секций в порядке Handoff (Hero → Snapshot → Approach → Automation → KeepToShip → US Presence → Team → CTA; Footer/Header — из layout). Обе композиции (`.about-dk` / `.about-mb`) SSR-рендерятся в один DOM, видимая выбирается только CSS-медиа на 768px (AD-3). Весь статический текст портирован дословно из `About Us.html`/`About Us Mobile.html` в один инстанс `aboutContent` (AD-7/AD-14). Интерактив/анимации НЕ реализованы — статичный финальный кадр с mount-точками: `#map` пуст + live-count `30` (D3-остров → 4.2), `#coinTower`/`#peopleRow` пусты + счётчики финальные `50,000+`/`80%`/`30%` (анимации → 4.4), mobile US Presence — heading-шелл (список → 4.3). Кнопка `GET IN TOUCH` из Epic 2 смонтирована ОДИН раз (desktop), mobile — `<Link href="/contact">`. Воспроизведён дефект AD-13 (`.team-tile.tr` = литерал `#ea7b07`).

### Files changed
- `src/app/(site)/about/page.tsx` — переписан: чистая функция `aboutContent`, композит 8 секций, импорт `about.css`.
- `src/content/about.ts` (new) — тип `AboutContent` + инстанс `aboutContent` (весь статический текст 8 секций, desktop/mobile-варианты).
- `src/components/about/Hero.tsx` (new) — hero (01), обе композиции, CTA.
- `src/components/about/Snapshot.tsx` (new) — секция 02, wrapper `#focus`, desktop-трэи + mobile-список.
- `src/components/about/Approach.tsx` (new) — секция 03.
- `src/components/about/Automation.tsx` (new) — секция 04, финальные счётчики + пустые `#coinTower`/`#peopleRow`.
- `src/components/about/KeepToShip.tsx` (new) — секция 05, внешний CTA → keeptoship.com.
- `src/components/about/UsPresence.tsx` (new) — секция 06, desktop map-шелл (`#map`, live-count `30`, `.map-hint`), mobile heading-шелл.
- `src/components/about/Team.tsx` (new) — секция 07, 4 плитки (`.tr` = `#ea7b07`), Caveat `.love-word`, подпись CEO.
- `src/components/about/CtaSection.tsx` (new) — секция 08, монтирует `<GetInTouch/>` (desktop) / `<Link>` /contact (mobile).
- `src/components/about/Rich.tsx` (new) — RSC-рендерер inline-сегментов (accent/hand/strong/lineBreak).
- `src/styles/about.css` (new) — стили обеих композиций, переключение медиа 768px.
- `public/**` — About-ассеты (team-*.jpg, ceo-photo.png и др.).

### Review findings
- Patches applied (2): [medium] mobile-якорь `#focus` теперь резолвится на всех вьюпортах (wrapper-`div`, без дублей id); [low] map-hint bold — CSS-селектор `strong` вместо мёртвого `b`.
- Deferred: 0.
- Rejected (13): non-defects — прецеденты Story 3.1 и дословный порт прототипа (см. Review Triage Log).

### Verification
- `npm run lint` → PASS (без ошибок).
- `npm run build` → PASS (strict typecheck + сборка; `/about` = ○ Static prerender). Пере-прогон после патчей — тоже PASS.
- Пиксель-приёмка в браузере по `docs/pixel-acceptance/checklist-about.md` (1280/860/800/~390/~760px) — оставлено на ручной review-проход, как предписывает SM-1.

### Residual risks
- Формальная пиксель-приёмка ещё не отмечена в чеклисте (ручной шаг). Финальные статичные кадры (счётчики, static live-count, пустые scaffold-контейнеры) выбраны детерминированно из прототипа, но точное пиксельное совпадение подтверждается только визуально.
- US Presence и Automation — намеренно неполные каркасы (островки 4.2/4.3/4.4 наполнят их); на этом этапе desktop-карта и анимации отсутствуют by design.
