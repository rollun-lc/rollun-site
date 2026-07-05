---
title: 'Story 3.1: Каркас Home — композиция и статический контент'
type: 'feature'
created: '2026-07-05'
status: 'done'
baseline_revision: '93b6a6e50a406fa2bff9a6f2abcf0b27858a2326'
final_revision: '8cd32394076ff269485ccf1e1ee4424349703fbd'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/rollun_handoff/rollun-web-site/project/Home.html'
  - '{project-root}/rollun_handoff/rollun-web-site/project/Home Mobile.html'
  - '{project-root}/docs/pixel-acceptance/checklist-home.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-3-context.md'
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** Главная (`/`) — заглушка из Story 1.1 (`<main>Rollun — Home (scaffold)</main>`). Нужна полностью собранная статичная главная: все 7 секций Handoff в правильном порядке, пиксель-в-пиксель desktop+mobile, с готовой точкой входа в форму из Epic 2.

**Approach:** Ввести типизированный контент-объект `HomeContent` (`content/home.ts`) со всем статическим текстом, портированным дословно из прототипа, и переписать `page.tsx` как чистую функцию этого объекта (AD-7). Секции — RSC-компоненты в `components/home/*`, каждый рендерит ОБЕ композиции (desktop+mobile) в один DOM, переключение только CSS-медиа на 768px (AD-3). Анимации (bloom/переключатель/count-up) НЕ реализуются здесь — рендерится статичный финальный кадр; островки добавят Stories 3.2–3.4 поверх готовой разметки. Кнопка `GET IN TOUCH` монтирует готовый `<GetInTouch/>` из Epic 2.

## Boundaries & Constraints

**Always:**
- Прототип — единственный источник истины пикселя и текста: desktop = `Home.html`, mobile = `Home Mobile.html`. Весь текст (заголовки, микрокопи, значения счётчиков, пункты benefits, названия/описания маркетплейсов, часы) портируется ДОСЛОВНО, включая различия desktop↔mobile.
- Секции строго в порядке Handoff: Hero → Product lines (Automotive/Health) → Stats «Proven at scale» → Key benefits → «Find us on marketplaces» → CTA «Let's talk business». (Footer уже монтируется в `layout.tsx` из Epic 1 — здесь не дублировать.)
- `HomeContent` — плоские сериализуемые данные (строки/числа/массивы/объекты, без функций и JSX), typecheck-совместимые с будущим Payload Global `HomeContent` (AD-7, шов к Epic 7). Страница получает контент только пропсами; никакого клиентского фетча.
- Обе композиции SSR-рендерятся в DOM; выбор видимой — только CSS `@media` на 768px, паттерн `Header.client.tsx`/`Footer.tsx`. JS-гейтинг ширины и UA-сниффинг запрещены.
- Тяжёлые hero-ассеты (15–18 МБ) НЕ грузятся в обе композиции сразу: art-direction подаёт ровно один набор картинок hero на вьюпорт (скрытая композиция не инициирует загрузку своих hero-фото).
- Секции кроме hero получают класс `.reveal` (island `RevealOnScroll` уже смонтирован в layout — новый island не создавать).
- Переиспользовать существующие глобальные стили/токены: `.btn/.btn-or/.btn-ghost` (components.css), `.reveal`/`.in`, `.container`, токены `theme.css`. Оранжевый focus-ring и семантический HTML сохраняются.
- Воспроизводимые дефекты (AD-13) оставить как есть: mobile-секция «marketplaces» БЕЗ рейтингов маркетплейсов; расхождение часов desktop (`11:00 to 21:00 UTC`) ↔ mobile (`09:00 to 21:00 UTC+2`).

**Block If:**
- Пиксель-в-пиксель требует решения, не выводимого из прототипа (реальная неоднозначность разметки/стиля) — HALT `blocked`, условие описывает неоднозначность.
- Требуемый прототипом ассет отсутствует и в `hero/`, и в корне проекта прототипа, и в `shop/` — HALT `blocked`.

**Never:**
- Не реализовывать анимации/интерактив: цикл/bloom hero-мозаики (Story 3.2), ручной переключатель продуктовых линий (3.3), count-up счётчиков (3.4). Рендерить статичный финальный кадр (мозаика — статично подсвеченный набор; счётчики — финальные значения; линии — первый слайд).
- Не переписывать Header/Footer/ContactForm/GetInTouch — только монтировать/переиспользовать.
- Не «чинить» известные дефекты AD-13; не менять пиксель ради a11y при конфликте (приоритет у дизайна).
- Не вводить Payload-запросы/глобалы в этой стори (Epic 7).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Загрузка `/` desktop (≥768px) | статический `homeContent` | Все 6 секций тела в порядке Handoff, desktop-композиция видима, пиксель совпадает с `Home.html` | — |
| Загрузка `/` mobile (<768px) | тот же `homeContent` | Видима mobile-композиция, пиксель совпадает с `Home Mobile.html`; секция marketplaces без рейтингов (AD-13) | — |
| GET IN TOUCH desktop | клик по кнопке в CTA-секции | Открывается модалка ContactForm (Epic 2) | — |
| GET IN TOUCH mobile | тап по триггеру | Навигация на `/contact` (модалки на mobile нет) | — |
| Hero-фото не загрузилось | битый `src` изображения | Плитка не ломает вёрстку (скрытие через `onerror`, паттерн Epic 1) | graceful |
| `prefers-reduced-motion` | reduced-motion вкл. | Статичный рендер и так без движения — визуал не меняется | — |
| Загрузка hero-ассетов | любой вьюпорт | В сети грузится РОВНО один набор hero-фото (текущего вьюпорта), не оба | — |

</intent-contract>

## Code Map

- `src/app/(site)/page.tsx` -- ПЕРЕПИСАТЬ: чистая функция `homeContent`, композит секций в порядке Handoff; импорт `home.css`.
- `src/content/home.ts` -- НОВЫЙ: тип `HomeContent` + инстанс `homeContent` (весь статический текст, дословно из прототипа; варианты desktop/mobile там, где текст различается).
- `src/components/home/Hero.tsx` -- НОВЫЙ RSC: hero (tag, headline с `.or-txt`, subheading, CTA-якоря), статичная мозаика, art-directed фото.
- `src/components/home/ProductLines.tsx` -- НОВЫЙ RSC: eyebrow/title/intro + два блока (Automotive/Health), первый слайд статично, кнопки EXPLORE.
- `src/components/home/Stats.tsx` -- НОВЫЙ RSC: «Proven at scale», 4 ячейки с ФИНАЛЬНЫМИ значениями (без count-up), фон stats-team-2.
- `src/components/home/Benefits.tsx` -- НОВЫЙ RSC: «Key benefits», 4 карточки (desktop/mobile-варианты текста), SVG-иконки из прототипа.
- `src/components/home/Marketplaces.tsx` -- НОВЫЙ RSC: «Find us on marketplaces», 3 карточки; рейтинги ТОЛЬКО в desktop-композиции (AD-13).
- `src/components/home/CtaSection.tsx` -- НОВЫЙ RSC: «Let's talk business» (часы desktop/mobile), соц-иконки, монтирует `<GetInTouch/>`; `id="cta"`.
- `src/styles/home.css` -- НОВЫЙ: стили всех home-секций (desktop+mobile), портированы из встроенного CSS `Home.html` и `Home Mobile.html`/`mobile.css`; медиа-переключение на 768px.
- `public/` -- скопировать требуемые home-ассеты (см. задачу assets).
- `src/components/contact-form/GetInTouch.client.tsx` -- ПЕРЕИСПОЛЬЗОВАТЬ (не менять): дефолтный label `GET IN TOUCH`, desktop-модалка / mobile-`/contact`.
- `src/content/contact-form.ts` -- эталон паттерна content-модуля (тип + инстанс, AD-14).
- `docs/pixel-acceptance/checklist-home.md` -- чеклист приёмки (заполняется в review-проходе).

## Tasks & Acceptance

**Execution:**
- [x] `src/content/home.ts` -- определить тип `HomeContent` и экспортировать инстанс `homeContent`; весь статический текст портировать ДОСЛОВНО из `Home.html`/`Home Mobile.html`, включая desktop/mobile-различия и намеренные дефекты AD-13 -- единый типизированный источник контента (AD-7/AD-14).
- [x] `public/` (assets) -- скопировать в `public/` (с сохранением относительных путей ссылок) требуемые Home-ассеты: `hero/*` (нужные тайлы desktop+mobile), категорийные `cat-*.png`, `health-*.png`, `team-tile-1.png`, фон `stats-team-2.png`, лого маркетплейсов из `shop/*`; ссылаться на них root-абсолютными URL -- изображения секций доступны рантайму.
- [x] `src/styles/home.css` -- портировать стили всех home-секций для обеих композиций; переключение только `@media` на 768px; переиспользовать существующие токены/классы, не дублировать `.btn`/`.reveal`/`.container` -- пиксель-в-пиксель раскладка.
- [x] `src/components/home/Hero.tsx` -- RSC hero: обе композиции, статичная мозаика (финальный кадр), art-direction hero-фото так, чтобы грузился один набор на вьюпорт; CTA `CONTACT US`/`EXPLORE CATALOG` как якорь `#cta`/ссылка `/catalog` -- первая секция без `.reveal`.
- [x] `src/components/home/ProductLines.tsx` -- RSC: обе композиции, первый слайд статично, кнопки `EXPLORE AUTOMOTIVE`/`EXPLORE HEALTH` → `/catalog#automotive`/`/catalog#health`; `.reveal`.
- [x] `src/components/home/Stats.tsx` -- RSC: 4 ячейки с ФИНАЛЬНЫМИ значениями/суффиксами (форматирование как в прототипе, без анимации), фон-картинка; `.reveal`.
- [x] `src/components/home/Benefits.tsx` -- RSC: 4 карточки с SVG-иконками из прототипа, desktop/mobile-варианты заголовков/текста; `.reveal`.
- [x] `src/components/home/Marketplaces.tsx` -- RSC: 3 карточки; рейтинги/мета рендерятся только в desktop-композиции, mobile — без них (AD-13); `.reveal`.
- [x] `src/components/home/CtaSection.tsx` -- RSC c `id="cta"`: заголовок/тело (часы desktop/mobile), соц-иконки, монтирует `<GetInTouch/>`; `.reveal`.
- [x] `src/app/(site)/page.tsx` -- переписать: `import '@/styles/home.css'`, отрендерить секции из `homeContent` в порядке Handoff внутри `<main>` -- страница = чистая функция контента.

**Acceptance Criteria:**
- Given маршрут `/`, when страница загружена на desktop и на mobile, then отрендерены все секции Handoff в правильном порядке и визуал совпадает с соответствующим прототипом (desktop `Home.html` / mobile `Home Mobile.html`).
- Given реализацию, when проверяется тип, then страница типизирована как чистая функция `HomeContent`, а `homeContent` — статический инстанс из `content/*`, форма которого совместима с будущим Payload Global (плоские сериализуемые данные).
- Given любой вьюпорт, when открыта сеть браузера, then обе композиции присутствуют в DOM, но грузится ровно один набор hero-фото (текущего вьюпорта), переключение видимого дерева — только CSS-медиа 768px.
- Given desktop, when клик по `GET IN TOUCH`, then открывается модалка формы Epic 2; given mobile, when тап по триггеру, then навигация на `/contact`.
- Given mobile-секцию marketplaces, when она отрендерена, then рейтинги маркетплейсов отсутствуют (воспроизведён дефект AD-13), а desktop-карточки рейтинги показывают.

## Design Notes

**Форма `HomeContent` (скелет; поля-строки заполнить дословно из прототипа).** Различия desktop↔mobile выражать явными полями, а не рантайм-логикой:

```ts
export type HomeStat = { value: number; label: string; suffix?: string }
export type HomeContent = {
  hero: { tag: { dk: string; mb: string }; headline: /* сегменты с флагом accent для .or-txt */; subheading: string; ctaPrimary: string; ctaSecondary: string }
  productLines: { eyebrow; title; intro; automotive: { heading: {dk;mb}; slides: string[]; cta }; health: {…} }
  stats: { title: string; items: HomeStat[] }              // 2015 FOUNDED, 12 SUPPLIERS, 80000 CUSTOMERS, 30% PROCESS AUTOMATION
  benefits: { heading: {dk;mb}; text: {dk;mb} }[]          // 4 карточки; иконки — в JSX компонента, не в контенте
  marketplaces: { eyebrow; title; cards: { name; ratingDesktop; descDesktop; descMobile; cta }[] }
  cta: { heading: string; body: { dk: string; mb: string }; button: string } // часы отличаются
}
```

- **Композиция AD-3 (эталон — Footer/Header):** каждый секционный компонент выводит desktop-поддерево и mobile-поддерево; видимость решает `@media`. Тяжёлые ассеты одной композиции не должны скачиваться в другой — для hero использовать art-direction (`<picture>`/`<source media>` или media-гейтед `background-image`), чтобы браузер тянул только набор текущего вьюпорта.
- **Статичный финальный кадр:** мозаика — статично «зажжённый» набор без 3-сек цикла; счётчики — сразу финальные значения (формат `80,000`, `30%`, `2015` как в прототипе); линии — первый слайд активен, без переключения. Разметку строить так, чтобы Stories 3.2–3.4 добавили `'use client'`-островки поверх без переписывания DOM.
- **Reveal:** секции (кроме hero) получают `.reveal`; поведение уже даёт `RevealOnScroll` из layout — здесь только класс.
- **Иконки/лого маркетплейсов и SVG benefits** переносить как в прототипе (inline SVG или `<img>` из `public/shop/*`).
- **Контент-модуль** повторяет паттерн `contact-form.ts`: типы + один инстанс, single home (AD-14), никакого хардкода строк в JSX секций (микрокопи-CTA капсом допустимо держать в контенте).

## Verification

**Commands:**
- `npm run lint` -- expected: без ошибок.
- `npm run build` -- expected: typecheck (strict) + сборка проходят; `HomeContent`/`homeContent` типобезопасны, страница компилируется как чистая функция контента.

**Manual checks:**
- `npm run preview` → http://localhost:3000/ : сверить визуал против `Home.html` (1280 / 1024 / 800px) и `Home Mobile.html` (~390px и ~760px, 440px-шелл) по `docs/pixel-acceptance/checklist-home.md`. Ожидаемые дефекты (AD-13) — не расхождение.
- В DevTools Network подтвердить: грузится ровно один набор hero-фото на вьюпорт (обе композиции в DOM, но не оба набора картинок).
- `GET IN TOUCH`: desktop открывает модалку, mobile ведёт на `/contact`.

## Spec Change Log

_(no bad_spec loopbacks — empty)_

## Review Triage Log

### 2026-07-05 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2: (high 1, medium 0, low 1)
- defer: 0
- reject: 6
- addressed_findings:
  - `[high]` `[patch]` `<GetInTouch/>` was mounted in BOTH composition subtrees, putting two `ContactModal`s + a duplicate `id="contactForm"` and duplicate field ids permanently in the DOM (invalid HTML, ambiguous `label htmlFor`/`aria-describedby`). Fixed: desktop keeps `<GetInTouch/>`; mobile now uses a plain `<Link href="/contact">` (identical mobile behaviour, same pattern as the Hero mobile CTA), so exactly one modal/form-id set exists. Removed the now-dead `.gitouch-mb` CSS rule.
  - `[low]` `[patch]` Desktop hero mosaic tiles authored descriptive `alt` text that was never rendered (tiles are media-gated `background-image` divs, not `<img>`). Fixed: `MosaicTile` now exposes non-empty alt via `role="img"` + `aria-label`; empty-alt mobile tiles stay decorative.
- rejected (not defects): product-line `<img>` in the hidden composition may fetch ~2 small extra images (negligible; `loading=lazy` mitigates); inert product-line dot `<button>`s (intentional scaffold — Story 3.3 wires them); `rel="noopener"` without `noreferrer` (noopener already closes tabnabbing; ported verbatim); category/logo `<img>` lack `onError` (committed assets; the spec's onerror requirement is hero-scoped and met via the tiles' background-color fallback); desktop intermediate-breakpoint "cramped band" (verified faithful to `Home.html` at all tested bands — the dropped `max-width:820px` block is contact-form-only, `max-width:720px` is below the 768px composition switch); `SLIDE_POSITIONS[i]`/icon-array index OOB (speculative; content is a fixed 4-item static instance).

## Auto Run Result

Status: done

### Summary
Home page (`/`) собрана как чистая функция типизированного `HomeContent`: заглушка Story 1.1 заменена композитом из 6 секций в порядке Handoff (Hero → Product lines → Stats → Benefits → Marketplaces → CTA; Footer — из layout). Обе композиции (desktop `.home-dk` / mobile `.home-mb`) SSR-рендерятся в один DOM, видимая выбирается только CSS-медиа на 768px (AD-3). Весь статический текст портирован дословно из прототипов в один инстанс `homeContent` (AD-7/AD-14). Анимации не реализованы — статичный финальный кадр с хуками (`.lit`, `data-i`, `data-final`) для Stories 3.2–3.4. Кнопка `GET IN TOUCH` из Epic 2 смонтирована в CTA. Воспроизведены дефекты AD-13 (mobile marketplaces без рейтингов; расхождение часов).

### Files changed
- `src/app/(site)/page.tsx` — переписан: чистая функция `homeContent`, композит 6 секций, импорт `home.css`.
- `src/content/home.ts` (new) — тип `HomeContent` + инстанс `homeContent` (весь статический текст).
- `src/components/home/Hero.tsx` (new) — hero, art-directed мозаика (background-image, один набор фото на вьюпорт).
- `src/components/home/ProductLines.tsx` (new) — линии Automotive/Health, статичный первый слайд.
- `src/components/home/Stats.tsx` (new) — «Proven at scale», финальные значения счётчиков.
- `src/components/home/Benefits.tsx` (new) — 4 карточки key benefits + inline SVG.
- `src/components/home/Marketplaces.tsx` (new) — 3 карточки; рейтинги только на desktop (AD-13).
- `src/components/home/CtaSection.tsx` (new) — «Let's talk business», монтирует `<GetInTouch/>` (desktop) / `<Link>` /contact (mobile).
- `src/styles/home.css` (new) — стили обеих композиций, переключение медиа 768px.
- `public/**` — home-ассеты (hero/, cat-*/health-*, stats-team-2, shop/ebay-logo, team-tile-1).

### Review findings
- Patches applied (2): [high] устранён двойной монтаж `<GetInTouch/>` (дубли `id="contactForm"`/полей и два `role=dialog` в DOM) — mobile теперь plain `<Link>` на `/contact`, один модал; [low] alt hero-мозаики теперь доступен через `role="img"`/`aria-label`.
- Deferred: 0.
- Rejected (6): non-defects — см. Review Triage Log (мелкая пере-загрузка img скрытой композиции, инертные точки-переключатели для 3.3, noopener без noreferrer, отсутствие onError у committed-ассетов, «cramped» брейкпоинт (проверено — верно прототипу), спекулятивный OOB по индексу).

### Verification
- `npm run lint` → PASS (без ошибок).
- `npm run build` → PASS (strict typecheck + сборка; `/` = ○ Static prerender).
- Пиксель-приёмка в браузере по `docs/pixel-acceptance/checklist-home.md` (1280/1024/800/~390/~760px) + DevTools Network (один набор hero-фото) — оставлено на ручной review-проход, как предписывает SM-1.

### Residual risks
- Формальная пиксель-приёмка ещё не отмечена в чеклисте (ручной шаг). Финальные `.lit`/`.line-slide.active` кадры выбраны детерминированно из прототипа, но точное совпадение подсветки мозаики подтверждается только визуально.
