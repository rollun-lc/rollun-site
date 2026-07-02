# Сверка handoff-дизайна с PRD — пропуски и расхождения

*Дата: 2026-07-02. Источник истины по визуалу — handoff-бандл `rollun_handoff/rollun-web-site/project/`. Цель — найти, что есть в дизайне, но не описано как FR в PRD `prd.md` (+`addendum.md`).*

Изучены: все 6 desktop-HTML, 6 mobile-HTML, `mobile.js`, DS-токены `colors_and_type.css`. React-панель `tweaks-panel.jsx` / `TweaksPanel` / `TweakSlider` — это dev-тулинг Claude Design (панель настройки прототипа), НЕ часть сайта, в расчёт не берётся.

---

## Страницы

Ровно **6 страниц**, 7-й нет. `About Us v1.html`, `*-print*.html` — служебные варианты, не отдельные экраны. Пофактическая структура секций (`data-screen-label`):

1. **Home** — Hero (фото-мозаика ч/б → расцветает в цвет) · Product lines (2 авто-карусели: Automotive, Health) · Stats «Proven at scale» (анимированные счётчики) · Key benefits (4 иконки-иллюстрации) · Marketplaces «Find us on marketplaces» · CTA «Let's talk business» · **Contact-форма в МОДАЛКЕ** · Footer.
2. **About Us** (главный экран) — Hero · Snapshot/Focus · Wave · Approach · Automation (тёмная, анимированные счётчики + coin-tower + meter-анимации) · KeepToShip · **US Presence — интерактивная D3/TopoJSON-карта** · Team · CTA · **Contact-форма в МОДАЛКЕ** · Footer.
3. **Catalog** — Hero · Two entrances · Product lines (Health слева / Automotive справа, переключение подкатегорий + фильтр-бар «Showing …») · карточки товара (стрелки-слайдер изображений + чипы-офферы) · **Product Detail — quick-view МОДАЛКА** (галерея-слайдер, rating, specs, fits, офферы Amazon/eBay/Walmart) · **Brands marquee «Brands we work with» (~28 лого ×2 ленты, hover-пауза)** · CTA · Footer.
4. **Our Brands** — **это витрина СОБСТВЕННОГО бренда MOTOTOU, а НЕ стена чужих лого.** Hero · Brand card (Mototou, ссылка на mototou.com) · «Our story» · «Our products» (reflectors, filters, upcoming categories) · CTA «Interested in Mototou?» · **Certificate lightbox** · Footer.
5. **Our Shops** — Hero «Our stores» · «Visit our store in Texas» (Conroe TX, GET DIRECTIONS → Google Maps) · «Shop on marketplaces» (карточки Amazon, Walmart) · hours-table · Footer. **Табов локаций тут нет.**
6. **Contact** — Hero · Contact-форма **ИНЛАЙН** (`#contactForm`) · Map-секция с **табами локаций** (переключают Google-Maps iframe: Houston TX 77039 ↔ Sheridan WY legal) · Footer.

---

## Интерактивные компоненты (инвентаризация по факту)

- **Модалка Contact-формы** — Home и About Us: `role="dialog" aria-modal="true"`, кнопка-триггер «GET IN TOUCH» / «ASK A QUESTION», закрытие по крестику / backdrop / Esc, `body` scroll-lock. Сабмит замокан (`setTimeout` + `form.reset()`).
- **Quick-view модалка товара** (`.pd-modal`) — Catalog: галерея-слайдер, rating, specs, fits/совместимость (зелёные галки), офферы-строки Amazon/eBay/Walmart. Открытие/закрытие + backdrop.
- **Certificate lightbox** (`#lightbox`) — Our Brands: клик по сертификату → полноэкранный просмотр, закрытие клик/Esc.
- **Brands marquee** — Catalog: две бесконечные ленты favicon-лого (`marquee-left` 48s / `marquee-right` 34s), пауза по hover. Именно тут «стена брендов».
- **Карусели** — Home: авто-ротация product-line стэков каждые 3s (`data-carousel`); Catalog: слайдер изображений в карточке товара (`.pc-arrow.prev/.next`).
- **Переключатели/табы** — Catalog: подкатегории Health/Automotive + фильтр-бар; Contact: табы локаций, меняющие `src` iframe.
- **Интерактивная карта США** (About Us) — D3.js + TopoJSON: кликабельные маркеры-локации → всплывающие поповеры со списком, закрытие клик/Esc, репозиционирование на resize, **анимированный счётчик «live shipping points»**.
- **Анимированные счётчики (count-up на скролле)** — Home «Proven at scale», About «Automation», map-ticker; плюс coin-tower и meter fill-анимации (IntersectionObserver).
- **Scroll-reveal** анимации секций — все страницы.
- **Google Maps** — iframe-embed (Contact), внешние ссылки/директории (Our Shops, поповеры карты About).
- **Мобильный chrome** (`mobile.js`) — burger-drawer навигация (scrim, close), **footer-аккордеоны** (`.facc-head`), header shrink-on-scroll, reveal-on-scroll.

---

## Пропущено в PRD

1. **[КРУПНОЕ] Страница Our Brands описана неверно.** PRD FR-6 (§4.5): «стена из ~52 лого брендов с lightbox». По факту Our Brands — **имиджевая страница собственного бренда Rollun «MOTOTOU»**: brand card, «Our story», «Our products» (reflectors/filters/upcoming), ссылка на mototou.com, CTA «Interested in Mototou?». Lightbox открывает **сертификат**, а не лого бренда. Весь нарратив собственного бренда Mototou в PRD отсутствует, а «стена лого» неверно приписана этой странице.
2. **[КРУПНОЕ] «Стена ~52 лого» физически живёт в Catalog, а не в Our Brands** — это marquee «Brands we work with» (авто-скролл, hover-пауза). PRD FR-4 упоминает marquee, но не отражает, что именно это и есть коллекция брендов (addendum §C привязывает `Brands`/~52 лого к Our Brands — тоже мимо).
3. **[СРЕДНЕЕ] Contact-форма на Home и About Us — это МОДАЛКА, не «встроенная форма».** PRD FR-2/FR-3/FR-11 описывают форму как «встроенную/единый инлайн-компонент». По факту инлайн она только на Contact; на Home/About это dialog-оверлей с триггер-кнопкой, закрытием по Esc/backdrop и scroll-lock. Интерактив открытия/закрытия модалки не специфицирован.
4. **[СРЕДНЕЕ] Карта США на About Us — интерактивная D3/TopoJSON-карта**, а не просто «canvas/SVG» (FR-3). Пропущены: кликабельные маркеры → поповеры локаций, закрытие Esc/клик, resize-репозиционирование и **анимированный счётчик отгрузок**.
5. **[СРЕДНЕЕ] Анимированные count-up счётчики** (Home «Proven at scale», About «Automation» + map-ticker, coin-tower/meter-анимации) нигде не заявлены. Более того, FR-2 (§4.2, ASSUMPTION) намекает «анимаций сверх Handoff нет», не перечисляя эти заложенные в Handoff анимации — риск, что их выкинут.
6. **[МЕЛКОЕ] Карусели** — авто-ротация product-line на Home и слайдер изображений в карточке Catalog — как компоненты не выделены (FR-4 говорит только про табы+marquee, FR-5 — про слайдер только внутри quick-view).
7. **[МЕЛКОЕ] Мобильные footer-аккордеоны** и header shrink-on-scroll — не в PRD (FR-1 покрывает только burger-меню).
8. **[МЕЛКОЕ / расхождение] На Our Shops нет табов локаций.** FR-7 (§4.6) приписывает «табы/переключатель локаций» странице Our Shops; по факту там один физический магазин (Conroe TX) + карточки маркетплейсов (Amazon, Walmart). Табы локаций — на Contact (FR-8). У Our Shops «Shop on marketplaces» — только Amazon и Walmart (без eBay).

---

## Расхождения desktop-vs-mobile

- **Две DS** (Archivo/Hanken/Spline + оранж `#EA7B08` на desktop; Poppins/Roboto/Karla + `#EF7F1A` на mobile) — уже учтено в PRD §3 и addendum §B.
- **Навигация:** desktop — горизонтальный `nav`; mobile — burger + выезжающий drawer (`mobile.js`). Учтено FR-1 в общем виде.
- **Footer:** desktop — раскрытые колонки; mobile — **аккордеоны** (`.facc-head` toggle). В PRD не отражено.
- **Раскладка:** мобильные страницы — упрощённый стек тех же секций; отдельные файлы, `Catalog Mobile.html` крупный (836 строк) — quick-view/офферы присутствуют и на мобиле. Карусели product-line на мобиле стекаются.
- **Адреса постранично не примирены** (Contact = Houston TX 77039 / Sheridan WY; Our Shops = Conroe TX) — это намеренно и уже зафиксировано в PRD/addendum.

---

## Вывод

PRD корректно покрывает 6 страниц, форму и CMS-роадмап, но **два крупных содержательных промаха**: (1) страница **Our Brands на деле — витрина собственного бренда MOTOTOU** (story/products/сертификат-lightbox), а не стена чужих лого; (2) **стена ~52 лого — это marquee на Catalog**. Плюс форма на Home/About подаётся **модалкой**, карта About — **интерактивная D3-карта с поповерами**, и присутствуют **анимированные счётчики/карусели**, не заявленные как FR. Рекомендуется переписать FR-6, уточнить FR-4/FR-5, FR-2/FR-3/FR-11 и добавить пункты про счётчики/карусели/мобильные аккордеоны.
