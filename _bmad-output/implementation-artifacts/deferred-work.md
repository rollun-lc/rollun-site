# Deferred Work

Items surfaced incidentally during review, deferred for later focused attention.

- source_spec: `spec-1-2-design-system-tokens-fonts-buttons.md`
  summary: `src/app/(site)/layout.tsx` sets `<html lang="ru">` but the site content is English (all prototypes EN, US B2B, Epic 2 form English) — should be `lang="en"`.
  evidence: Pre-existing from Story 1.1 scaffold; surfaced by review's Cyrillic-subset findings. Latin-only font subsets are correct for English content; the `lang` attribute is a separate a11y/SEO correctness bug, out of scope for the DS-tokens story.

- source_spec: `spec-1-3-header-desktop-mobile.md`
  summary: No "skip to content" bypass link before the persistent site nav — keyboard users must tab through all 6 nav links on every one of the 6 routes (WCAG 2.4.1 Bypass Blocks, level A).
  evidence: Real, but cross-cutting: a proper skip link needs a stable `<main id>` landmark target and a shell-level decision on page/main structure (the layout renders `{children}` directly, pages own their own markup). Not local to the header diff — belongs to a focused shell/a11y pass, not a header follow-up patch.

- source_spec: `spec-1-3-header-desktop-mobile.md`
  summary: No `prefers-reduced-motion` handling for the header's scroll-reactive motion (height shrink + `translateY(-100%)` hide slide + box-shadow); WCAG 2.3.3 vestibular concern.
  evidence: Real, but better solved DS-wide than header-only: Story 1.5 adds reveal-on-scroll (more motion needing the same treatment) and theme.css already tokenizes motion. A header-scoped patch would be a fragmented half-measure; warrants one DS-level `@media (prefers-reduced-motion: reduce)` policy pass. Prototype has none, so this is a deliberate a11y enhancement beyond faithful reproduction.
