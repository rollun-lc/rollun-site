// Contact route (Story 2.1). The RSC stub is replaced with an inline mount of
// the single ContactForm island for a real, verifiable render. The desktop
// modal / mobile-nav display modes and deep-link `?topic=` come in Story 2.4;
// here the form lives in the page flow only.
import ContactForm from '@/components/contact-form/ContactForm.client'

export default function ContactPage() {
  return (
    <main>
      <ContactForm />
    </main>
  )
}
