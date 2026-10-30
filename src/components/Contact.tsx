import { PhoneCall } from 'lucide-react'
import { SectionHeading } from './Dividers'
import './Contact.css'

interface ContactPerson {
  name: string
  role: string
  /** Number shown on screen */
  display: string
  /** Raw number used for the tap-to-call link */
  tel: string
}

const PEOPLE_EN: ContactPerson[] = [
  { name: 'Harshith', role: 'Groom', display: '+91 8748939923', tel: '+918748939923' },
  { name: 'Deepak', role: 'Brother', display: '+91 8197372508', tel: '+918197372508' },
  { name: 'Sanjana', role: 'Sister-in-law', display: '+91 9449615964', tel: '+919449615964' },
]

const PEOPLE_AR: ContactPerson[] = [
  { name: 'هارشيث', role: 'العريس', display: '+91 8748939923', tel: '+918748939923' },
  { name: 'ديباك', role: 'الأخ', display: '+91 8197372508', tel: '+918197372508' },
  { name: 'سانجانا', role: 'زوجة الأخ', display: '+91 9449615964', tel: '+919449615964' },
]

const COPY = {
  en: { kicker: 'For any queries, with love', heading: 'Please Contact' },
  ar: { kicker: 'لأي استفسار، مع كل الحب', heading: 'يرجى التواصل' },
}

/**
 * "Please Contact" card — replaces the old RSVP form. Lists the family
 * members guests can call with tap-to-call links, bilingual EN/AR.
 */
export function Contact({ isArabic }: { isArabic: boolean }) {
  const t = isArabic ? COPY.ar : COPY.en
  const people = isArabic ? PEOPLE_AR : PEOPLE_EN

  return (
    <section className="section contactus-section" aria-labelledby="contactus-heading">
      <SectionHeading
        icon={<PhoneCall size={24} strokeWidth={1.7} />}
        title={t.heading}
        id="contactus-heading"
      />
      <p className="contactus__kicker" data-reveal>
        {t.kicker} ❤
      </p>
      <div className="contactus" data-reveal>
        {people.map((p) => (
          <div className="contactus__row" key={p.tel}>
            <span className="contactus__avatar" aria-hidden="true">
              {p.name.charAt(0)}
            </span>
            <span className="contactus__who">
              <span className="contactus__name">{p.name}</span>
              <span className="contactus__role">{p.role}</span>
            </span>
            <a className="contactus__phone" href={`tel:${p.tel}`}>
              <PhoneCall size={14} strokeWidth={1.8} aria-hidden="true" />
              <span dir="ltr">{p.display}</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Contact