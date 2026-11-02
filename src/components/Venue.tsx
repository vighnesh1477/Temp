
import { MapPin } from 'lucide-react'
import { invitation } from '../data'
import { SectionHeading } from './Dividers'
import './Venue.css'

export interface VenueProps {
  venue: typeof invitation.venue
}

export function Venue({ venue }: VenueProps) {
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    venue.mapsQuery,
  )}&output=embed`

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${venue.name}, ${venue.mapsQuery}`,
  )}`

  return (
    <section className="section venue-section" aria-labelledby="venue-heading">
      <SectionHeading
        icon={<MapPin size={24} strokeWidth={1.7} />}
        title={venue.heading}
        id="venue-heading"
      />

      <div className="venue" data-reveal>
        <h3 className="venue__name">{venue.name}</h3>
        <p className="venue__address">{venue.address}</p>

        <div className="venue__map-wrap">
          <iframe
            title={`Map showing ${venue.name}`}
            src={embedSrc}
            className="venue__map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <a
            className="btn-primary venue__open-maps"
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin size={14} aria-hidden="true" />
            <span>Open in Maps</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Venue
