# Epic 4 Context: О компании (About Us)

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Эпик реализует страницу About Us (`/about`) пиксель-в-пиксель по Handoff на desktop и mobile. Цель страницы — дать оптовому партнёру доказательства масштаба и зрелости компании (доверие, UJ-1): интерактивная D3-карта присутствия по США, count-up-счётчики, секция Automation (coin-tower + workforce-фигуры), блок KeepToShip с внешним CTA. Страница подаётся как чистая функция типизированного контент-объекта `AboutContent` (Фаза 1 — статический инстанс из `content/*`), готовая к переезду на Payload Global в Фазе 2. Покрывает FR-3.

## Stories

- Story 4.1: Каркас About Us — композиция и секции
- Story 4.2: US Presence — интерактивная D3-карта (desktop)
- Story 4.3: US Presence — статический список (mobile)
- Story 4.4: Секция Automation — coin-tower и workforce

## Requirements & Constraints

- **Пиксель-в-пиксель — приоритет №1.** Визуал матчится по отрисованному Handoff-прототипу на каждом целевом брейкпоинте (desktop-поднаборы вплоть до 1280 + mobile-композиция ≤768px, letterbox-шелл 440px). Дизайн — источник истины; кросс-страничные расхождения не примиряются. Приёмка страницы использует брейкпоинт-чеклист (SM-1) из Epic 1; страница не Done, пока все её пункты не отмечены.
- **Порядок секций** (as-designed): Hero → Snapshot → Approach → Automation → KeepToShip → US Presence → Team → CTA → Footer.
- KeepToShip содержит внешний CTA «LEARN MORE» на `keeptoship.com`.
- Contact-форма на странице: desktop — модалка по кнопке «GET IN TOUCH» (компонент из Epic 2); mobile — контакт-модалки нет вовсе, триггер ведёт навигацией на `/contact`.
- **Известный дефект (воспроизвести дословно):** в секции Team элемент `.team-tile.tr` сохраняет литеральный цвет `#ea7b07` — НЕ нормализовать в токен `--or`.
- Пустое состояние: если D3-карта не загрузилась — показать `.map-hint` «Map could not load».
- `prefers-reduced-motion` отключает все анимации (count-up сразу показывает финал; coin-tower/workforce — статичный итог).

## Technical Decisions

- **Islands Architecture:** секции страницы — RSC; весь интерактив/анимация (D3-карта, count-up, coin-tower, workforce) — листовые `'use client'`-островки. Островок получает контент пропсами и НЕ фетчит данные сам.
- **Две композиции desktop|mobile:** обе SSR-рендерятся в DOM, переключение только CSS-медиа на 768px. Запрещены JS-гейтинг и UA-сниффинг. На вьюпорт грузится ровно одна композиция (art-direction) — D3-бандл на mobile не грузится вовсе.
- **Страница = чистая функция контент-объекта:** `AboutContent`. Фаза 1 — статический инстанс, typecheck-совместимый с будущим Payload-генерённым типом (проверяется в CI).
- **Вендоринг ассетов:** D3 / topojson-client / us-atlas идут в бандл (без CDN-хотлинка). Скаффолдинг прототипа About (react/@babel через unpkg) выкидывается. Шрифт Caveat (веса 600/700) — только на About Us, через `next/font` (self-host).
- **D3-карта (desktop):** проекция `geoAlbersUsa`, viewBox 960×600; кликабельные маркеры — HQ Sheridan WY, Store Houston TX, ~30 warehouse; клик → поповер с деталями; закрытие клик-по-карте / Esc / `.lp-close`; репозиция поповера на `resize`.
- **US Presence (mobile):** статический список локаций + чипы городов, без D3; число «ship-from locations» показано финальным (не анимируется).
- **Automation (desktop-only):** coin-tower — 10 монет всплывают ease-out 1800ms, первые 3 оранжевые; workforce — 10 SVG-фигур, 8 гаснут в `rgba(255,255,255,0.24)` со сдвигом 130ms; триггер по IntersectionObserver threshold 0.2, играет один раз. На mobile — только count-up (без coin-tower/workforce).
- **Count-up счётчики:** старт по IntersectionObserver; live-счётчик карты 0→30, счётчики Automation threshold 0.25; cubic ease-out ~1800ms; играют один раз; до триггера финальное значение не показывается.
- **Reveal-on-scroll:** секции с `.reveal` получают `.in` по IntersectionObserver (threshold для About — 0.25); desktop-фолбэк форсит видимость через 1.5с.

## UX & Interaction Patterns

- **Accessibility Floor (базовый, не полный WCAG AA):** семантический HTML, корректный Tab-порядок, клавиатурная навигация интеракций, видимый оранжевый focus-ring (`outline:2px solid #EF7F1A`, offset 3px); ARIA на оверлеях (поповеры/модалка — role/aria + Esc-закрытие); icon-кнопки с `aria-label`. При конфликте a11y с отрисованным пикселем — пиксель приоритетнее (дизайн — источник истины).
- Оверлеи (contact-модалка desktop, поповеры карты) закрываются по Esc и по клику вне/backdrop; contact-модалка ставит `body` scroll-lock.

## Cross-Story Dependencies

- **Epic 1 (Фундамент/оболочка):** страница использует общую shell (header/footer), мобильное шасси (drawer, scroll-lock, reveal-on-scroll) и DS-токены/шрифты. Каркас проекта, роут `/about` и критерий пиксель-приёмки (SM-1) приходят из Epic 1.
- **Epic 2 (Contact-форма):** кнопка «GET IN TOUCH» на desktop монтирует готовый компонент `ContactForm` (модалка); mobile навигирует на `/contact`. About-страница НЕ реализует форму сама.
- Внутри эпика: Story 4.2 (desktop-карта) и Story 4.3 (mobile-список) — две композиции одной секции US Presence; обе рендерятся в DOM, но на вьюпорт активна одна.
