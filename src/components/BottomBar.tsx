import { Heart } from 'lucide-react'
import './BottomBar.css'

/**
 * Slim credit bar shown at the very end of the invitation, after the
 * closing section. Tapping anywhere on it opens the creator's site
 * (https://vighnesh-red.vercel.app/) in a new tab.
 */
export function BottomBar() {
  return (
    <footer className="bottom-bar" data-reveal>
      <a
        className="bottom-bar__link"
        href="https://vighnesh-red.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Vighnesh's website"
      >
        <span className="bottom-bar__made">Made with</span>
        <Heart
          className="bottom-bar__heart"
          size={10}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="bottom-bar__name">by Vighnesh</span>
      </a>
    </footer>
  )
}

export default BottomBar