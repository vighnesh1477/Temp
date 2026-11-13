import { Clock, MapPin } from 'lucide-react'
import { invitation } from '../data'
import { SectionHeading } from './Dividers'
import './Timeline.css'

export interface TimelineDay {
  dateLabel: string
  events: readonly {
    time: string
    title: string
    description: string
    /** Optional venue — renders a tappable Google Maps row under the event */
    venue?: {
      name: string
      address: string
      mapsQuery: string
      mapsLink: string
    }
  }[]
}

export function Timeline({ days }: { days: readonly TimelineDay[] }) {
  return (
    <div className="timeline" data-reveal>
      {days.map((day) => (
        <div className="timeline__day" key={day.dateLabel}>
          <div className="timeline__date-pill">
            <Clock size={14} aria-hidden="true" />
            <span>{day.dateLabel}</span>
          </div>

          <div className="timeline__events">
            {day.events.map((evt) => (
              <div
                className="timeline__event"
                key={evt.title + evt.time}
              >
                <span className="timeline__dot" aria-hidden="true" />

                <div className="timeline__body">
                  <div className="timeline__time">{evt.time}</div>
                  <h3 className="timeline__title">{evt.title}</h3>

                  {evt.description && (
                    <p className="timeline__desc">{evt.description}</p>
                  )}

                  {evt.venue && <TimelineVenue venue={evt.venue} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Venue row for a single event. Opens the exact Google Maps pin when
 * the family shared one (wedding & sangeet cards), otherwise falls
 * back to a Maps search built from the address (haldi & mehendi).
 */
function TimelineVenue({ venue }: { venue: NonNullable<TimelineDay['events'][number]['venue']> }) {
  const href =
    venue.mapsLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      venue.mapsQuery,
    )}`

  return (
    <a
      className="timeline__venue"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open in Google Maps: ${venue.name}, ${venue.address}`}
    >
      <MapPin size={13} strokeWidth={1.7} aria-hidden="true" />
      <span className="timeline__venue-text">
        <span className="timeline__venue-name">{venue.name}</span>
        <span className="timeline__venue-address">{venue.address}</span>
      </span>
    </a>
  )
}

export function ProgramTimeline({
  program,
}: {
  program: typeof invitation.program
}) {
  return (
    <section className="section" aria-labelledby="program-heading">
      <SectionHeading
        icon={<Clock size={24} strokeWidth={1.7} />}
        title={program.heading}
        id="program-heading"
      />

      <Timeline days={program.days} />
    </section>
  )
}

export default ProgramTimeline