/**
 * data.ts — Single source of truth for the wedding invitation.
 *
 * Real couple: Harshith Poojary & Shreya
 * Wedding: December 14, 2026, at 10:00 AM IST
 * Mehandi & Haldi: December 11, 2026, at 11:00 AM
 *
 * TODO: DUMMY DATA comments identify sample content that must be
 * confirmed or replaced before publishing.
 */

export interface TimelineEvent {
  time: string
  title: string
  description: string
}

export interface EventDay {
  dateLabel: string
  events: readonly TimelineEvent[]
}

export interface GalleryImage {
  src: string
  alt: string
}

export interface RsvpOption {
  value: string
  label: string
}

export const invitation = {
  /** Couple presentation shown in the hero */
  brideAndGroom: {
    first: {
      name: 'Harshith ',
    },
    ampersand: '&',
    second: {
      name: 'Shreya',
    },
  },

  heroKicker: "We're getting married",

  /** Formal invitation wording */
  message:
    'With the blessings of our families, we joyfully invite you to celebrate the wedding of Harshith Poojary & Shreya. Your presence and blessings will make our special day even more meaningful.',

  /** Main wedding day — used by countdown and calendar */
  wedding: {
    dateTime: '2026-12-14T10:00:00+05:30',
    dateLabel: 'December 14, 2026',
    dayLabel: 'Monday',
    timeLabel: '10:00 AM',
  },

  /** Opening screen */
  gate: {
    tapToOpen: 'TAP TO OPEN',
  },

  /** Scratch-to-reveal card */
  scratch: {
    heading: 'Scratch to Reveal',
    revealedTitle: "You're Invited!",
    revealHint: 'Use your finger or mouse to scratch the heart',
    saveTheDate: 'SAVE THE DATE',
    completeThreshold: 0.45,
  },

  /** Photo carousel */
  gallery: [
    // TODO: DUMMY DATA — replace these sample images with the couple's photos.
    {
      src: '/images/gallery-bouquet.webp',
      alt: 'Wedding floral arrangement',
    },
    {
      src: '/images/gallery-1.webp',
      alt: 'Wedding celebration',
    },
    {
      src: '/images/gallery-2.webp',
      alt: 'Wedding floral decoration',
    },
    {
      src: '/images/gallery-4.webp',
      alt: 'Wedding reception decoration',
    },
  ] as GalleryImage[],

  countdownHeading: 'Counting Down to Forever',

  /** Wedding and pre-wedding event schedule */
  program: {
    heading: 'Wedding Celebrations',
    days: [
      {
        dateLabel: 'Friday, December 11, 2026',
        events: [
          {
            time: '11:00 AM',
            title: 'Mehandi & Haldi',
            description:
              'A joyful celebration of henna, turmeric, family and blessings at Harsha Deepa House.',
          },
        ],
      },
      {
        dateLabel: 'Monday, December 14, 2026',
        events: [
          {
            time: '10:00 AM',
            title: 'Wedding Ceremony',
            description:
              'Join us as Harshith and Shreya begin their journey together, surrounded by family and friends.',
          },
        ],
      },
    ] as EventDay[],
  },

  /** Wedding venue */
  venue: {
    heading: 'Venue',
    name: 'St. Sebastian Centenary Auditorium',
    address: 'Bendur, Mangaluru, Karnataka 575002',
    mapsQuery:
      'St. Sebastian Centenary Auditorium, Bendur, Mangaluru, Karnataka 575002',
    // Exact Google Maps pin shared by the family
    mapsLink: 'https://maps.app.goo.gl/z31Ewns9LHKoggKz8',
  },

  /** Dress code */
  dressCode: {
    heading: 'Dress Code',
    groups: [
      {
        label: 'Haldi',
        description: 'Hues of yellow & green, for both men and women.',
      },
      {
        label: 'Wedding',
        description: 'Indian traditional attire.',
      },
    ],
  },

  /** Pre-wedding events */
  preWedding: {
    heading: 'Pre-Wedding Celebrations',
    days: [
      {
        dateLabel: 'Friday, December 11, 2026',
        events: [
          {
            time: '11:00 AM',
            title: 'Mehandi & Haldi',
            description:
              'At Harsha Deepa House, Thumbe, Karnataka 574143.',
          },
        ],
      },
    ] as EventDay[],
  },

  gifts: {
    heading: 'Your Blessings',
    text:
      'Your presence, love and blessings are the greatest gifts we could ask for.',
  },

  /** RSVP form */
  rsvp: {
    heading: 'RSVP',
    // TODO: DUMMY DATA — add the RSVP deadline if one is required.
    deadlineLabel: '',
    nameField: {
      label: 'Your Name',
      placeholder: 'Your full name',
    },
    attendanceField: {
      label: 'Will you be attending?',
      placeholder: 'Select...',
    },
    options: [
      { value: 'yes', label: "Yes, I'll be there!" },
      { value: 'no', label: "Sorry, I can't make it" },
    ] as RsvpOption[],
    guestsField: {
      label: 'Number of Guests',
      placeholder: 'Select guests',
    },
    messageField: {
      label: 'Your Message',
      placeholder: 'Write your wishes...',
    },
    submitLabel: 'Send Response',
    successTitle: 'Thank You!',
    successText:
      'Thank you for responding. We look forward to celebrating with you!',
  },

  closing: {
    message: "We can't wait to celebrate with you!",
    signature: 'Harshith & Shreya',
  },

  /** Background music */
  music: {
    // TODO: DUMMY DATA — replace with a licensed track in public/audio/.
    // Example: '/audio/wedding-ambience.mp3'
    src: '',
    title: 'Wedding ambience',
  },
} as const

export type Invitation = typeof invitation