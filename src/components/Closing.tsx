
import { ChevronUp, Heart } from 'lucide-react'
import { invitation } from '../data'
import { WavyDivider } from './Dividers'
import './Closing.css'

export interface ClosingProps {
  closing: typeof invitation.closing
}

export function Closing({ closing }: ClosingProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="closing" aria-label="Closing message">
      <WavyDivider />

      <div className="closing__inner" data-reveal>
        <p className="closing__message script-lg">{closing.message}</p>
        <p className="closing__signature script-sm">{closing.signature}</p>
      </div>

      <WavyDivider />

      <div className="closing__footer" data-reveal>
        <Heart
          size={13}
          fill="currentColor"
          strokeWidth={0}
          aria-hidden="true"
        />

        <span className="closing__footer-names script-sm">
          {closing.signature}
        </span>

        <button
          type="button"
          className="closing__to-top"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
        >
          <ChevronUp size={16} />
          <span>Back to Top</span>
        </button>
      </div>
    </footer>
  )
}

export default Closing
