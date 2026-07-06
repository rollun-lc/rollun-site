// Story 6.1 — Our Brands (`/brands`). A pure function of `brandsContent`: the
// page holds no strings of its own, it only wires the single content instance
// into the section RSCs in EXACT Handoff order and imports the section
// stylesheet. Header, Footer and RevealOnScroll are rendered by the layout
// (Epic 1) — NOT here.
//
// Both compositions (desktop + mobile) SSR into one DOM inside each section; the
// visible one is chosen ONLY by the 768px CSS media in brands.css. Handoff order:
//   desktop → Hero (01) → BrandCard (02) → Story (03) → Products (04) → CTA (05)
//   mobile  → Hero (01) → BrandCard (02) → Story (03) → Products (04) →
//             Trademark (05, mobile-only) → CTA (06)
// Trademark renders ONLY its mobile subtree, so it slots between Products and CTA
// without adding anything to the desktop composition.
import BrandCard from '@/components/brands/BrandCard'
import CtaSection from '@/components/brands/CtaSection'
import Hero from '@/components/brands/Hero'
import Products from '@/components/brands/Products'
import Story from '@/components/brands/Story'
import Trademark from '@/components/brands/Trademark'
import { buildBrandsContent } from '@/content/brands'
import { getBrandsContent } from '@/lib/brands-content'

import '@/styles/brands.css'

export default async function BrandsPage() {
  const brandsContent = buildBrandsContent(await getBrandsContent())
  return (
    <main>
      <Hero hero={brandsContent.hero} />
      <BrandCard brand={brandsContent.brand} />
      <Story story={brandsContent.story} />
      <Products products={brandsContent.products} />
      <Trademark trademark={brandsContent.trademark} facts={brandsContent.brand.trademark.facts} />
      <CtaSection cta={brandsContent.cta} />
    </main>
  )
}
