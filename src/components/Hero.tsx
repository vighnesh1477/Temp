import { ChevronDown, Heart } from 'lucide-react'
import { invitation } from '../data'
import './Hero.css'

export interface HeroProps {
  activeData: typeof invitation
}

export function Hero({ activeData }: HeroProps) {
  const { brideAndGroom, heroKicker } = activeData

  const scrollToContent = () => {
    const el = document.getElementById('invitation-message')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="hero" aria-label="Wedding announcement">
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__content">
        <Heart className="hero__heart" size={20} fill="currentColor" strokeWidth={0} data-hero />
        <p className="hero__kicker" data-hero>
          {heroKicker}
        </p>
        <div className="heart-divider heart-divider--dark" data-hero aria-hidden="true">
          <span className="heart-divider__line" />
          <Heart size={9} fill="currentColor" strokeWidth={0} />
          <span className="heart-divider__line" />
        </div>
        <h1 className="hero__names">
          <span className="hero__name script-lg" data-hero>
            {brideAndGroom.first.name}
          </span>
          <span className="hero__amp script-sm" data-hero aria-hidden="true">
            {brideAndGroom.ampersand}
          </span>
          <span className="hero__name script-lg" data-hero>
            {brideAndGroom.second.name}
          </span>
        </h1>
      </div>
      <button type="button" className="hero__scroll" onClick={scrollToContent} data-hero aria-label="Scroll down">
        <span className="hero__scroll-label">Scroll</span>
        <ChevronDown size={18} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </section>
  )
}

export default Hero