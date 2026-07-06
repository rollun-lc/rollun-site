# Epic 6 Context: Бренд, магазины и контакты (Our Brands / Our Shops / Contact)

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Эпик закрывает три оставшиеся публичные страницы Фазы 1 — витрину собственного бренда MOTOTOU (`/brands`), страницу физического магазина в Хьюстоне (`/shops`) и страницу контактов (`/contact`) — каждую пиксель-в-пиксель по Handoff на desktop и mobile. Ценность: посетитель видит зрелого производителя со своим брендом и сертификатом USPTO, узнаёт про офлайн-магазин и маркетплейсы, а B2B-партнёр отправляет заявку через инлайн-форму с картой и переключением локаций. Это финальный кусок визуального MVP; форма и её Server-Action-логика приходят готовым компонентом из Epic 2 — здесь она только монтируется в инлайн-режиме на `/contact`.

## Stories

- Story 6.1: Our Brands — витрина бренда MOTOTOU
- Story 6.2: Our Shops — магазин и маркетплейсы
- Story 6.3: Contact — инлайн-форма, карта и табы локаций

## Requirements & Constraints

- Все три страницы — пиксель-в-пиксель по отрисованному прототипу на desktop и mobile; при конфликте формулировок и пикселя выигрывает отрисованный прототип. Приёмка — по брейкпоинт-чеклисту (SM-1) с каноническими Handoff-референсами (`Our Brands.html`, `Our Shops.html`, `Contact.html` + их `* Mobile.html`).
- Постраничные desktop-брейкпоинты (из файлов прототипа): Brands 900/920/980/1280; Shops 940/980/1280; Contact 980/1280. Полоса 768–~900px — самый «схлопнутый» desktop-стейт; переход на mobile-композицию на 768px.
- Форма на `/contact` — тот же единый `ContactForm` из Epic 2 в инлайн-режиме (без модалки), один Server Action, один endpoint. Никаких новых форм/обработчиков здесь не создаётся.
- Empty/no-data состояния: если Google Maps iframe не загрузился — показать `.map-hint` «Map could not load».
- Контент англоязычный, микрокопи прибита гвоздями; CTA капсом глаголом («BECOME A PARTNER», «GET DIRECTIONS», «SHOP MOTOTOU ON AMAZON»).
- Базовый accessibility-пол: семантический HTML, Tab-порядок, клавиатура для интеракций, видимый оранжевый focus-ring, ARIA на оверлеях, `prefers-reduced-motion` отключает анимации — но ничего из этого не сдвигает отрисованный пиксель (дизайн важнее a11y при конфликте).

## Technical Decisions

- Каждая страница — чистая функция своего типизированного контент-объекта: `BrandsContent`, `ShopsContent`, `ContactContent`. В Фазе 1 подаётся статический инстанс из `content/*`, typecheck-совместимый с будущим Payload Global (шов к Epic 7). Абстрактной `Page`/page-builder нет.
- Islands Architecture: страницы/секции — RSC; интерактив (lightbox сертификата, табы карты) — листовые `'use client'`-островки, получающие контент пропсами (островок не фетчит).
- Две композиции desktop|mobile обе SSR-рендерятся в DOM; переключение только CSS-медиа на 768px; JS-гейтинг и UA-сниффинг запрещены. На вьюпорт грузится ровно одна композиция.
- Паспорт-атомы (адреса, телефоны, email, часы) в Фазе 1 захардкожены, но вынесены так, чтобы позже ссылаться на `SiteSettings` без изменения разметки/пикселя. Каждый атом имеет единственный дом; кросс-страничные расхождения — это разные именованные атомы (`hours.store` ≠ `hours.homeCta`), а не одно значение, отрисованное по-разному — не сводить.
- Данные из дизайна для этих страниц: магазин 5327 Aldine Mail Route Rd, Houston TX 77039; регистрация Rollun LC — 30 N Gould St STE 4370, Sheridan WY 82801; телефоны (307) 920-0149 и (832) 461-2525; email `llc@rollun.com` / `info@rollun.com`; часы магазина Mon–Fri 10–16, Sat/Sun closed. Маркетплейсы: Amazon, eBay (`ebay.com/str/Rollun`), Walmart.
- Внешние ссылки открываются в новой вкладке (`target=_blank rel=noopener`).

## UX & Interaction Patterns

- **Our Brands (6.1):** общие секции Hero «Private Label / Our Brands» → brand card MOTOTOU → «Our story» → «Our products» → CTA «Interested in Mototou?» → Footer. Desktop: кнопки «BECOME A PARTNER» (→ Contact) и «SHOP MOTOTOU ON AMAZON» (внешний Amazon); реквизиты ТМ — текстом, элемента `#lightbox` в desktop-DOM нет. Mobile: ссылка «Visit mototou.com» + секция Trademark с lightbox сертификата USPTO — клик по `#certCard` открывает `#lightbox`, клик закрывает, scroll-lock. Пер-страничные бренд-токены `--moto-navy`/`--moto-navy-deep` — только здесь, в глобальную палитру не тащить.
- **Our Shops (6.2):** Hero «Our stores» → «Visit our store in Texas» (видимый адрес Houston) → три карточки маркетплейсов → таблица часов → Footer. «GET DIRECTIONS» — внешняя ссылка.
- **Contact (6.3):** Hero → инлайн `ContactForm` (`#contactForm`, из Epic 2) → Map-секция с табами локаций → Footer. Табы `.map-tab[data-q]` переключают `#mapFrame.src` = `maps.google.com/maps?q=…&z=13&output=embed` через `encodeURIComponent(data-q)` между Houston TX и Sheridan WY; активный таб — класс `active`; табы есть и на mobile.

## Known Design Defects — воспроизвести дословно

- **Our Shops — «GET DIRECTIONS» ведёт на Conroe TX** (`q=Conroe`), хотя на странице виден Houston. Воспроизводится на desktop и mobile; НЕ чинить на Houston.
- **Contact — стартовый `src` карты содержит опечатку `q=53%2F27%20Aldine…`.** Оставить стартовый src как есть; клик по любому табу корректно пересобирает URL через `encodeURIComponent`.
- **Часы расходятся между страницами** (Our Shops / Contact / footer / Home-CTA) — это разные именованные атомы `SiteSettings`, а не один. Не сводить к одному значению.
- **Lightbox сертификата USPTO — только в mobile-DOM Our Brands, без Esc.** Клик открывает, клик закрывает; keydown→Escape не подключён — не дорисовывать. На desktop элемента `#lightbox` нет; desktop-JS содержит мёртвый код (защищён `if(cert&&lb)`) — desktop оставить без lightbox.

## Cross-Story Dependencies

- Все три страницы зависят от Epic 1: общая оболочка (header/footer/mobile-шасси), дизайн-токены и брейкпоинт-чеклист приёмки (SM-1).
- Story 6.3 монтирует `ContactForm` из Epic 2 (инлайн-режим) — форма и Server Action не реализуются в этом эпике.
- Паспорт-атомы этих страниц — шов к Epic 7 (`SiteSettings`): вынести захардкоженные значения так, чтобы позже переключиться на ссылки без изменения пикселя.
