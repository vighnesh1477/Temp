import { useEffect, useMemo, useState } from 'react'
import { invitation } from '../data'
import { SectionHeading } from './Dividers'
import './Countdown.css'

export interface CountdownProps {
  title: string
  unitLabels: { days: string; hours: string; minutes: string; seconds: string }
}

export function Countdown({ title, unitLabels }: CountdownProps) {
  const target = useMemo(() => new Date(invitation.wedding.dateTime).getTime(), [])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const diff = Math.max(0, target - now)
  const units = [
    { value: Math.floor(diff / 86_400_000), label: unitLabels.days },
    { value: Math.floor(diff / 3_600_000) % 24, label: unitLabels.hours },
    { value: Math.floor(diff / 60_000) % 60, label: unitLabels.minutes },
    { value: Math.floor(diff / 1_000) % 60, label: unitLabels.seconds },
  ]

  return (
    <section className="section countdown-section" aria-labelledby="countdown-heading">
      <SectionHeading icon={null} title={title} id="countdown-heading" />
      <div className="countdown" data-reveal role="timer" aria-label="Time until the wedding">
        {units.map((u) => (
          <div className="countdown__cell" key={u.label}>
            <div className="countdown__box">
              <span className="countdown__num">{String(Math.max(0, u.value)).padStart(2, '0')}</span>
            </div>
            <span className="countdown__label">{u.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Countdown
