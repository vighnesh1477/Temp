import { useEffect, useState } from 'react'
import { Building2, CarFront, Gift } from 'lucide-react'
import { arabicInvitation, invitation } from './data'
import { usePrefersReducedMotion } from './utils/helpers'
import { WavyDivider } from './components/Dividers'
import { Open } from './components/Open'
import { Hero } from './components/Hero'
import { InvitationMessage } from './components/InvitationMessage'
import { ScratchCard } from './components/ScratchCard'
import { Carousel } from './components/Carousel'
import { Countdown } from './components/Countdown'
import { ProgramTimeline, PreWeddingEvents } from './components/Timeline'
import { Venue } from './components/Venue'
import { DressCode, InfoSection } from './components/InfoSection'
import { Contact } from './components/Contact'
import { Closing } from './components/Closing'
import { MusicToggle } from './components/MusicToggle'
import { BottomBar } from './components/BottomBar'
import { DesignModal } from './components/DesignModal'
import { GlobalFloralEffects } from './components/GlobalFloralEffects'
import './style.css'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [gateOpen, setGateOpen] = useState(false)
  const [isArabic, setIsArabic] = useState(false)
  const [designModalOpen, setDesignModalOpen] = useState(false)

  const activeData = isArabic ? arabicInvitation : invitation

  // Start at the top and keep browser from restoring scroll behind closed gate
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // Lock page scroll while gate is closed
  useEffect(() => {
    document.body.classList.toggle('no-scroll', !gateOpen)
    return () => document.body.classList.remove('no-scroll')
  }, [gateOpen])

  // Update direction on document
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    document.documentElement.lang = isArabic ? 'ar' : 'en'
  }, [isArabic])

  // Add `.revealed` to [data-reveal] elements as they enter viewport
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'))
    if (reducedMotion) {
      els.forEach((el) => el.classList.add('revealed'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [reducedMotion, isArabic])

  return (
    <div className={`app-root${isArabic ? ' arabic-mode' : ''}`}>
      {/* Top right audio toggle matching all screenshots */}
      <MusicToggle />

      {/* Opening Gate entrance */}
      <Open
        reducedMotion={reducedMotion}
        onOpened={() => setGateOpen(true)}
        label={activeData.gate.tapToOpen}
      />

      {/* Invitation page revealed after gate opening */}
      <div className={`page${gateOpen ? ' page--open' : ''}`}>
        <div className="page__garland page__garland--left" aria-hidden="true" />
        <div className="page__garland page__garland--right" aria-hidden="true" />
        <main className="page__frame">
          <Hero activeData={activeData} />
          <InvitationMessage message={activeData.message} />
          <ScratchCard
            scratch={activeData.scratch}
            wedding={activeData.wedding}
            isArabic={isArabic}
          />
          <WavyDivider />
          <Carousel />
          <WavyDivider />
          <Countdown
            title={activeData.countdownHeading}
            unitLabels={
              isArabic
                ? arabicInvitation.countdownUnits
                : { days: 'DAYS', hours: 'HOURS', minutes: 'MINUTES', seconds: 'SECONDS' }
            }
          />
          <WavyDivider />
          <ProgramTimeline program={activeData.program} />
          <WavyDivider />
          <Venue venue={activeData.venue} isArabic={isArabic} />
          <WavyDivider />
          <DressCode dressCode={activeData.dressCode} />
          <WavyDivider />
          <PreWeddingEvents preWedding={activeData.preWedding} />
          <WavyDivider />
          <InfoSection
            icon={<CarFront size={24} strokeWidth={1.7} />}
            heading={activeData.transportation.heading}
            text={activeData.transportation.text}
            headingId="transport-heading"
          />
          <WavyDivider />
          <InfoSection
            icon={<Building2 size={24} strokeWidth={1.7} />}
            heading={activeData.accommodation.heading}
            text={activeData.accommodation.text}
            headingId="accommodation-heading"
          />
          <WavyDivider />
          <InfoSection
            icon={<Gift size={24} strokeWidth={1.7} />}
            heading={activeData.gifts.heading}
            text={activeData.gifts.text}
            headingId="gifts-heading"
          />
          <WavyDivider />
          <Contact isArabic={isArabic} />
          <Closing closing={activeData.closing} />
        </main>
      </div>

      {/* Floating Bottom Bar with Arabic language switch & Use this Design CTA */}
      <BottomBar
        isArabic={isArabic}
        onToggleArabic={() => setIsArabic((prev) => !prev)}
        onUseDesign={() => setDesignModalOpen(true)}
      />

      {/* "Use this Design" Modal */}
      <DesignModal
        open={designModalOpen}
        onClose={() => setDesignModalOpen(false)}
        isArabic={isArabic}
      />

      {/* Floating floral ambience — drifting petals, click bursts & cursor trails */}
      <GlobalFloralEffects />
    </div>
  )
}