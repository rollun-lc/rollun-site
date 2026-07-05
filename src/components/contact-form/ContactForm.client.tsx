'use client'

/**
 * ContactForm — the single lead-capture island (Story 2.1, Epic 2 AD-8). One
 * `<form id="contactForm">` with the 6 fixed fields, the fixed topic select and
 * client-side validation. Content arrives by prop (default: `contactFormContent`)
 * — the island never fetches (AD-1/AD-4).
 *
 * Pixel-faithful to the prototype (Contact.html) via the `.cf-*` classes in
 * components.css; the validation is a DELIBERATE addition on top (the prototype
 * has none) demanded by the AC/FR-9. The form carries `noValidate` and validates
 * in JS so the error presentation is single-sourced.
 *
 * On submit we run the pure `validateContactForm`. If it returns errors we set
 * them (rendering inline `.cf-error` messages + `.cf-field.error` borders +
 * `aria-invalid`/`aria-describedby`), focus the FIRST invalid field in field
 * order, and block — `onValidSubmit` is NOT called. If valid we `preventDefault`
 * and call the optional `onValidSubmit(values)` — the clean seam for Story 2.2's
 * CRM Server Action. There is no real send in 2.1 (Never boundary).
 *
 * The two-column info panel, modal, deep-link `?topic=` and success state are
 * OUT of scope here (Stories 2.2 / 2.4) — this island renders inline only.
 */
import { useRef, useState } from 'react'

import {
  contactFormContent,
  type ContactField,
  type ContactFormContent,
  type ContactFormValues,
} from '@/content/contact-form'
import { validateContactForm } from './validate'

type ContactFormProps = {
  /** Content contract (labels / topics / microcopy / error strings). */
  content?: ContactFormContent
  /** Seam for Story 2.2 — invoked with the values only when validation passes. */
  onValidSubmit?: (values: ContactFormValues) => void
}

/** All fields start empty — keeps the controlled inputs in sync with the values. */
function makeInitialValues(fields: ContactField[]): ContactFormValues {
  const values = {} as ContactFormValues
  for (const field of fields) values[field.name] = ''
  return values
}

/**
 * Group fields into `.cf-row`s the way the prototype does: a `full` field is its
 * own row; other fields pair up two-per-row (name+email, phone+company).
 */
function toRows(fields: ContactField[]): ContactField[][] {
  const rows: ContactField[][] = []
  let pair: ContactField[] = []
  for (const field of fields) {
    if (field.full) {
      if (pair.length) {
        rows.push(pair)
        pair = []
      }
      rows.push([field])
    } else {
      pair.push(field)
      if (pair.length === 2) {
        rows.push(pair)
        pair = []
      }
    }
  }
  if (pair.length) rows.push(pair)
  return rows
}

export default function ContactForm({ content = contactFormContent, onValidSubmit }: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(() => makeInitialValues(content.fields))
  const [errors, setErrors] = useState<Record<string, string>>({})
  // DOM handles for focusing the first invalid field (not tied to render).
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({})

  function handleChange(name: keyof ContactFormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [name]: e.target.value }))
      // Clear this field's error as the user corrects it, so the red border and
      // message don't linger falsely until the next submit.
      setErrors((prev) => {
        if (!prev[name]) return prev
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nextErrors = validateContactForm(values, content)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      // Focus the first invalid field in field order (not object-key order).
      const firstInvalid = content.fields.find((field) => nextErrors[field.name])
      if (firstInvalid) fieldRefs.current[firstInvalid.name]?.focus()
      return
    }

    onValidSubmit?.(values)
  }

  const rows = toRows(content.fields)

  return (
    <form id="contactForm" className="cf-form" noValidate onSubmit={handleSubmit}>
      <h3>{content.heading}</h3>

      {rows.map((row, i) => (
        <div className="cf-row" key={i}>
          {row.map((field) => {
            const message = errors[field.name]
            const errorId = `${field.id}-error`
            const fieldClass = ['cf-field', field.full && 'full', message && 'error']
              .filter(Boolean)
              .join(' ')

            const shared = {
              id: field.id,
              name: field.name,
              value: values[field.name],
              onChange: handleChange(field.name),
              'aria-invalid': message ? true : undefined,
              'aria-describedby': message ? errorId : undefined,
            } as const

            return (
              <div className={fieldClass} key={field.name}>
                <label htmlFor={field.id}>{field.label}</label>

                {field.control === 'select' ? (
                  <select
                    {...shared}
                    ref={(el) => {
                      fieldRefs.current[field.name] = el
                    }}
                  >
                    {content.topics.map((topic) => (
                      <option key={topic.label} value={topic.value} disabled={topic.disabled}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                ) : field.control === 'textarea' ? (
                  <textarea
                    {...shared}
                    ref={(el) => {
                      fieldRefs.current[field.name] = el
                    }}
                  />
                ) : (
                  <input
                    {...shared}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    ref={(el) => {
                      fieldRefs.current[field.name] = el
                    }}
                  />
                )}

                {message ? (
                  <span className="cf-error" id={errorId}>
                    {message}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      ))}

      <button type="submit" className="btn btn-or">
        {content.submitLabel}
      </button>
    </form>
  )
}
