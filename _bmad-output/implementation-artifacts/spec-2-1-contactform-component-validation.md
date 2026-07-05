---
title: 'Story 2.1 — Единый компонент ContactForm с клиентской валидацией'
type: 'feature'
created: '2026-07-05'
status: 'done'
baseline_revision: 'e61f8f0bf97b21ab9d6c16a9e65fa5689e224742'
final_revision: '1a65764383b139c0d8b019be383d80e30db3f549'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
warnings: [oversized]
---

<intent-contract>

## Intent

**Problem:** У сайта нет формы захвата лида. Epic 2 требует ровно один компонент `ContactForm` — фундамент для CRM-отправки (2.2), анти-спама (2.3) и трёх режимов показа (2.4). Story 2.1 создаёт сам компонент с полями и клиентской валидацией; прототип формы валидации не имеет вовсе, поэтому валидация — намеренное дополнение поверх пиксель-точной вёрстки, продиктованное AC/FR-9.

**Approach:** Собрать client-островок `ContactForm` (`components/contact-form/`) — `<form id="contactForm">` с 6 полями в фиксированном порядке, select тем фикс-списком, `.cf-*` токенами по прототипу и клиентской валидацией (обязательные поля, формат email, выбор темы) с инлайн-ошибками. Контент/микрокопи — из content-модуля. Реальная отправка, инфо-панель, модалка и deep-link — вне scope (2.2/2.4); компонент оставляет для них чистый шов.

## Boundaries & Constraints

**Always:**
- Ровно ОДИН компонент `ContactForm` в `src/components/contact-form/`, client-островок (`'use client'`), контент получает пропсами (default — инстанс из `src/content/contact-form.ts`), сам не фетчит (AD-1/AD-4).
- Поля строго в порядке и с точными label/`name`/`id`/`type`/`autocomplete` из прототипа: `Your Name`(name/text), `Your Email`(email/email), `Phone Number`(phone/tel), `Company`(company/text), `Question Topic`(topic/select), `Your Message`(message/textarea). Кнопка сабмита — литерал `ASK A QUESTION` через существующие `.btn.btn-or`.
- Select тем — фикс-список в точном порядке: `Select a topic` (value="", disabled, selected) · `Wholesale & distribution` · `Partnership` · `Marketplace operations` · `Returns & support` · `Other`.
- Визуал полей/фокуса — по `.cf-*` токенам, значения гвоздями из прототипа (`Contact.html`); при конфликте пиксель приоритетнее a11y (AD-13). DS-токены (`--color-or`, `--color-ink`, `--shadow-input-focus`, `--font-display/body`) из Story 1.2 переиспользуются, не дублируются.
- Клиентская валидация на сабмите (`noValidate` + JS): обязательные поля непустые, email соответствует regex, тема выбрана (не placeholder). Невалидно → инлайн-ошибки + фокус на первое невалидное поле + блок отправки. Валидно → `preventDefault` и вызов опционального пропа `onValidSubmit(data)` (шов для 2.2); по умолчанию отправки нет.
- Контент англоязычный; вся микрокопи и сообщения об ошибках живут единственным домом в `src/content/contact-form.ts` (AD-14).
- Логика валидации — чистая функция в отдельном модуле (`validate.ts`), без React, детерминированная и покрытая I/O-матрицей.

**Block If:**
- (Ничего из scope 2.1 не требует человека. Контракт CRM/endpoint — забота 2.2, здесь не касаемся.)

**Never:**
- Никакой реальной отправки, Server Action, обращения к CRM/env, состояний success/`THANK YOU ✓`/reset-таймера (это Story 2.2).
- Никакой инфо-панели `.cf-info`, двухколоночной `.contact-card`, модалки/`role=dialog`/scroll-lock, deep-link `?topic=`/`.cf-prefilled`/автоскролла/автофокуса, mobile-навигации (это Story 2.4).
- Никакого honeypot/анти-спама (Story 2.3).
- Не хранить лид, не добавлять коллекцию `Submissions`, mailer, тесты-раннеры или новые зависимости.
- Не менять `src/styles/theme.css` (DS-токены — дом Story 1.2); `.cf-*` добавляются только в `components.css`.

## I/O & Edge-Case Matrix

Вход — объект значений формы; выход — карта ошибок по полям (`{}` = валидно). Проверяется чистой `validateContactForm(values)`.

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Все валидно | name, email (валидный), topic (из списка), message заполнены; phone/company любые | `{}` — ошибок нет; форма считается валидной | — |
| Пустое обязательное | одно из name/email/topic/message пустое (trim) | ключ поля → сообщение "This field is required" (для topic — "Please select a topic") | Блок сабмита |
| Кривой email | email = `foo@`, `foo`, `a@b`, `a b@c.d` | `email` → "Enter a valid email address" | Блок сабмита |
| Тема-placeholder | topic = "" (не выбрана) | `topic` → "Please select a topic" | Блок сабмита |
| Только пробелы | name = "   " | `name` → required (trim перед проверкой) | Блок сабмита |
| Опциональные пусты | phone="" и company="" при валидных обязательных | `{}` — phone/company не обязательны | — |
| Множественные ошибки | пустые name и email | оба ключа присутствуют; фокус ставится на первое по порядку полей (name) | Блок сабмита |

</intent-contract>

## Code Map

- `src/content/contact-form.ts` -- НОВЫЙ. Content-модуль: типы (`ContactField`, `TopicOption`, `ContactFormContent`), массив полей (label/name/id/type/autocomplete/required), фикс-список тем, микрокопи (heading `Send us a message`, submit `ASK A QUESTION`), тексты ошибок. Единственный дом строк.
- `src/components/contact-form/validate.ts` -- НОВЫЙ. Чистая `validateContactForm(values): Record<string,string>` + email-regex. Без React.
- `src/components/contact-form/ContactForm.client.tsx` -- НОВЫЙ. Client-островок: рендер `<form id="contactForm" class="cf-form" noValidate>` из контент-пропсов, `useState` для values+errors, `onSubmit` → валидация → ошибки/фокус либо `onValidSubmit`.
- `src/styles/components.css` -- ИЗМЕНИТЬ. Добавить в `@layer components` блок `.cf-*` (`.cf-row`, `.cf-field`, `.cf-field.full`, label, input/select/textarea, `:focus`, `.cf-field.error`, `.cf-error`).
- `src/app/(site)/contact/page.tsx` -- ИЗМЕНИТЬ. Смонтировать `<ContactForm />` инлайн в потоке страницы (базовый рендер для верификации; модалка/deep-link — 2.4).
- `src/styles/theme.css` -- ТОЛЬКО ЧТЕНИЕ. Источник токенов `--color-or/ink`, `--shadow-input-focus`, `--font-display/body`, `--radius`.
- `rollun_handoff/rollun-web-site/project/Contact.html` -- ТОЛЬКО ЧТЕНИЕ. Пиксель-эталон разметки/`.cf-*` значений/списка тем/микрокопи.

## Tasks & Acceptance

**Execution:**
- [x] `src/content/contact-form.ts` -- Объявить типы и экспортировать инстанс `contactFormContent`: 6 полей (порядок/label/name/id/type/autocomplete, `required: true` для name/email/topic/message, `false` для phone/company), список тем (точные строки, включая disabled placeholder), микрокопи и сообщения ошибок -- единственный дом всех строк (AD-14).
- [x] `src/components/contact-form/validate.ts` -- Реализовать чистую `validateContactForm` по I/O-матрице: trim обязательных, email regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`, topic ≠ "" -- логика тестируема без React.
- [x] `src/components/contact-form/ContactForm.client.tsx` -- Client-островок: рендер формы из `contactFormContent` (проп с дефолтом), контролируемые поля, на submit — `validateContactForm`; при ошибках выставить `errors`, `aria-invalid`, фокус первого невалидного поля, блок; при валидности — `preventDefault` + опциональный `onValidSubmit(values)` -- шов для CRM-отправки 2.2.
- [x] `src/styles/components.css` -- Добавить `.cf-*` классы с точными значениями прототипа (label Poppins 14/500 mb8; input/select/textarea Roboto 15px, padding 13px 15px, border 1px `#cfcfcf`, radius 6px, белый фон; focus → border `--color-or` + `--shadow-input-focus`; textarea min-height 150px resize:vertical; `.cf-row` grid 1fr/1fr gap24 mb22, `.cf-field.full` span; `.cf-field.error` красный бордер + `.cf-error` мелкий красный текст) -- визуальный контракт полей.
- [x] `src/app/(site)/contact/page.tsx` -- Заменить stub на рендер `<main>` с инлайн `<ContactForm />` -- делает компонент реальным и верифицируемым.

**Acceptance Criteria:**
- Given `/contact`, when страница отрендерена, then присутствует ровно один `<form id="contactForm">` с 6 полями в точном порядке и label/`name`, select тем фикс-списком в заданном порядке с disabled-плейсхолдером `Select a topic`, и кнопкой `ASK A QUESTION`.
- Given форма с пустыми/невалидными обязательными полями, when жму `ASK A QUESTION`, then отправка блокируется, показываются инлайн-ошибки у соответствующих полей, фокус уходит на первое невалидное поле, `onValidSubmit` НЕ вызывается.
- Given все обязательные поля валидны (email по формату, тема выбрана), when сабмит, then ошибок нет и вызывается `onValidSubmit(values)` (в 2.1 без реальной отправки).
- Given любое поле в фокусе, when оно активно, then бордер оранжевый (`--color-or`) + `box-shadow` `--shadow-input-focus`, визуал совпадает с прототипом.
- Given `npm run build` и `npm run lint`, when выполнены, then проходят без ошибок и типовых нарушений.

## Spec Change Log

<!-- Append-only. Populated by step-04 during review loops. Empty until the first bad_spec loopback. -->

## Review Triage Log

### 2026-07-05 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2: (high 0, medium 1, low 1)
- defer: 2
- reject: 11
- addressed_findings:
  - `[medium]` `[patch]` Ошибки поля не сбрасывались при исправлении (красный бордер/текст висели до следующего сабмита) — теперь `handleChange` очищает ошибку поля по мере ввода.
  - `[low]` `[patch]` `validateContactForm` валидировал против глобального синглтона, игнорируя проп `content` — теперь принимает `content` (дефолт — синглтон) и валидирует ровно то, что рендерится.

## Design Notes

**Валидация — намеренно сверх прототипа.** `Contact.html` не имеет ни `required`, ни regex, ни сообщений (JS лишь меняет текст кнопки). AC/FR-9 требуют клиентскую валидацию, поэтому 2.1 добавляет её, сохраняя вёрстку пиксель-точной. Форма ставит `noValidate` и валидирует в JS, чтобы контролировать единый вид ошибок.

**Обязательность полей (допущение, не блокер).** AC говорит «обязательные поля заполнены», не перечисляя их. Стандарт B2B-лид-формы: обязательны `Your Name`, `Your Email`, `Question Topic`, `Your Message`; `Phone Number` и `Company` — опциональны. Зафиксировано в content-модуле (`required` на поле), при необходимости меняется одним местом.

**Ошибочный визуал — минимальный, вне палитры бренда.** Прототип не имеет error-стиля. Используем локальный литерал (напр. `#d64545`) в `components.css`, НЕ добавляя брендовый токен в `theme.css`. `aria-invalid`/`aria-describedby` — дёшево и не влияет на пиксель.

**Бордер поля.** Прототип использует сплошной `#cfcfcf`; проектный `--color-line` = `rgba(31,31,31,0.12)` — иной. Для точности брать литерал `#cfcfcf`.

**Шов для 2.2/2.4.** Проп `onValidSubmit?: (values) => void` — точка входа для Server Action (2.2). Инфо-панель, `.contact-card`, модалка и deep-link НЕ реализуются — 2.4 оборачивает готовый `ContactForm`.

Пример сигнатуры:
```ts
export function validateContactForm(v: ContactFormValues): Record<string, string>
// {} => валидно; иначе {name?:msg, email?:msg, topic?:msg, message?:msg}
```

## Verification

**Commands:**
- `npm run build` -- expected: успешная сборка, typecheck без ошибок (валидация типобезопасна).
- `npm run lint` -- expected: без ошибок ESLint.

**Manual checks:**
- Открыть `/contact`: видны 6 полей в порядке, select с 6 опциями (плейсхолдер disabled), кнопка `ASK A QUESTION`.
- Пустой сабмит → инлайн-ошибки у name/email/topic/message, фокус на `Your Name`, отправки нет.
- Ввести `foo@` в email + заполнить остальное → ошибка только у email.
- Заполнить всё валидно, тему выбрать → ошибок нет (проверить через временный `onValidSubmit`/лог, что путь валиден).
- Фокус любого поля → оранжевый бордер + мягкое свечение, совпадает с прототипом.

## Auto Run Result

Status: done

**Реализованное изменение:** Собран единый client-островок `ContactForm` (Story 2.1, Epic 2) — `<form id="contactForm">` с 6 фиксированными полями в порядке прототипа, select тем фикс-списком, `.cf-*` токенами пиксель-в-пиксель по `Contact.html` и клиентской валидацией (обязательные поля, формат email, выбор темы) с инлайн-ошибками, `aria-invalid`/`aria-describedby` и фокусом на первое невалидное поле. Валидация — намеренное дополнение поверх прототипа (у него валидации нет), продиктованное AC/FR-9. Реальная отправка/инфо-панель/модалка/deep-link оставлены за швом для 2.2/2.4 (проп `onValidSubmit`).

**Файлы:**
- `src/content/contact-form.ts` — НОВЫЙ. Единственный дом строк (AD-14): типы + `contactFormContent` (поля, темы, микрокопи, тексты ошибок).
- `src/components/contact-form/validate.ts` — НОВЫЙ. Чистая `validateContactForm(values, content)` — trim обязательных, email-regex, topic ≠ placeholder.
- `src/components/contact-form/ContactForm.client.tsx` — НОВЫЙ. Островок: контролируемые поля, валидация на сабмите, сброс ошибки по вводу, шов `onValidSubmit`.
- `src/styles/components.css` — ИЗМЕНЁН. Блок `.cf-*` в `@layer components` (точные значения прототипа на DS-токенах + error-стиль + collapse ≤768px).
- `src/app/(site)/contact/page.tsx` — ИЗМЕНЁН. Инлайн-монтаж `<ContactForm />` для реального рендера/верификации.

**Разбор ревью:** 2 патча применены (medium: сброс ошибки поля по вводу; low: валидатор теперь читает проп `content`). 2 отложено в `deferred-work.md` (глобальные DOM-id → коллизии при мультимонтаже 2.4; a11y-огрехи error-UX сверх прототипа). 11 отклонено (by-design пиксель-фидельность `#cfcfcf`/spacing, запрет трогать `theme.css`, отправка — забота 2.2, спекулятивные 2.4-находки, косметика).

**Верификация:** `npm run lint` — чисто; `npm run build` — `Compiled successfully`, `Finished TypeScript` без ошибок, `/contact` пререндерится как static. Прогонялось дважды: после имплементации и после патчей ревью.

**Остаточные риски:** (1) DOM-id-контракт нужно перевести на `useId` до мультимонтажа в 2.4 (отложено). (2) a11y error-announcement/`aria-required`/heading-order — отложенный фокус-пасс. (3) Прод-включение пути «форма → CRM» блокируется внешним контрактом CRM (Story 2.2), к 2.1 не относится.
