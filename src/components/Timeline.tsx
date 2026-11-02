
import { Clock, PartyPopper } from 'lucide-react'
import { invitation } from '../data'
import { SectionHeading } from './Dividers'
import './Timeline.css'

export interface TimelineDay {
  dateLabel: string
  events: readonly {
    time: string
    title: string
    description: string
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
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
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

export function PreWeddingEvents({
  preWedding,
}: {
  preWedding: typeof invitation.preWedding
}) {
  return (
    <section className="section" aria-labelledby="prewedding-heading">
      <SectionHeading
        icon={<PartyPopper size={24} strokeWidth={1.7} />}
        title={preWedding.heading}
        id="prewedding-heading"
      />

      <Timeline days={preWedding.days} />
    </section>
  )
}

export default ProgramTimeline
