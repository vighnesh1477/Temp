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

interface ContactGroup {
  label: string
  people: ContactPerson[]
}

const GROUPS_EN: ContactGroup[] = [
  {
    label: "Groom's Family",
    people: [
      { name: 'Harshith', role: 'Groom', display: '+91 8748939923', tel: '+918748939923' },
      { name: 'Deepak', role: 'Brother', display: '+91 8197372508', tel: '+918197372508' },
      { name: 'Sanjana', role: 'Sister-in-law', display: '+91 9449615964', tel: '+919449615964' },
    ],
  },
  {
    label: "Bride's Family",
    people: [
      { name: 'Shreya', role: 'Bride', display: '+91 9535014409', tel: '+919535014409' },
      { name: 'Mohandas', role: 'Father', display: '+91 9880810869', tel: '+919880810869' },
      { name: 'Subhash', role: 'Uncle', display: '+91 9535594675', tel: '+919535594675' },
    ],
  },
]

const GROUPS_AR: ContactGroup[] = [
  {
    label: 'عائلة العريس',
    people: [
      { name: 'هارشيث', role: 'العريس', display: '+91 8748939923', tel: '+918748939923' },
      { name: 'ديباك', role: 'الأخ', display: '+91 8197372508', tel: '+918197372508' },
      { name: 'سانجانا', role: 'زوجة الأخ', display: '+91 9449615964', tel: '+919449615964' },
    ],
  },
  {
    label: 'عائلة العروس',
    people: [
      { name: 'شريا', role: 'العروس', display: '+91 9535014409', tel: '+919535014409' },
      { name: 'موهانداس', role: 'الأب', display: '+91 9880810869', tel: '+919880810869' },
      { name: 'سوبهاش', role: 'العم', display: '+91 9535594675', tel: '+919535594675' },
    ],
  },
]

const COPY = {
  en: { kicker: 'For any queries, with love', heading: 'Please Contact' },
  ar: { kicker: 'لأي استفسار، مع كل الحب', heading: 'يرجى التواصل' },
}

/**
 * "Please Contact" card — the groom's family and the bride's family
 * are shown as two labelled groups. Every member has a tap-to-call
 * link, bilingual EN/AR.
 */
export function Contact({ isArabic }: { isArabic: boolean }) {
  const t = isArabic ? COPY.ar : COPY.en
  const groups = isArabic ? GROUPS_AR : GROUPS_EN

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
        {groups.map((group) => (
          <div className="contactus__group" key={group.label}>
            <h3 className="contactus__group-title">{group.label}</h3>
            <div className="contactus__group-card">
              {group.people.map((p) => (
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
          </div>
        ))}
      </div>
    </section>
  )
}

export default Contact