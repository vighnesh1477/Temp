/**
 * data.ts — Single source of truth for the wedding invitation.
 *
 * Real couple: Harshith Poojary & Shreya
 * Wedding: December 14, 2026, at 10:21 AM IST (Muhurtam)
 * Sangeet Night: December 12, 2026, from 6:00 PM onwards
 *
 * TODO: DUMMY DATA comments identify sample content that must be
 * confirmed or replaced before publishing.
 */

export interface EventVenue {
  name: string
  address: string
  /** Used to build a Google Maps search link when mapsLink is empty */
  mapsQuery: string
  /** Exact Google Maps pin from the invitation card ('' if not shared yet) */
  mapsLink: string
}

export interface TimelineEvent {
  time: string
  title: string
  description: string
  /** Location shown as a tappable "Open in Google Maps" row for each event */
  venue?: EventVenue
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
    dateTime: '2026-12-14T10:21:00+05:30',
    dateLabel: 'December 14, 2026',
    dayLabel: 'Monday',
    timeLabel: '10:21 AM',
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

  /** All celebrations — Sangeet Night and the wedding day (each event carries its venue) */
  program: {
    heading: 'Wedding Celebrations',
    days: [
      {
        dateLabel: 'Saturday, December 12, 2026',
        events: [
          {
            time: '6:00 PM onwards',
            title: 'Sangeet Night',
            description:
              'With love, laughter and music, an evening of dance, joy and togetherness.',
            venue: {
              name: 'Urwa Church Mini Hall',
              address: 'Urwa, Mangaluru, Karnataka',
              mapsQuery: 'Urwa Church Mini Hall, Mangaluru, Karnataka',
              // Google Maps pin printed on the Sangeet Night invitation card
              mapsLink: 'https://maps.app.goo.gl/nMd8TjvHkbt4EbiW6',
            },
          },
        ],
      },
      {
        dateLabel: 'Monday, December 14, 2026',
        events: [
          {
            time: '10:21 AM',
            title: 'Wedding Ceremony',
            description:
              'Join us as Harshith and Shreya begin their journey together, surrounded by family and friends.',
            venue: {
              name: 'St. Sebastian Centenary Hall',
              address: 'Bendur, Mangaluru, Karnataka 575002',
              mapsQuery:
                'St. Sebastian Centenary Hall, Bendur, Mangaluru, Karnataka 575002',
              // Google Maps pin printed on the wedding invitation card
              mapsLink: 'https://maps.app.goo.gl/C74fe2BGk19P57XR9',
            },
          },
        ],
      },
    ] as EventDay[],
  },

  /** Wedding venue — details as printed on the wedding invitation card */
  venue: {
    heading: 'Venue',
    name: 'St. Sebastian Centenary Hall',
    address: 'Bendur, Mangaluru, Karnataka 575002',
    mapsQuery:
      'St. Sebastian Centenary Hall, Bendur, Mangaluru, Karnataka 575002',
    // Google Maps pin printed on the wedding invitation card
    mapsLink: 'https://maps.app.goo.gl/C74fe2BGk19P57XR9',
  },

  /** Sangeet Night venue — December 12, 2026 (wire into the UI when needed) */
  sangeetVenue: {
    heading: 'Sangeet Venue',
    name: 'Urwa Church Mini Hall',
    address: 'Urwa, Mangaluru, Karnataka',
    mapsQuery: 'Urwa Church Mini Hall, Mangaluru, Karnataka',
    // Google Maps pin printed on the Sangeet Night invitation card
    mapsLink: 'https://maps.app.goo.gl/nMd8TjvHkbt4EbiW6',
  },

  /** Dress code — Sangeet Night & wedding day */
  dressCode: {
    heading: 'Dress Code',
    groups: [
      {
        label: 'Sangeet Night',
        description:
          'Bright, colorful festive attire — vibrant colors for both men and women.',
      },
      {
        label: 'Wedding',
        description: 'Indian traditional attire.',
      },
    ],
  },

  gifts: {
    heading: 'Your Blessings',
    text:
      'No presents, only blessings — your presence and blessings are the greatest gift to us.',
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

  /** Background music — Butta Bomma instrumental, file in public/audio/ */
  music: {
    src: '/audio/butta-bomma.mp3',
    title: 'Butta Bomma (Instrumental)',
  },
} as const

export type Invitation = typeof invitation