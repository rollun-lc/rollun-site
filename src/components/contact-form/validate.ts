/**
 * Pure client-side validation for the ContactForm (Story 2.1).
 *
 * No React, no DOM, deterministic — so it is unit-testable in isolation and is
 * the single decision point the island calls on submit. Required-ness and the
 * error wording are NOT duplicated here: they are read from `contactFormContent`
 * (the AD-14 single home of strings), so a field flipping required/optional or a
 * message changing happens in exactly one place.
 *
 * Returns a per-field error map — `{}` means valid. Behaviour follows the spec's
 * I/O matrix: required fields are trimmed before the empty check; a supplied but
 * malformed email is flagged with the email message (an empty email is only a
 * "required" error); the topic placeholder ("") is a "please select a topic".
 *
 * Validates against the SAME `content` the island renders from (passed in;
 * defaults to the singleton) so the field set, required flags and error copy can
 * never diverge between what is shown and what is checked.
 */
import {
  contactFormContent,
  type ContactFormContent,
  type ContactFormValues,
} from '@/content/contact-form'

/** Email shape check (spec regex): non-empty local, `@`, domain with a dot. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(
  values: ContactFormValues,
  content: ContactFormContent = contactFormContent,
): Record<string, string> {
  const errors: Record<string, string> = {}
  const { fields, errorMessages } = content

  // Required fields — trim, then flag empties. Topic gets its own message.
  for (const field of fields) {
    if (!field.required) continue
    const value = (values[field.name] ?? '').trim()
    if (!value) {
      errors[field.name] = field.name === 'topic' ? errorMessages.topic : errorMessages.required
    }
  }

  // Email format — only when something was typed (empty is already "required").
  const email = (values.email ?? '').trim()
  if (email && !EMAIL_RE.test(email)) {
    errors.email = errorMessages.email
  }

  return errors
}
