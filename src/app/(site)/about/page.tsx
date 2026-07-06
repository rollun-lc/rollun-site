// Story 4.1 — About (`/about`). A pure function of `aboutContent`: the page holds
// no strings of its own, it only wires the single content instance into the eight
// section RSCs in EXACT Handoff order and imports the section stylesheet. Header,
// Footer and RevealOnScroll are rendered by the layout (Epic 1) — NOT here.
import Approach from '@/components/about/Approach'
import Automation from '@/components/about/Automation'
import CtaSection from '@/components/about/CtaSection'
import Hero from '@/components/about/Hero'
import KeepToShip from '@/components/about/KeepToShip'
import Snapshot from '@/components/about/Snapshot'
import Team from '@/components/about/Team'
import UsPresence from '@/components/about/UsPresence'
import { aboutContent } from '@/content/about'

import '@/styles/about.css'

export default function AboutPage() {
  return (
    <main>
      <Hero hero={aboutContent.hero} />
      <Snapshot snapshot={aboutContent.snapshot} />
      <Approach approach={aboutContent.approach} />
      <Automation automation={aboutContent.automation} />
      <KeepToShip keeptoship={aboutContent.keeptoship} />
      <UsPresence usPresence={aboutContent.usPresence} />
      <Team team={aboutContent.team} />
      <CtaSection cta={aboutContent.cta} />
    </main>
  )
}
