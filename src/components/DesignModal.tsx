import { useState } from 'react'
import { CalendarPlus, Check, Copy, Share2, Sparkles, X } from 'lucide-react'
import { invitation } from '../data'
import { icsDate } from '../utils/helpers'
import './DesignModal.css'

export interface DesignModalProps {
  open: boolean
  onClose: () => void
  isArabic: boolean
}

export function DesignModal({ open, onClose, isArabic }: DesignModalProps) {
  const [copied, setCopied] = useState(false)

  if (!open) return null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `You're invited to the Wedding of Zayn & Nora! View our interactive invitation here: ${window.location.href}`,
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const handleExportIcs = () => {
    const start = new Date(invitation.wedding.dateTime)
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Royal Invite//Wedding//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:wedding-${Date.now()}@royal-invite.local`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(start)}`,
      `DTEND:${icsDate(end)}`,
      `SUMMARY:Wedding of ${invitation.closing.signature}`,
      `LOCATION:${invitation.venue.name}\\, ${invitation.venue.address}`,
      `DESCRIPTION:${invitation.message.replace(/\n/g, ' ')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'royal-grace-invitation.ics'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>
        <div className="modal-head">
          <div className="modal-icon">
            <Sparkles size={24} />
          </div>
          <h3 className="modal-title">
            {isArabic ? 'قالب رويال جريس الفاخر' : 'Royal Grace Wedding Template'}
          </h3>
          <p className="modal-subtitle">
            {isArabic
              ? 'دعوة زفاف رقمية تفاعلية مستوحاة من الطراز الملكي الأنيق.'
              : 'A luxury mobile-first wedding invitation featuring gate entrance, scratch card, countdown & RSVP.'}
          </p>
        </div>

        <div className="modal-features">
          <div className="modal-feature-item">
            <Check size={16} />
            <span>{isArabic ? 'بوابة دخول سينمائية بتأثير ذهبي' : 'Cinematic interactive entrance gate'}</span>
          </div>
          <div className="modal-feature-item">
            <Check size={16} />
            <span>{isArabic ? 'كشط تفاعلي لكشف موعد الزفاف' : 'Scratch-to-reveal heart card'}</span>
          </div>
          <div className="modal-feature-item">
            <Check size={16} />
            <span>{isArabic ? 'عد تنازلي مباشر حتى يوم الزفاف' : 'Live real-time countdown timer'}</span>
          </div>
          <div className="modal-feature-item">
            <Check size={16} />
            <span>{isArabic ? 'تأكيد الحضور وخريطة جوجل المدمجة' : 'Google Maps integration & RSVP form'}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-primary modal-action-btn" onClick={handleExportIcs}>
            <CalendarPlus size={16} />
            <span>{isArabic ? 'تحميل تقويم الحفل (.ics)' : 'Download Calendar Event (.ics)'}</span>
          </button>
          <button type="button" className="btn-secondary modal-action-btn" onClick={handleShareWhatsApp}>
            <Share2 size={16} />
            <span>{isArabic ? 'مشاركة عبر واتساب' : 'Share on WhatsApp'}</span>
          </button>
          <button type="button" className="btn-secondary modal-action-btn" onClick={handleCopyLink}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? (isArabic ? 'تم النسخ!' : 'Copied!') : isArabic ? 'نسخ رابط الدعوة' : 'Copy Invitation Link'}</span>
          </button>
        </div>

        <p className="modal-note">
          {isArabic
            ? 'يمكنك تعديل جميع بيانات الزفاف بسهولة عبر ملف src/data.ts'
            : 'Personalize all names, dates, events and photos in src/data.ts.'}
        </p>
      </div>
    </div>
  )
}

export default DesignModal
