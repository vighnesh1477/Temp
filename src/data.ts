
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

export interface Person {
  name: string
  role: string
  parents: string
  credentials: string[]
  title: string
}

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
      name: 'Harshith Poojary',
      person: {
        name: 'Harshith Poojary',
        role: 'Son of',
        // TODO: DUMMY DATA — replace with groom's parents' names.
        parents: 'Mr. & Mrs. Poojary',
        // TODO: DUMMY DATA — replace with actual credentials, or [].
        credentials: [],
        // TODO: DUMMY DATA — replace with groom's profession, or ''.
        title: '',
      } as Person,
    },
    ampersand: '&',
    second: {
      name: 'Shreya',
      person: {
        name: 'Shreya',
        role: 'Daughter of',
        // TODO: DUMMY DATA — replace with bride's parents' names.
        parents: 'Mr. & Mrs. [Family Name]',
        // TODO: DUMMY DATA — replace with actual credentials, or [].
        credentials: [],
        // TODO: DUMMY DATA — replace with bride's profession, or ''.
        title: '',
      } as Person,
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
    name: 'St. Sebastian Mini Hall',
    address: 'Mallikatte, Kadri, Mangaluru, Karnataka 575002',
    mapsQuery:
      'St. Sebastian Mini Hall, Mallikatte, Kadri, Mangaluru, Karnataka 575002',
  },

  /** Dress code */
  dressCode: {
    heading: 'Dress Code',
    groups: [
      {
        label: 'Women',
        description: 'Indian traditional attire',
      },
      {
        label: 'Men',
        description: 'Indian traditional attire',
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

  // TODO: DUMMY DATA — confirm whether shuttle service is available.
  transportation: {
    heading: 'Transportation',
    text:
      'Please contact the family for transportation details and directions to the wedding venue.',
  },

  // TODO: DUMMY DATA — replace with confirmed accommodation details if needed.
  accommodation: {
    heading: 'Accommodation',
    text:
      'For accommodation recommendations, please contact the family.',
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

/**
 * Arabic translations.
 *
 * TODO: DUMMY DATA — these are retained sample translations from the
 * original template. Replace them with accurate Arabic translations
 * of the Harshith & Shreya invitation, or remove language switching
 * if Arabic is not required.
 */
export const arabicInvitation = {
  gate: {
    tapToOpen: 'إضغط للفتح',
  },
  heroKicker: 'يسرنا دعوتكم لحضور حفل زفاف',
  brideAndGroom: {
    first: {
      name: 'هارشيث بوجاري',
      person: {
        name: 'هارشيث بوجاري',
        role: 'ابن',
        parents: 'السيد والسيدة بوجاري',
        credentials: [],
        title: '',
      },
    },
    ampersand: '&',
    second: {
      name: 'شريا',
      person: {
        name: 'شريا',
        role: 'ابنة',
        // TODO: DUMMY DATA — replace with the bride's parents' names.
        parents: 'السيد والسيدة [اسم العائلة]',
        credentials: [],
        title: '',
      },
    },
  },
  scroll: 'التمرير للأسفل',
  message:
    'بكل محبة وبركة من عائلتينا، يسعدنا دعوتكم للاحتفال بزفاف هارشيث بوجاري وشريا. حضوركم ودعواتكم تجعل هذه المناسبة أكثر سعادة ومعنى.',
  wedding: {
    dateTime: '2026-12-14T10:00:00+05:30',
    dateLabel: '١٤ ديسمبر ٢٠٢٦',
    dayLabel: 'الاثنين',
    timeLabel: '١٠:٠٠ صباحاً',
  },
  scratch: {
    heading: 'اكشط لكشف الدعوة',
    revealedTitle: 'أنتم مدعوون!',
    revealHint: 'استخدم إصبعك أو الفأرة لكشف القلب',
    saveTheDate: 'احفظوا التاريخ',
  },
  countdownHeading: 'العد التنازلي للأبد',
  countdownUnits: {
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثوانٍ',
  },
  program: {
    heading: 'جدول الاحتفالات',
    days: [
      {
        dateLabel: 'الجمعة، ١١ ديسمبر ٢٠٢٦',
        events: [
          {
            time: '١١:٠٠ صباحاً',
            title: 'حفل الميهندي والهالدي',
            description: 'احتفال عائلي مليء بالفرح والبركات.',
          },
        ],
      },
      {
        dateLabel: 'الاثنين، ١٤ ديسمبر ٢٠٢٦',
        events: [
          {
            time: '١٠:٠٠ صباحاً',
            title: 'مراسم الزفاف',
            description: 'نرحب بكم لمشاركة فرحتنا في هذا اليوم المميز.',
          },
        ],
      },
    ],
  },
  venue: {
    heading: 'مكان الحفل',
    name: 'قاعة سانت سيباستيان',
    address: 'ماليكات، كادري، مانغالورو، كارناتاكا 575002',
    openInMaps: 'فتح في خرائط جوجل',
  },
  dressCode: {
    heading: 'الزي المفضل',
    groups: [
      {
        label: 'السيدات',
        description: 'الزي الهندي التقليدي',
      },
      {
        label: 'الرجال',
        description: 'الزي الهندي التقليدي',
      },
    ],
  },
  preWedding: {
    heading: 'احتفالات ما قبل الزفاف',
    days: [
      {
        dateLabel: 'الجمعة، ١١ ديسمبر ٢٠٢٦',
        events: [
          {
            time: '١١:٠٠ صباحاً',
            title: 'حفل الميهندي والهالدي',
            description: 'في منزل هارشا ديبا، ثومبي، كارناتاكا.',
          },
        ],
      },
    ],
  },
  transportation: {
    heading: 'المواصلات',
    text: 'يرجى التواصل مع العائلة لمعرفة تفاصيل المواصلات.',
  },
  accommodation: {
    heading: 'الإقامة',
    text: 'يرجى التواصل مع العائلة للحصول على معلومات الإقامة.',
  },
  gifts: {
    heading: 'محبتكم وبركاتكم',
    text: 'حضوركم ومحبتكم ودعواتكم هي أجمل هدية لنا.',
  },
  rsvp: {
    heading: 'تأكيد الحضور',
    deadlineLabel: '',
    nameField: {
      label: 'الاسم الكامل',
      placeholder: 'اكتب اسمك هنا',
    },
    attendanceField: {
      label: 'هل ستشرفنا بالحضور؟',
      placeholder: 'اختر...',
    },
    options: [
      { value: 'yes', label: 'نعم، سأحضر!' },
      { value: 'no', label: 'أعتذر عن الحضور' },
    ],
    guestsField: {
      label: 'عدد الضيوف',
      placeholder: 'اختر عدد الضيوف',
    },
    messageField: {
      label: 'رسالة للعروسين',
      placeholder: 'اكتب تهنئتك هنا...',
    },
    submitLabel: 'إرسال الرد',
    successTitle: 'شكراً جزيلاً!',
    successText: 'شكراً لردكم، نتطلع إلى الاحتفال معكم!',
  },
  closing: {
    message: 'نتطلع إلى الاحتفال معكم!',
    signature: 'هارشيث & شريا',
  },
} as const

export type Invitation = typeof invitation
