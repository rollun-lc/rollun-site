---
title: 'Story 6.1: Our Brands — витрина бренда MOTOTOU'
type: 'feature'
created: '2026-07-06'
status: 'done'
baseline_revision: '16e5b92f1c782933f2c60c97e0c8660fc9b0a56d'
final_revision: 'c77862d80162db3a00d9d7ae121263fc741d59ba'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/rollun_handoff/rollun-web-site/project/Our Brands.html'
  - '{project-root}/rollun_handoff/rollun-web-site/project/Our Brands Mobile.html'
  - '{project-root}/docs/pixel-acceptance/checklist-brands.md'
  - '{project-root}/_bmad-output/implementation-artifacts/epic-6-context.md'
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** Страница `/brands` — заглушка из Story 1.1 (`<main>Rollun — Brands (scaffold)</main>`). Нужна полностью собранная витрина собственного бренда MOTOTOU: все секции Handoff в правильном порядке, пиксель-в-пиксель desktop+mobile, со статичным контентом и рабочим mobile-lightbox сертификата USPTO.

**Approach:** Ввести типизированный контент-объект `BrandsContent` (`content/brands.ts`) со всем статическим текстом, портированным дословно из прототипов, и переписать `brands/page.tsx` как чистую функцию этого объекта (AD-7). Секции — RSC-компоненты в `components/brands/*`, каждый рендерит ОБЕ композиции (desktop+mobile) в один DOM, переключение только CSS-медиа на 768px (AD-3), по эталону `about/*` + `styles/about.css`. Единственный интерактив — mobile-lightbox сертификата — листовой `'use client'`-островок `CertLightbox`, смонтированный только в mobile-поддереве Trademark-секции. Header/Footer/RevealOnScroll — из layout (Epic 1), здесь не дублируются.

## Boundaries & Constraints

**Always:**
- Прототип — единственный источник истины пикселя и текста: desktop = `Our Brands.html`, mobile = `Our Brands Mobile.html`. Весь текст (заголовки, микрокопи, реквизиты ТМ, alt/caption) портируется ДОСЛОВНО, включая различия desktop↔mobile.
- Порядок секций desktop: Hero (01) → Brand card (02) → Story (03) → Products (04) → CTA (05). Порядок mobile: Hero (01) → Brand card (02) → Story (03) → Products (04) → **Trademark (05)** → CTA (06). Footer/Header — из `layout.tsx`, не дублировать.
- **Desktop ≠ mobile по структуре ТМ:** на desktop реквизиты трейдмарка — ТЕКСТОМ внутри brand card (`.bc-trademark`: head + desc + 6 фактов), отдельной Trademark-секции и lightbox в desktop-поддереве НЕТ. На mobile brand card БЕЗ реквизитов ТМ; реквизиты + изображение сертификата + lightbox — в отдельной Trademark-секции.
- **Действия brand card различаются:** desktop — «BECOME A PARTNER» (→ `/contact`, внутр. `<Link>`) и «SHOP MOTOTOU ON AMAZON» (внешн. `https://www.amazon.com/s?srs=76258337011&rh=p_89%3AMototou`, `target=_blank rel=noopener`). Mobile — «Visit mototou.com» (внешн. `https://mototou.com`, `target=_blank rel=noopener`) и «Become a partner» (→ `/contact`).
- `BrandsContent` — плоские сериализуемые данные (строки/числа/массивы/объекты, без функций и JSX), typecheck-совместимые с будущим Payload Global (AD-7/AD-14). Страница получает контент только пропсами; никакого клиентского фетча.
- Обе композиции SSR-рендерятся в DOM; выбор видимой — только CSS `@media` на 768px, паттерн `.brands-dk`/`.brands-mb` (эталон — `.about-dk`/`.about-mb`). JS-гейтинг ширины и UA-сниффинг запрещены.
- Секции кроме hero получают класс `.reveal` (island `RevealOnScroll` уже смонтирован в layout — новый island не создавать).
- Переиспользовать существующие глобальные стили/токены: `.btn`/`.btn-or`/`.btn-ghost` (components.css), `.reveal`/`.in` (shell.css), токены `theme.css` — включая уже глобальные `--color-moto-navy`/`--color-moto-navy-deep` (для `.btn-navy` и moto-logo) и `--color-green` (mobile-галочки `.cat-list`). Новые токены не вводить. `.btn-navy` (вариант цвета) определить локально в `brands.css`.
- CertLightbox: клик по карточке сертификата открывает оверлей; клик по оверлею закрывает; `document.body.style.overflow` scroll-lock на время открытия; Esc НЕ подключать (as-is, UX-DR16). Ровно ОДИН lightbox в DOM (только в mobile-поддереве).
- Внешние ссылки — `target="_blank" rel="noopener"`; `/contact` — внутренний `<Link>`.

**Block If:**
- Пиксель-в-пиксель требует решения, не выводимого из прототипа (реальная неоднозначность разметки/стиля) — HALT `blocked`, условие описывает неоднозначность.
- Требуемый прототипом ассет отсутствует и в `rollun_handoff/rollun-web-site/project/`, и в его подпапках — HALT `blocked`. (Проверено: `mototou-shelf-bg.jpg`, `mototou-product-reflectors.jpg`, `mototou-filters.jpg`, `mototou-trademark.png` присутствуют.)

**Never:**
- Не рендерить Trademark-секцию/lightbox в desktop-поддереве; не дорисовывать desktop-lightbox (в прототипе это мёртвый код — воспроизвести отсутствие элемента в desktop-композиции).
- Не подключать Escape к mobile-lightbox (as-is); не менять пиксель ради a11y при конфликте (приоритет у дизайна).
- Не «нормализовывать» намеренные литералы прототипа: desktop `.bc-status` инлайн-`style="background-color: rgba(239, 127, 26, 0.34)"` оставить как есть.
- Не переписывать Header/Footer/RevealOnScroll — только переиспользовать из layout.
- Не тащить `--color-moto-navy` в глобальную палитру заново (уже в theme.css) и не вводить Payload-запросы/глобалы (Фаза 2).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Загрузка `/brands` desktop (≥768px) | статический `brandsContent` | Секции 01–05 в порядке Handoff, desktop-композиция видима, пиксель совпадает с `Our Brands.html`; реквизиты ТМ — текстом в brand card; Trademark-секции/lightbox не видно | — |
| Загрузка `/brands` mobile (<768px) | тот же `brandsContent` | Видима mobile-композиция (01–06), пиксель совпадает с `Our Brands Mobile.html`; отдельная Trademark-секция с сертификатом | — |
| Клик по карточке сертификата (mobile) | тап по `.tm-cert` | Открывается `.lightbox` (увеличенный сертификат), `body` overflow=hidden | — |
| Клик по оверлею lightbox (mobile) | тап по открытому `.lightbox` | Оверлей закрывается, `body` overflow восстановлен | — |
| Нажатие Escape при открытом lightbox | keydown Escape | Ничего не происходит (Esc не подключён, as-is) | by design |
| Клик «SHOP MOTOTOU ON AMAZON» / «Visit mototou.com» | клик по внешней кнопке | Переход по внешнему URL в новой вкладке (`rel=noopener`) | — |
| `prefers-reduced-motion` | reduced-motion вкл. | Reveal-анимации отключены (глобальный паттерн); контент доступен | — |

</intent-contract>

## Code Map

- `src/app/(site)/brands/page.tsx` -- ПЕРЕПИСАТЬ: чистая функция `brandsContent`, композит секций (desktop 01–05 / mobile 01–06 через компоненты); `import '@/styles/brands.css'`.
- `src/content/brands.ts` -- НОВЫЙ: тип `BrandsContent` + инстанс `brandsContent` (весь статический текст обоих прототипов дословно; desktop/mobile-варианты действий и структуры ТМ).
- `src/components/brands/Hero.tsx` -- НОВЫЙ RSC: page-hero (01) — eyebrow «Private Label», h1 «Our Brands», абзац; обе композиции; первая секция без `.reveal`.
- `src/components/brands/BrandCard.tsx` -- НОВЫЙ RSC (02): desktop-поддерево — media (tag/moto-logo/status с инлайн-bg) + body (h2/sub/абзацы + `.bc-trademark` блок фактов + BECOME A PARTNER/SHOP AMAZON); mobile-поддерево — media + body БЕЗ ТМ + Visit mototou.com/Become a partner; `.reveal`.
- `src/components/brands/Story.tsx` -- НОВЫЙ RSC (03): eyebrow/section-title/lead/абзацы/pull; обе композиции; `.reveal`.
- `src/components/brands/Products.tsx` -- НОВЫЙ RSC (04): desktop — 2 `.prod-grid` (второй `.flip`) + `.prod-note`; mobile — 2 `.prod-block` + `.prod-note`; галочки `.cat-list` (desktop `--color-or`, mobile `--color-green` по прототипу); `.reveal`.
- `src/components/brands/Trademark.tsx` -- НОВЫЙ RSC (mobile-only, 05): eyebrow/h2/desc/`.tm-facts` (6 фактов) + монтирует `<CertLightbox/>` для карточки сертификата; рендерится ТОЛЬКО в mobile-поддереве; `.reveal`.
- `src/components/brands/CtaSection.tsx` -- НОВЫЙ RSC (desktop 05 / mobile 06): heading «Interested in <span.or-txt>Mototou</span>?» + sub + CTA «CONTACT US»/«Contact us» → `/contact`; обе композиции; `.reveal`.
- `src/components/islands/CertLightbox.client.tsx` -- НОВЫЙ `'use client'` островок: рендерит `.tm-cert` (клик → open) + `.lightbox` оверлей (клик → close); scroll-lock через `body.style.overflow`; БЕЗ Esc; получает `img/alt/caption/enlargedAlt` пропсами.
- `src/styles/brands.css` -- НОВЫЙ: стили обеих композиций, портированы из встроенного CSS `Our Brands.html` и `Our Brands Mobile.html` (+ нужные mobile-shell-классы из `mobile.css`); scope `.brands-dk`/`.brands-mb`, медиа-переключение на 768px; `.btn-navy` локально; не дублировать `.btn`/`.reveal`/глоб. токены.
- `public/mototou-shelf-bg.jpg`, `public/mototou-product-reflectors.jpg`, `public/mototou-filters.jpg`, `public/mototou-trademark.png` -- скопировать 4 ассета из `rollun_handoff/rollun-web-site/project/`.
- `src/components/about/*`, `src/styles/about.css`, `src/content/about.ts` -- ЭТАЛОН паттерна (композиция dk/mb, content-модуль, scope css) — не менять.
- `src/components/contact-form/*ContactModal*.client.tsx` -- ЭТАЛОН idiom scroll-lock (`useEffect` + `body.style.overflow`) — не менять.
- `src/app/(site)/layout.tsx` -- Header/Footer/RevealOnScroll смонтированы здесь — переиспользовать, не трогать.
- `docs/pixel-acceptance/checklist-brands.md` -- чеклист приёмки (отмечается в review-проходе).

## Tasks & Acceptance

**Execution:**
- [x] `public/` (assets) -- скопировать `mototou-shelf-bg.jpg`, `mototou-product-reflectors.jpg`, `mototou-filters.jpg`, `mototou-trademark.png` из `rollun_handoff/rollun-web-site/project/` в `public/`; ссылаться root-абсолютными URL (`/mototou-*.jpg`), в т.ч. CSS `url('/mototou-shelf-bg.jpg')` -- изображения доступны рантайму.
- [x] `src/content/brands.ts` -- определить тип `BrandsContent` и экспортировать инстанс `brandsContent`; весь статический текст обоих прототипов дословно, включая desktop/mobile-различия (действия brand card, наличие/отсутствие ТМ-блока) -- единый типизированный источник (AD-7/AD-14).
- [x] `src/styles/brands.css` -- портировать стили обеих композиций (scope `.brands-dk`/`.brands-mb`), переключение только `@media` 768px; `.btn-navy` локально через `--color-moto-navy`; переиспользовать глобальные токены/классы -- пиксель-в-пиксель раскладка.
- [x] `src/components/islands/CertLightbox.client.tsx` -- `'use client'`: state `open`, `.tm-cert` (onClick open) + `.lightbox` (onClick close), scroll-lock через `useEffect`+`body.style.overflow`, БЕЗ Esc; пропсы `img/alt/caption/enlargedAlt`.
- [x] `src/components/brands/Hero.tsx` -- RSC (01): обе композиции, eyebrow/h1/абзац; без `.reveal`.
- [x] `src/components/brands/BrandCard.tsx` -- RSC (02): desktop — media+body с `.bc-trademark` и BECOME A PARTNER/SHOP AMAZON; mobile — media+body без ТМ и Visit mototou.com/Become a partner; статус-бейдж desktop с инлайн-bg дословно; `.reveal`.
- [x] `src/components/brands/Story.tsx` -- RSC (03): обе композиции, eyebrow/title/lead/абзацы/pull; `.reveal`.
- [x] `src/components/brands/Products.tsx` -- RSC (04): desktop 2 `.prod-grid`(2-й `.flip`)+note; mobile 2 `.prod-block`+note; `.cat-list` галочки; `.reveal`.
- [x] `src/components/brands/Trademark.tsx` -- RSC (mobile-only 05): eyebrow/h2/desc/`.tm-facts`(6) + `<CertLightbox/>`; рендер только в mobile-поддереве; `.reveal`.
- [x] `src/components/brands/CtaSection.tsx` -- RSC (05/06): heading с `.or-txt`-акцентом, sub, CTA → `/contact`; обе композиции; `.reveal`.
- [x] `src/app/(site)/brands/page.tsx` -- переписать: `import '@/styles/brands.css'`, отрендерить секции из `brandsContent` в `<main>` в порядке Handoff -- страница = чистая функция контента.

**Acceptance Criteria:**
- Given маршрут `/brands`, when страница загружена на desktop и на mobile, then отрендерены секции Handoff в правильном порядке и визуал совпадает с соответствующим прототипом (desktop `Our Brands.html` / mobile `Our Brands Mobile.html`).
- Given desktop-композицию, when открыт DOM, then реквизиты ТМ присутствуют текстом внутри brand card, а отдельной Trademark-секции и элемента lightbox в видимой desktop-композиции нет; действия — BECOME A PARTNER (→`/contact`) и SHOP MOTOTOU ON AMAZON (внешн., new tab).
- Given mobile-композицию, when открыт DOM, then brand card без ТМ-блока, действия — Visit mototou.com (внешн., new tab) и Become a partner; присутствует отдельная Trademark-секция с сертификатом.
- Given mobile Trademark, when клик по карточке сертификата, then открывается lightbox и `body` заблокирован от скролла; when клик по оверлею, then закрывается и скролл восстановлен; when Escape, then ничего (Esc не подключён).
- Given реализацию, when проверяется тип, then страница типизирована как чистая функция `BrandsContent`, а `brandsContent` — статический инстанс из `content/*` (плоские сериализуемые данные, форма совместима с Payload Global).
- Given любой вьюпорт, when открыт DOM, then обе композиции присутствуют, переключение видимого дерева — только CSS-медиа 768px; ровно один элемент lightbox в DOM.

## Design Notes

**Форма `BrandsContent` (скелет; строки заполнить дословно из прототипов).** Различия desktop↔mobile — явными полями, не рантайм-логикой:

```ts
export type TmFact = { k: string; v: string }
export type ProdCategory = string
export type BrandsContent = {
  hero: { eyebrow: string; title: string; intro: string }
  brand: {
    tag: string; logoText: string; status: string
    h2: string; sub: string; paragraphs: string[]
    trademark: { head: string; desc: string; facts: TmFact[] } // desktop brand-card block + mobile Trademark section
    actions: { desktop: { becomePartner: {label;href}; amazon: {label;href} }
               mobile:  { visit: {label;href}; becomePartner: {label;href} } }
  }
  story: { eyebrow: string; title: string; lead: string; paragraphs: string[]; pull: string }
  products: { eyebrow: string; title: string
    blocks: { img: string; alt: string; h3: string; paragraphs?: string[]; categories?: ProdCategory[] }[]
    note: { text: string; strong: string } } // strong-фрагмент выделить <strong>
  trademark: { eyebrow: string; title: string; desc: string
    cert: { img: string; alt: string; caption: string; enlargedAlt: string } } // mobile-only
  cta: { headingPre: string; headingAccent: string; headingPost: string; sub: string; ctaLabel: string; ctaHref: string }
}
```

- **Композиция AD-3 (эталон — About/Home/Footer):** каждый секционный компонент выводит desktop-поддерево (`.brands-dk …`) и mobile-поддерево (`.brands-mb …`); видимость решает `@media` 768px. Точные внутренние классы — как в прототипе (`.page-hero`, `.brand-card`, `.bc-*`, `.story`, `.pull`, `.prod-grid`/`.prod-block`, `.cat-list`, `.tm-*`, `.cta`/`.brand-cta`).
- **Trademark — mobile-only:** секция рендерится только в mobile-поддереве, поэтому в desktop-композиции её (и lightbox) нет — это воспроизводит прототипный дефект «desktop без lightbox», без дубля id и без мёртвого desktop-элемента.
- **CertLightbox** (idiom — ContactModal scroll-lock):
```tsx
'use client'
export default function CertLightbox({ img, alt, caption, enlargedAlt }: {...}) {
  const [open, setOpen] = useState(false)
  useEffect(() => { if (!open) return; document.body.style.overflow='hidden'; return () => { document.body.style.overflow='' } }, [open])
  return (<>
    <div className="tm-cert" id="certCard" onClick={() => setOpen(true)}>
      <img src={img} alt={alt} loading="lazy" /><div className="cap">{caption}</div>
    </div>
    <div className={`lightbox${open ? ' open' : ''}`} onClick={() => setOpen(false)} aria-hidden={!open}>
      <img src={img} alt={enlargedAlt} />
    </div>
  </>)
}
```
(Нет Esc-хендлера — дословно as-is. `.lightbox` стили — mobile-вариант: `display:none` → `.open{display:flex}`.)
- **Контент-модуль** повторяет `content/about.ts`: типы + один инстанс (AD-14), без хардкода строк в JSX секций.

## Verification

**Commands:**
- `npm run lint` -- expected: без ошибок.
- `npm run build` -- expected: strict typecheck + сборка проходят; `BrandsContent`/`brandsContent` типобезопасны, `/brands` компилируется как чистая функция контента (○ Static prerender).

**Manual checks:**
- `npm run preview` → http://localhost:3000/brands : сверить визуал против `Our Brands.html` (1280px и 900px) и `Our Brands Mobile.html` (~390px и ~760px, 440px-шелл) по `docs/pixel-acceptance/checklist-brands.md`.
- В DOM подтвердить: desktop — реквизиты ТМ текстом в brand card, нет видимой Trademark-секции/lightbox, действия BECOME A PARTNER/SHOP AMAZON; mobile — Trademark-секция с сертификатом, действия Visit mototou.com/Become a partner; ровно один `.lightbox` в DOM.
- Mobile lightbox: клик по сертификату открывает оверлей + блокирует скролл; клик по оверлею закрывает; Esc не закрывает.

## Spec Change Log

_(no bad_spec loopbacks — empty)_

## Review Triage Log

### 2026-07-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2: (high 0, medium 2, low 0)
- defer: 0
- reject: 12
- addressed_findings:
  - `[medium]` `[patch]` Mobile CTA-секция теряла свои стили: класс `brand-cta` находится на ТОМ ЖЕ узле, что и `brands-mb` (`<section className="brands-mb section paper brand-cta">`), а CSS использовал селектор-потомок `.brands-mb .brand-cta {…}` (и `h2`/`p`/`.btn`), который на одном элементе не матчится. Итог — mobile-CTA без центрирования/размера h2/полноширинной кнопки (desktop-двойник верно использует компаунд `.brands-dk.cta`). Fixed: селекторы → компаунд `.brands-mb.brand-cta …`.
  - `[medium]` `[patch]` Тот же дефект в Story-секции (обнаружен при аудите): `story` тоже на корневом узле (`brands-mb section paper story`), а `.brands-mb .story .lead/p/.pull` — потомок → mobile-story-копия откатывалась к общему `.brands-mb p` вместо своих размеров. Fixed: → `.brands-mb.story …`. Аудит подтвердил, что остальные корневые токены (`.section`/`.bg`/`.dark`/`.paper`/`.page-hero`) уже заданы компаунд-селекторами верно — других экземпляров нет.
- rejected (not defects / by-design / precedent):
  - Cert-lightbox a11y-кластер (триггер `.tm-cert` без `role/tabIndex/onKeyDown`; оверлей без `role="dialog"`/focus-trap/focus-restore; scroll-lock не восстанавливает прежнее значение; scroll-lock «залипает» при ресайзе через 768px) — отклонено: сертификат уже виден инлайн как миниатюра с `alt`, оверлей — только pointer-зум, портированный дословно из прототипа, чьё взаимодействие intent-contract фиксирует as-is БЕЗ Escape. Полная клавиатурная/focus-поддержка требует либо Escape (контракт запрещает), либо видимого close-контрола (сдвиг пикселя, запрещено); частичный keyboard-open без keyboard-close создал бы худшую ловушку. Согласуется с прецедентом Story 4.1 (a11y-ниты отклонены при приоритете дизайна + дословном порте). Контент доступен, дефекта контента нет.
  - Двойные `<h1>`/дублирование контента в одном DOM — by design (AD-3: обе композиции в DOM, видимость через CSS-медиа; системно для всех страниц).
  - React-ключи по строке контента (`key={p}`/`key={c}`/`key={f.k}`/`key={block.img}`) — на ФИКСИРОВАННОМ статик-инстансе `brandsContent`; спекулятивно, отклонено и в 4.1.
  - `rel="noopener"` без `noreferrer` / отсутствие «new tab»-подсказки — noopener закрывает tabnabbing; дословный порт; отклонено и в 4.1.
  - `direction: rtl` во `.prod-grid.flip` — дословный порт из desktop-прототипа, работает для двух дочерних.
  - Cert-`<img>` без width/height (CLS) — дословный порт (в прототипе размеров тоже нет), косметика.
  - Мёртвые CSS-селекторы (`.section-head p`/`.center`, `.section-title .or-txt`, mobile-hero `h1 .or-txt`) — безвредный остаток дословного порта.
  - Спекулятивные edge-кейсы на фиксированном статик-контенте: пустой `story.paragraphs` (`<p>{undefined}</p>`), хардкод `i===1` для flip при !=2 блоках, блок без `paragraphs`/`categories` — текущий типизированный инстанс их исключает; отклонено по прецеденту 4.1 (спекулятивный OOB/empty на фикс-инстансе).

## Auto Run Result

Status: done

### Summary
Страница Our Brands (`/brands`) собрана как чистая функция типизированного `BrandsContent`: заглушка Story 1.1 заменена композитом секций Handoff. Обе композиции (`.brands-dk` / `.brands-mb`) SSR-рендерятся в один DOM, видимая выбирается только CSS-медиа на 768px (AD-3). Desktop: Hero → Brand card (с реквизитами ТМ ТЕКСТОМ внутри карточки + BECOME A PARTNER/SHOP AMAZON) → Story → Products → CTA. Mobile: Hero → Brand card (Visit mototou.com/Become a partner, без ТМ) → Story → Products → отдельная Trademark-секция с сертификатом USPTO → CTA. Единственный интерактив — mobile-lightbox сертификата (`CertLightbox.client`): клик открывает, клик закрывает, scroll-lock; Esc не подключён (as-is, UX-DR16). Ровно один `.lightbox` в DOM (только mobile). Header/Footer/RevealOnScroll — из layout. Весь текст портирован дословно из `Our Brands.html`/`Our Brands Mobile.html` в один инстанс `brandsContent` (AD-7/AD-14).

### Files changed
- `src/app/(site)/brands/page.tsx` — переписан: чистая функция `brandsContent`, композит секций в порядке Handoff, импорт `brands.css`.
- `src/content/brands.ts` (new) — тип `BrandsContent` + инстанс `brandsContent` (весь статический текст обоих прототипов, desktop/mobile-варианты действий и структуры ТМ).
- `src/components/brands/Hero.tsx` (new) — секция 01, обе композиции, без `.reveal`.
- `src/components/brands/BrandCard.tsx` (new) — секция 02; desktop с `.bc-trademark` + BECOME A PARTNER/SHOP AMAZON, mobile без ТМ + Visit mototou.com/Become a partner; статус-бейдж desktop с инлайн-bg дословно.
- `src/components/brands/Story.tsx` (new) — секция 03.
- `src/components/brands/Products.tsx` (new) — секция 04; desktop 2 `.prod-grid`(2-й `.flip`)+note, mobile 2 `.prod-block`+note; галочки desktop `--color-or` / mobile `--color-green`.
- `src/components/brands/Trademark.tsx` (new) — mobile-only секция 05; факты ТМ + монтирует `<CertLightbox/>`.
- `src/components/brands/CtaSection.tsx` (new) — секция 05/06, CTA → `/contact`.
- `src/components/islands/CertLightbox.client.tsx` (new) — `'use client'` островок: `.tm-cert`→open / `.lightbox`→close, scroll-lock, без Esc.
- `src/styles/brands.css` (new) — стили обеих композиций, scope `.brands-dk`/`.brands-mb`, переключение медиа 768px; `.btn-navy` per-composition (desktop moto-navy #1c2c6b / mobile #232a36).
- `public/mototou-shelf-bg.jpg`, `public/mototou-product-reflectors.jpg`, `public/mototou-filters.jpg`, `public/mototou-trademark.png` (new) — ассеты бренда.

### Review findings
- Patches applied (2, both medium): (1) mobile CTA-секция — селектор-потомок `.brands-mb .brand-cta` не матчил класс на том же узле → компаунд `.brands-mb.brand-cta`; (2) тот же дефект в Story (`.brands-mb .story …` → `.brands-mb.story …`), найден при аудите. Аудит подтвердил отсутствие других экземпляров.
- Deferred: 0.
- Rejected (12): cert-lightbox a11y-кластер (дословный порт + intent-contract no-Esc; контент доступен инлайн), двойные h1/дублирование (by design AD-3), React-ключи по контенту на фикс-инстансе, noreferrer, `direction:rtl`-порт, cert-CLS-порт, мёртвые CSS-селекторы, спекулятивные edge на статик-контенте — см. Review Triage Log.

### Verification
- `npm run lint` → PASS (без ошибок), пере-прогон после патчей — тоже PASS.
- `npm run build` → PASS (strict typecheck + сборка; `/brands` = ○ Static prerender), пере-прогон после патчей — PASS.
- Пиксель-приёмка в браузере по `docs/pixel-acceptance/checklist-brands.md` (1280/900/~390/~760px) — ручной review-шаг (SM-1), ещё не отмечен.

### Residual risks
- Формальная пиксель-приёмка (визуальная сверка с прототипами) — ручной шаг, ещё не отмечен в чеклисте. Патчи восстанавливают заданный стиль mobile CTA/Story, но точное пиксельное совпадение подтверждается только визуально.
- Cert-lightbox доступен только указателем (по дизайну/контракту, Esc запрещён); контент сертификата при этом виден инлайн миниатюрой с `alt`.
