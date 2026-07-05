---
title: 'Story 2.3 — Анти-спам защита формы (honeypot + серверная проверка)'
type: 'feature'
created: '2026-07-05'
status: 'done'
baseline_revision: '3a3dc255c9a9103e3d1f4ac96cde165d41a440a3'
final_revision: '7d1be37b6ad50c6a55163e94e9045bc2fa20b88b'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
warnings: [oversized]
---

<intent-contract>

## Intent

**Problem:** Единственный путь submit `ContactForm → submitContactForm → CRM` (Story 2.2) не имеет анти-спама: бот, автозаполняющий поля, шлёт мусорный лид в CRM. Epic FR-10 требует отсекать ботов, не добавляя трения живому пользователю.

**Approach:** Встроить классический honeypot в тот же единственный путь: скрытое (off-screen, untabbable, `aria-hidden`) поле-ловушку в форме + серверную проверку в `submitContactForm` ПЕРЕД POST. Заполненный honeypot → тихий сброс (возвращаем success-контракт БЕЗ отправки в CRM, не раскрывая ловушку). Значение honeypot вырезается из тела запроса к CRM. CAPTCHA — задокументированное допущение поверх honeypot, НЕ реализуется сейчас (провайдер TBD, решение владельца).

## Boundaries & Constraints

**Always:**
- Honeypot живёт на ЕДИНОМ пути submit — то же значение течёт через тот же `values`-объект в ту же Server Action (AD-8), не отдельный endpoint.
- Серверная проверка honeypot выполняется в `submitContactForm` ПЕРЕД POST; сработавшая ловушка НЕ отправляет лид в CRM.
- Сработавший honeypot возвращает `{ ok: true }` (тихий сброс) — ответ НЕ раскрывает существование ловушки боту; сброс логируется server-side (`console.warn`, без дампа тела).
- Значение honeypot ВЫРЕЗАЕТСЯ из тела POST к CRM — 6-полёвый контракт тела из Story 2.2 остаётся неизменным.
- Honeypot-поле невидимо и недостижимо табом для человека и AT: off-screen, `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"` → нулевое трение.
- Все новые строки honeypot (`name`/`id`/`label`) живут ТОЛЬКО в `contactFormContent` (AD-14).
- Honeypot НЕ входит в `content.fields` → не рендерится сеткой полей и не валидируется `validateContactForm`.
- Защитный nullish-гвард на значении honeypot (`(values.honeypot ?? '').trim()`) — action публично вызываема, тело может прийти без ключа.

**Block If:**
- Появилось требование добавить реальную CAPTCHA сейчас — выбор провайдера (reCAPTCHA / hCaptcha / Turnstile) и ключи это решение владельца (открытое допущение Epic 2). НЕ выбирать провайдера без человека.
- Потребовалось хранить/логировать тело отклонённых попыток или ввести rate-limit со стейтом — инфра-решение, HALT.

**Never:**
- НЕ реализовывать CAPTCHA (провайдер TBD) — honeypot это поставка Story 2.3; captcha накладывается позже.
- НЕ показывать honeypot пользователю, НЕ делать его табаемым / required / валидируемым.
- НЕ отправлять значение honeypot в CRM.
- НЕ возвращать при сработавшей ловушке ошибку/иной ответ, раскрывающий её боту.
- НЕ менять видимые 6 полей, порядок, список тем, микрокопи и пиксельную вёрстку `.cf-*`.
- НЕ вводить коллекцию `Submissions` / mailer / хранение отклонённых лидов (transit-only держится).
- НЕ добавлять тест-раннер (в проекте его нет; верификация build/lint/manual — как в 2.1/2.2).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Живой пользователь | honeypot = `''`, поля валидны | серверная валидация → POST лида на `CRM_API_URL` БЕЗ ключа honeypot → `{ ok: true }` | как в 2.2 |
| Бот (ловушка сработала) | honeypot непустой | тихий сброс: `console.warn`, возврат `{ ok: true }`, POST НЕ выполняется, валидация полей не запускается | ошибки нет; ловушка не раскрыта |
| Тело CRM | валидная отправка | тело содержит ровно 6 полей (name/email/phone/company/topic/message), honeypot вырезан | n/a |
| Крафт-запрос без ключа | `values` без `honeypot` | `(values.honeypot ?? '').trim()` = `''` → путь как у живого пользователя | nullish-гвард, без throw |
| Восприятие человеком/AT | форма отрендерена | honeypot off-screen + `tabIndex=-1` + `aria-hidden` → не виден, не в таб-порядке, не озвучен | нулевое трение |

</intent-contract>

## Code Map

- `src/content/contact-form.ts` -- ИЗМЕНИТЬ. В `ContactFormValues` добавить `honeypot: string`; в `ContactFormContent` и `contactFormContent` добавить `honeypot: { name, id, label }` (единственный дом строк, AD-14). Пример: `{ name: 'website', id: 'cf-website', label: 'Website' }` — правдоподобное для бота имя.
- `src/components/contact-form/ContactForm.client.tsx` -- ИЗМЕНИТЬ. В `makeInitialValues` инициализировать `values.honeypot = ''`; отрендерить скрытый `.cf-hp` input (обёртка `aria-hidden`), привязанный к `values.honeypot` через `handleChange('honeypot')`, ВНЕ сетки полей — после form-level alert, перед кнопкой.
- `src/components/contact-form/submit.ts` -- ИЗМЕНИТЬ. Проверка honeypot ПЕРВОЙ (до валидации/POST): непустой → `console.warn` + `return { ok: true }`. Перед POST вырезать honeypot из тела: `const { honeypot: _hp, ...lead } = values` → `body: JSON.stringify(lead)`.
- `src/styles/components.css` -- ИЗМЕНИТЬ. Добавить правило `.cf-hp` (off-screen скрытие) рядом с блоком `.cf-*` (после `.cf-error`, ~строка 142). Off-screen (`position:absolute; left:-9999px`), НЕ `display:none` (часть ботов пропускает `display:none`).
- `src/components/contact-form/validate.ts` -- ТОЛЬКО ЧТЕНИЕ. Итерирует `content.fields`; honeypot туда не входит → не валидируется. Не менять.
- `src/app/(site)/contact/page.tsx` -- ТОЛЬКО ЧТЕНИЕ. Монтирует `<ContactForm />` с дефолтами; работает без изменений.
- `rollun_handoff/rollun-web-site/project/Contact.html` -- ТОЛЬКО ЧТЕНИЕ. В прототипе honeypot отсутствует; поле off-screen не влияет на пиксель (AD-13).

## Tasks & Acceptance

**Execution:**
- [x] `src/content/contact-form.ts` -- Добавить `honeypot: string` в тип `ContactFormValues`; добавить поле `honeypot: { name: string; id: string; label: string }` в тип `ContactFormContent` и значение `honeypot: { name: 'website', id: 'cf-website', label: 'Website' }` в `contactFormContent` -- дом строк honeypot (AD-14), правдоподобное имя-приманка.
- [x] `src/components/contact-form/ContactForm.client.tsx` -- В `makeInitialValues` после цикла по полям добавить `values.honeypot = ''`; в JSX формы (после `status === 'error'` alert, перед `<button>`) отрендерить обёртку `<div className="cf-hp" aria-hidden="true">` с `<label htmlFor={content.honeypot.id}>{content.honeypot.label}</label>` и `<input type="text" id={content.honeypot.id} name={content.honeypot.name} value={values.honeypot} onChange={handleChange('honeypot')} tabIndex={-1} autoComplete="off" />` -- скрытая ловушка на едином пути, нулевое трение.
- [x] `src/components/contact-form/submit.ts` -- Первой в теле (до валидации): `if ((values.honeypot ?? '').trim() !== '') { console.warn('submitContactForm: submission rejected by honeypot (anti-spam)'); return { ok: true } }`; в шаге POST вырезать honeypot из тела через `const { honeypot: _honeypot, ...lead } = values` и слать `body: JSON.stringify(lead)` -- сервер-проверка перед CRM, тело CRM без honeypot.
- [x] `src/styles/components.css` -- Добавить `.cf-hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }` рядом с блоком `.cf-*` -- off-screen скрытие ловушки без `display:none`.

**Acceptance Criteria:**
- Given отрендеренная форма, when пользователь смотрит и табает по полям, then honeypot-поле не видно, не в таб-порядке и не озвучивается AT — визуально и по поведению форма идентична Story 2.2 (нулевое трение).
- Given honeypot заполнен (эмуляция бота), when форма сабмитится, then `submitContactForm` НЕ делает POST в CRM, возвращает `{ ok: true }` и логирует сброс server-side — ответ не отличим от обычного успеха.
- Given валидная отправка живого пользователя (honeypot пуст), when submit проходит, then тело POST к CRM содержит ровно 6 исходных полей без ключа `honeypot`, поведение success/reset из 2.2 не изменилось.
- Given `npm run build` и `npm run lint`, when выполнены, then проходят без ошибок и типовых нарушений; `CRM_API_URL` по-прежнему отсутствует в клиентском бандле.

## Spec Change Log

## Review Triage Log

### 2026-07-05 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2: (high 1, medium 1, low 0)
- defer: 0
- reject: 8
- addressed_findings:
  - `[high]` `[patch]` Honeypot `name="website"` / `label="Website"` — распознаваемый браузерами/менеджерами паролей autofill-токен; `autoComplete="off"` ими игнорируется. Автозаполнение у реального пользователя → ловушка «срабатывает» → лид тихо теряется (кнопка показывает фейковый `THANK YOU ✓`), худший провал для формы захвата лида. Исправлено: обёртка honeypot стала `inert` (React 19) — браузер/PW-менеджер/AT не могут взаимодействовать с inert-полем и не заполнят его; поле переименовано с общеизвестного токена на нейтральное `contact_extra` (не autofill-токен, не skip-list honeypot); добавлены `data-1p-ignore` / `data-lpignore`. Field-harvesting POST-бот по-прежнему ловится серверной проверкой.
  - `[medium]` `[patch]` `aria-hidden="true"` вокруг фокусируемого input (`tabIndex=-1`) → нарушение axe `aria-hidden-focus` (WCAG 4.1.2 Name/Role/Value): фокусируемый потомок в `aria-hidden`-поддереве. Исправлено тем же `inert` — он убирает поддерево из фокуса И из дерева доступности (корректный примитив), заменив `aria-hidden`.
- rejected_summary: 8 отклонено. `content.honeypot` без рантайм-гварда — тип `ContactFormContent` теперь ТРЕБУЕТ поле, компилятор enforce'ит для любого кастомного content (как для всех прочих required-полей heading/fields/topics; аналог отклонён в ревью 2.2). Whitespace-only обход `.trim()` — осознанный трейд-офф: trim защищает реального пользователя от случайного пробела (false-positive), а спам-«пробелом» нереалистичен и всё равно проходит серверную валидацию как обычный лид. Отсутствие observability/метрик на тихий сброс — инфра-задача, зафиксирована как residual risk (как «наблюдаемость доставки» в 2.2). Слабость против прямых вызовов Server Action / нет rate-limit / нет CAPTCHA — spec явно: CAPTCHA = open assumption владельца (провайдер TBD), rate-limit = Block-If инфра; honeypot это первый слой-«лежачий полицейский». `left:-9999px` вместо clip-path sr-only — осознанный выбор spec против `display:none` (часть ботов его пропускает), косметика. Controlled-input не ловит нативный `.value`-autofill — nuance эффективности, снят `inert`; основной класс спама (harvest+POST) ловится серверно вне React-стейта. Nit про `_honeypot` в комментарии и unused-var lint — lint уже чист (rest-sibling omission идиоматичен).

### 2026-07-05 — Review pass (follow-up)
- intent_gap: 0
- bad_spec: 0
- patch: 1: (high 0, medium 0, low 1)
- defer: 1
- reject: 17
- addressed_findings:
  - `[low]` `[patch]` Комментарий к `.cf-hp` в `src/styles/components.css` описывал скрытие как «tabIndex=-1 + aria-hidden in the markup», но разметка после патча первого ревью-прохода несёт `inert`-обёртку, а не `aria-hidden` — комментарий утверждал ложь о шиппнутом коде. Исправлено: приведён к факту — «tabIndex=-1 + an `inert` wrapper in the markup»; правка только комментария, поведение не менялось.
- rejected_summary: 17 отклонено. Дедуп между ревьюерами (whitespace-обход = trim-находка; inert-unsupported = inert-находка). Уже отклонено/зафиксировано в первом проходе: whitespace `.trim()`-обход (осознанный трейд-офф — «спам-пробелом» всё равно проходит серверную валидацию как обычный лид), `left:-9999px` vs sr-only (spec-выбор против `display:none`; off-screen negative-left не даёт горизонтального скролла в LTR), наблюдаемость тихого сброса (инфра, уже residual risk), мёртвая controlled-обвязка honeypot-инпута (nuance; реальный класс спама ловится серверно). Spec-явные границы: «zero test coverage» на high (Never-граница — тест-раннера в проекте нет, верификация build/lint/manual как в 2.1/2.2 → выделено в defer, не reject-как-noise и не патч), rate-limit/CAPTCHA (Block-If инфра + открытое допущение владельца, провайдер TBD), `console.warn`-лог-амплификация (тот же инфра-класс, что rate-limit; сам лог — Always-требование spec). Переоценка ревьюером серьёзности `inert`-деградации: неподдерживающий браузер ≠ «pre-fix state» — нейтральное имя `contact_extra` (не autofill-токен) + `autoComplete=off` + `data-1p-ignore`/`data-lpignore` специально закрывают деградированный путь; проект React 19/Next 16 таргетит современные браузеры (inert stable с 2022–23). Проверено кодом и отклонено как неверное/непривнесённое этой историей: `handleChange('honeypot')` НЕ делает lookup по `content.fields` (просто `setValues[name]`) → падения нет; null/undefined `values` → TypeError был и до 2.3 (первым касанием был `validateContactForm(values)`), не привнесён, fail-closed 500; нестроковый honeypot → тип enforce'ит `string` на реальном пути, прямой абьюз fail-closed; лишние ключи в теле CRM → унаследовано из 2.2 (`JSON.stringify(values)`), эта история наоборот УБРАЛА один ключ; honeypot в `ContactFormValues` — осознанный выбор ради единого контракта AD-8 (все 3 режима 2.4), вынос ломает границу; `makeInitialValues` сеет фиксированный ключ типа (TS enforce, дивергенции нет); покрытие PW-менеджеров — фраза комментария, защита многослойна и не зависит от полноты; `_honeypot` unused-var — lint чист (проверено, exit 0). Stale-spec (`aria-hidden` в intent-contract / I/O-матрице / Design Notes): код КОРРЕКТЕН и лучше (inert), не intent_gap (интент «невидимо/нетабаемо/вне a11y-дерева/ноль трения» выполнен), bad_spec-луп ошибочно откатил бы верный код; авторитетные разделы Review Triage Log + Auto Run Result уже фиксируют inert как шиппнутый механизм, intent-contract заморожен протоколом → нотед, не действие.

## Design Notes

**Тихий сброс, не ошибка.** Сработавший honeypot возвращает `{ ok: true }` без POST, а не `{ ok: false }`. Это стандарт honeypot: разный ответ на «поймали»/«не поймали» позволяет боту обнаружить и обойти ловушку. Живой пользователь ловушку не заполняет никогда, поэтому «ложный» success-reset ему не грозит. AC Epic'а («не уходят в CRM», «без трения») выполнены.

**Off-screen, не `display:none`.** Прячем `.cf-hp` off-screen (`left:-9999px`), т.к. некоторые боты игнорируют поля с `display:none`/`hidden`. `tabIndex={-1}` + `aria-hidden` убирают его из таб-порядка и из дерева доступности — человек и скринридер его не встречают.

**Honeypot внутри `values`, контракт AD-8 цел.** Значение течёт в существующем `ContactFormValues`-аргументе — сигнатура `submitContactForm(values)` и тип результата `ContactFormResult` не меняются, все три режима 2.4 продолжают потреблять тот же контракт. Перед POST honeypot вырезается деструктуризацией, поэтому тело к CRM остаётся 6-полёвым (контракт 2.2 неизменен).

**CAPTCHA — допущение, не поставка.** Провайдер (reCAPTCHA/hCaptcha/Turnstile) и ключи — решение владельца (открытое допущение Epic 2). Honeypot достаточен как первый слой; captcha накладывается поверх позже отдельной задачей, блокирует прод-включение, не разработку.

## Verification

**Commands:**
- `npm run build` -- expected: успешная сборка, typecheck без ошибок; `/contact` пререндерится.
- `npm run lint` -- expected: без ошибок ESLint.

**Manual checks:**
- Открыть `/contact`: honeypot-поле не видно на экране; Tab по форме не попадает в него; обёртка `.cf-hp` помечена `inert` (не в фокусе, не в accessibility-дереве, не заполняется автозаполнением).
- В devtools снять `inert` и проставить значение скрытому `input[name=contact_extra]` → сабмит валидной формы: POST в CRM НЕ уходит (network/лог), в консоли сервера — `rejected by honeypot`, форма ведёт себя как при успехе.
- Обычный сабмит (honeypot пуст) с `CRM_API_URL` на mock: в теле запроса ровно 6 полей, ключа `honeypot`/`contact_extra` нет; кнопка `THANK YOU ✓`, reset через ~1.6с.
- Grep: строки honeypot (`contact_extra`/`cf-contact-extra`) встречаются только в `contact-form.ts`; `CRM_API_URL` по-прежнему только в `submit.ts` (server) и `.env*`.

## Auto Run Result

Status: done

**Реализованное изменение:** Story 2.3 (Epic 2) — анти-спам на единственном пути submit `ContactForm → submitContactForm → CRM` (FR-10). В форму встроено скрытое honeypot-поле-ловушка, а `submitContactForm` первой проверкой сбрасывает заполненную ловушку: логирует и возвращает `{ ok: true }` БЕЗ POST в CRM (тихий сброс — ответ не раскрывает ловушку боту). Значение honeypot вырезается из тела запроса к CRM, поэтому 6-полёвый контракт тела из Story 2.2 не изменился. Для живого пользователя нулевое трение: обёртка помечена `inert` (React 19) — вне фокуса, вне дерева доступности, недоступна взаимодействию и автозаполнению. CAPTCHA намеренно НЕ вводится (open assumption владельца, провайдер TBD) — honeypot это первый слой.

**Файлы:**
- `src/content/contact-form.ts` — ИЗМЕНЁН. `honeypot: string` в `ContactFormValues`; `honeypot: { name, id, label }` в `ContactFormContent` + значение `contact_extra`/`cf-contact-extra`/`Additional info` (нейтральное имя, не autofill/skip-list токен). Единственный дом строк (AD-14).
- `src/components/contact-form/ContactForm.client.tsx` — ИЗМЕНЁН. Инициализация honeypot в `makeInitialValues`; скрытый `inert`-input ловушки (после form-level alert, перед кнопкой), привязан к `values.honeypot`; `tabIndex=-1`, `autoComplete=off`, `data-*-ignore`.
- `src/components/contact-form/submit.ts` — ИЗМЕНЁН. Проверка honeypot первой (тихий сброс `{ ok: true }` без POST); honeypot вырезан из тела CRM деструктуризацией (`const { honeypot: _honeypot, ...lead } = values`).
- `src/styles/components.css` — ИЗМЕНЁН. `.cf-hp` off-screen (`left:-9999px`, не `display:none`) рядом с блоком `.cf-*`.

**Разбор ревью (Blind Hunter + Edge Case Hunter):** 2 патча применены. `[high]` honeypot-имя `website` — autofill/PW-manager токен: реальный пользователь мог тихо потерять лид → обёртка стала `inert` (браузер/менеджер не заполнят inert-поле) + переименование на нейтральное `contact_extra` + `data-*-ignore`. `[medium]` `aria-hidden` вокруг фокусируемого input → axe `aria-hidden-focus` (WCAG 4.1.2) → тот же `inert` (убирает из фокуса и дерева доступности, корректный примитив). 8 отклонено: `content.honeypot` enforced типом; whitespace-обход (trim — защита от false-positive); observability тихого сброса (инфра, residual risk); слабость против прямых вызовов action / rate-limit / CAPTCHA (spec open assumption + Block-If инфра); `left:-9999px` (осознанный выбор против `display:none`); controlled-vs-native autofill (nuance, снят inert); nit/lint (уже чист). 0 отложено, 0 intent_gap, 0 bad_spec.

**Верификация:** `npm run lint` — чисто; `npm run build` — `Compiled successfully`, typecheck без ошибок (`inert` валиден в React 19), `/contact` пререндерится как static (11/11). Grep: `CRM_API_URL` только в `submit.ts` (server), отсутствует в `.next/static` (клиентский бандл); строки ловушки только в `contact-form.ts` (AD-14). Прогонялось дважды — после имплементации и после патчей ревью.

**Остаточные риски:** (1) honeypot ловит harvest+POST-ботов, но не защищает публично вызываемую Server Action от целевых прямых вызовов — rate-limit/CAPTCHA (провайдер TBD) это решение владельца, блокирует прод-включение, не разработку. (2) Тихий сброс логируется (`console.warn`) без метрик/алертинга — false-positive невидимы в проде; наблюдаемость это инфра-задача. (3) `inert` снижает долю ловимых интерактивных ботов ради устранения false-positive реального пользователя — осознанный трейд-офф (основной класс спама ловится серверно). (4) Контракт CRM (унаследовано из 2.2) — внешнее допущение владельца.

### Follow-up review (2026-07-05)

Независимый повторный ревью-проход (spec был `done` с `followup_review_recommended: true` из первого прохода) на том же диффе `3a3dc25..07952a4`. Blind Hunter (`bmad-review-adversarial-general`) + Edge Case Hunter (`bmad-review-edge-case-hunter`), оба на Opus, без предварительного контекста.

**Триаж:** 1 patch (low), 1 defer, 17 reject; 0 intent_gap, 0 bad_spec (repair-луп не запускался).
- **Патч (low):** комментарий к `.cf-hp` в `components.css` утверждал «tabIndex=-1 + aria-hidden in the markup», тогда как разметка после патча первого прохода несёт `inert`-обёртку (не `aria-hidden`). Приведён к факту. Правка только комментария — поведение/пиксель не менялись.
- **Defer (1):** отсутствие автотестов на security-логику `submitContactForm` (тихий сброс `{ ok: true }` без POST + вырезание honeypot из тела) — добавлено в `deferred-work.md` НОВОЙ записью (тест-раннера в проекте нет по Never-границе spec; прайм-цель будущего testing-прохода).
- **Reject (17):** дубликаты между ревьюерами; уже отклонённое/зафиксированное в первом проходе (whitespace-trim, `left:-9999px`, наблюдаемость, controlled-обвязка); spec-явные границы (нет тест-раннера, CAPTCHA/rate-limit = решение владельца/инфра); переоценка `inert`-деградации (нейтральное имя + `autoComplete=off` + `data-*-ignore` держат путь без inert; таргет — современные браузеры); проверенные кодом как неверные/непривнесённые 2.3 (handleChange без field-lookup, null/нестроковый `values` fail-closed и не привнесены, лишние ключи унаследованы из 2.2); stale-spec `aria-hidden` (код корректен/лучше — inert; авторитетные разделы уже фиксируют это; intent-contract заморожен протоколом).

**Верификация (после патча):** `npm run lint` — чисто (exit 0); `npm run build` — `Compiled successfully`, TypeScript без ошибок (`inert` валиден в React 19), `/contact` пререндерится static (11/11). Grep: `CRM_API_URL` отсутствует в `.next/static` (клиентский бандл); строки ловушки (`contact_extra`/`cf-contact-extra`) только в `content/contact-form.ts` (AD-14).

**Follow-up review recommendation:** `false` — единственная правка прохода это локальная косметика комментария с нулевым влиянием на пользователя и поведение; независимый повторный ревью не оправдан.

**Остаточные риски:** без изменений относительно первого прохода — (1) honeypot не защищает публично вызываемую Server Action от целевых прямых вызовов (rate-limit/CAPTCHA = решение владельца, провайдер TBD); (2) тихий сброс логируется без метрик/алертинга (инфра); (3) `inert` — первичный механизм нулевого трения, при его отсутствии деградированный путь держат нейтральное имя + `autoComplete=off` + `data-*-ignore`; (4) нет автотестов на submit-логику (вынесено в defer-леджер).
