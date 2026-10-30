import React from 'react'
import { Shirt } from 'lucide-react'
import { invitation, arabicInvitation } from '../data'
import { SectionHeading } from './Dividers'
import './InfoSection.css'

export interface DressCodeProps {
  dressCode: typeof invitation.dressCode | typeof arabicInvitation.dressCode
}

export function DressCode({ dressCode }: DressCodeProps) {
  return (
    <section className="section" aria-labelledby="dresscode-heading">
      <SectionHeading icon={<Shirt size={24} strokeWidth={1.7} />} title={dressCode.heading} id="dresscode-heading" />
      <div className="dress-code" data-reveal>
        {dressCode.groups.map((g) => (
          <div className="dress-code__group" key={g.label}>
            <h3 className="dress-code__label">{g.label}</h3>
            <span className="dress-code__rule" aria-hidden="true" />
            <p className="dress-code__desc">{g.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export interface InfoSectionProps {
  icon: React.ReactNode
  heading: string
  text: string
  headingId: string
}

export function InfoSection({ icon, heading, text, headingId }: InfoSectionProps) {
  return (
    <section className="section" aria-labelledby={headingId}>
      <SectionHeading icon={icon} title={heading} id={headingId} />
      <p className="info-text" data-reveal>
        {text}
      </p>
    </section>
  )
}

export default InfoSection
