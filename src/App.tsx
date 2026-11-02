import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import { invitation } from './data'
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
import { GlobalFloralEffects } from './components/GlobalFloralEffects'
import './style.css'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [gateOpen, setGateOpen] = useState(false)

  const activeData = invitation

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
  }, [reducedMotion])

  return (
    <div className="app-root">
      {/* Top right audio toggle */}
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
            isArabic={false}
          />

          <WavyDivider />

          <Carousel />

          <WavyDivider />

          <Countdown
            title={activeData.countdownHeading}
            unitLabels={{
              days: 'DAYS',
              hours: 'HOURS',
              minutes: 'MINUTES',
              seconds: 'SECONDS',
            }}
          />

          <WavyDivider />

          <ProgramTimeline program={activeData.program} />

          <WavyDivider />

          <Venue venue={activeData.venue} />

          <WavyDivider />

          <DressCode dressCode={activeData.dressCode} />

          <WavyDivider />

          <PreWeddingEvents preWedding={activeData.preWedding} />

          <WavyDivider />

          <InfoSection
            icon={<Gift size={24} strokeWidth={1.7} />}
            heading={activeData.gifts.heading}
            text={activeData.gifts.text}
            headingId="gifts-heading"
          />

          <WavyDivider />

          <Contact isArabic={false} />

          <Closing closing={activeData.closing} />
        </main>
      </div>

      {/* Floating floral ambience */}
      <GlobalFloralEffects />
    </div>
  )
}