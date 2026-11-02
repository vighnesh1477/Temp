import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { invitation } from '../data'
import { SectionHeading } from './Dividers'
import './Countdown.css'

export interface CountdownProps {
  title: string
  unitLabels: {
    days: string
    hours: string
    minutes: string
    seconds: string
  }
}

const WEDDING_TIME = new Date(invitation.wedding.dateTime).getTime()

function getTimeLeft() {
  const totalSeconds = Math.max(0, Math.floor((WEDDING_TIME - Date.now()) / 1000))
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

/** Heart shape in a 100×92 box — the number sits in the wide body of the heart */
const HEART_PATH =
  'M50 88 C27 70 6 52 6 30 C6 15 17 5 30 5 C38 5 46 10 50 18 ' +
  'C54 10 62 5 70 5 C83 5 94 15 94 30 C94 52 73 70 50 88 Z'

export function Countdown({ title, unitLabels }: CountdownProps) {
  const [left, setLeft] = useState(getTimeLeft)

  useEffect(() => {
    const id = window.setInterval(() => setLeft(getTimeLeft()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const units = [
    { value: left.days, label: unitLabels.days },
    { value: left.hours, label: unitLabels.hours },
    { value: left.minutes, label: unitLabels.minutes },
    { value: left.seconds, label: unitLabels.seconds },
  ]

  return (
    <section className="section countdown-section" aria-labelledby="countdown-heading">
      <SectionHeading
        icon={<Heart size={24} strokeWidth={1.7} style={{ color: '#C97F88' }} />}
        title={title}
        id="countdown-heading"
      />

      <div className="countdown" data-reveal>
        {/* one shared blush gradient for all four hearts */}
        <svg className="countdown__defs" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="cd-heart-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FDEFF0" />
              <stop offset="0.5" stopColor="#F6D7DA" />
              <stop offset="1" stopColor="#E9B9BE" />
            </linearGradient>
          </defs>
        </svg>

        {units.map(({ value, label }) => (
          <div className="countdown__cell" key={label}>
            <svg
              className="countdown__heart"
              viewBox="0 0 100 92"
              role="img"
              aria-label={`${value} ${label}`}
              focusable="false"
            >
              <path
                d={HEART_PATH}
                fill="url(#cd-heart-grad)"
                stroke="rgba(194, 161, 91, 0.75)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <text
                className="countdown__num"
                x="50"
                y="41"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {String(value).padStart(2, '0')}
              </text>
            </svg>
            <p className="countdown__label">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Countdown