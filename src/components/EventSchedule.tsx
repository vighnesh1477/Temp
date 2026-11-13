import React from 'react'
import { CalendarHeart, Clock, MapPin } from 'lucide-react'
import type { EventDay, EventVenue } from '../data'
import { SectionHeading } from './Dividers'
import './EventSchedule.css'

export interface EventScheduleProps {
  icon?: React.ReactNode
  heading: string
  headingId: string
  days: readonly EventDay[]
}

/**
 * Renders a celebration schedule: one block per day, each event with
 * its time, description and a tappable Google Maps venue row.
 */
export function EventSchedule({
  icon = <CalendarHeart size={24} strokeWidth={1.7} />,
  heading,
  headingId,
  days,
}: EventScheduleProps) {
  return (
    <section className="section" aria-labelledby={headingId}>
      <SectionHeading icon={icon} title={heading} id={headingId} />
      <div className="event-schedule" data-reveal>
        {days.map((day) => (
          <div className="event-day" key={day.dateLabel}>
            <h3 className="event-day__date">{day.dateLabel}</h3>
            <div className="event-day__events">
              {day.events.map((event) => (
                <article className="event-card" key={event.title}>
                  <div className="event-card__head">
                    <h4 className="event-card__title">{event.title}</h4>
                    <span className="event-card__time">
                      <Clock size={13} strokeWidth={1.7} aria-hidden="true" />
                      {event.time}
                    </span>
                  </div>
                  <p className="event-card__desc">{event.description}</p>
                  {event.venue && <EventVenueLink venue={event.venue} />}
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export interface EventVenueLinkProps {
  venue: EventVenue
}

/**
 * Venue row linking to Google Maps. When no exact pin (`mapsLink`) has
 * been shared yet, it falls back to a Maps search built from `mapsQuery`.
 */
export function EventVenueLink({ venue }: EventVenueLinkProps) {
  const href =
    venue.mapsLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      venue.mapsQuery,
    )}`

  return (
    <a
      className="event-venue"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open in Google Maps: ${venue.name}, ${venue.address}`}
    >
      <MapPin size={15} strokeWidth={1.7} aria-hidden="true" />
      <span className="event-venue__text">
        <span className="event-venue__name">{venue.name}</span>
        <span className="event-venue__address">{venue.address}</span>
      </span>
    </a>
  )
}

export default EventSchedule