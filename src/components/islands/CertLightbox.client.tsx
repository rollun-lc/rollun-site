'use client'

/**
 * CertLightbox (Story 6.1) — the ONLY interactive island on `/brands`, and the
 * ONLY `.lightbox` in the DOM. Mounted exclusively inside the mobile-only
 * Trademark section (`components/brands/Trademark.tsx`), so the desktop
 * composition carries neither the certificate card nor an overlay — reproducing
 * the prototype defect "desktop has no lightbox" (UX-DR16) without a dead
 * duplicate element.
 *
 * Behaviour is ported AS-IS from `Our Brands Mobile.html`:
 *   - click the `.tm-cert` card → open the overlay + scroll-lock `body`
 *     (`document.body.style.overflow`, the ContactModal idiom);
 *   - click the overlay → close + restore scroll;
 *   - NO Escape handler (intentional as-is — the mobile prototype ships none).
 */
import { useEffect, useState } from 'react'

type CertLightboxProps = {
  img: string
  alt: string
  caption: string
  enlargedAlt: string
}

export default function CertLightbox({ img, alt, caption, enlargedAlt }: CertLightboxProps) {
  const [open, setOpen] = useState(false)

  // Scroll-lock while open; cleanup restores it on close/unmount.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div className="tm-cert" id="certCard" onClick={() => setOpen(true)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={alt} loading="lazy" />
        <div className="cap">{caption}</div>
      </div>
      <div
        className={`lightbox${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={enlargedAlt} />
      </div>
    </>
  )
}
