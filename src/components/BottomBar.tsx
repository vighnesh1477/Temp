
import { Globe } from 'lucide-react'
import './BottomBar.css'

export interface BottomBarProps {
  isArabic: boolean
  onToggleArabic: () => void
}

export function BottomBar({
  isArabic,
  onToggleArabic,
}: BottomBarProps) {
  return (
    <div className="floating-bottom-bar">
      <button
        type="button"
        className="btn-pill-lang"
        onClick={onToggleArabic}
        aria-label={
          isArabic
            ? 'Switch to English'
            : 'التحويل إلى اللغة العربية'
        }
      >
        <Globe size={16} aria-hidden="true" />
        <span>{isArabic ? 'English' : 'Arabic'}</span>
      </button>
    </div>
  )
}

export default BottomBar
