# Royal Grace — Wedding Invitation

An elegant, mobile-first wedding invitation experience: a cinematic "tap to open"
gate animation reveals a luxurious invitation with a scratch-to-reveal date card,
live countdown, program timeline, venue map, RSVP form, photo carousel, and
optional background music.

Built with **React + Vite + TypeScript + CSS3**, **GSAP** (gate opening),
**Lucide React** (icons) and **HTML Canvas** (scratch interaction).
All decorative artwork (gate texture, courtyard hero, linen background, garland,
gallery photos) is original, AI-generated imagery — no third-party or proprietary
assets are used.

## Run locally (Windows / macOS / Linux)

```bash
npm install
npm run dev      # development server -> http://localhost:5173
```

Production build & preview:

```bash
npm run build    # type-checks (tsc) + bundles to dist/
npm run preview  # serves the production build
```

## Project structure

```
royal-invite/
  index.html          # Google Fonts (Amiri, Playfair, Great Vibes...), meta, favicon
  package.json
  tsconfig.json
  vite.config.ts
  public/
    images/           # gate-texture, hero-courtyard, linen, garland, gallery images
    audio/            # ambient-loop.mp3 (synthesized romantic music-box loop)
  src/
    main.tsx          # React application entry point
    App.tsx           # Page orchestrator importing modular components
    data.ts           # ALL editable invitation content & Arabic translations live here
    style.css         # Global design tokens, layout frame, garlands & resets
    utils/
      helpers.ts      # usePrefersReducedMotion and icsDate formatting utilities
    components/
      Open.tsx / .css            # Entrance gate with GSAP animation & pearl medallion
      Hero.tsx / .css            # Curtain hero with couple names & credentials
      InvitationMessage.tsx / .css # Formal invitation wording & family blessing
      ScratchCard.tsx / .css     # Heart scratch canvas & Save the Date button
      Carousel.tsx / .css        # Photo slider with external dots navigation
      Countdown.tsx / .css       # Live countdown with frosted sage cards
      Timeline.tsx / .css        # Program timeline & pre-wedding events
      Venue.tsx / .css           # Venue card with embedded Google Map
      InfoSection.tsx / .css     # Dress code, transportation, accommodation, gifts
      Contact.tsx / .css         # RSVP & guest wishes form with confirmation state
      Closing.tsx / .css         # Closing blessing, signature & back-to-top button
      MusicToggle.tsx / .css     # Floating top-right audio toggle button
      BottomBar.tsx / .css       # Floating language toggle & "Use this Design" pills
      DesignModal.tsx / .css     # Interactive modal with WhatsApp share & .ics export
      Dividers.tsx               # HeartDivider, WavyDivider, SectionHeading
```

## Editing the invitation content

Open **`src/data.ts`** — every visible detail is configured there:

- Couple names, parents, credentials, titles
- Invitation message, hero kicker
- Wedding date & time (`wedding.dateTime` drives the countdown AND the
  Save-the-Date calendar file)
- Gallery images & alt text
- Program timeline + pre-wedding events
- Venue name/address/Google-Maps query (embed + "Open in Maps")
- Dress code, transportation, accommodation, gifts
- RSVP wording and options
- Closing message & signature

No component edits are needed for content changes.

## Features

- **Opening gate** — GSAP-animated double doors with gold trim, beaded pillar and
  an ornamental "TAP TO OPEN" medallion; double-click safe; scroll is locked until
  the invitation is revealed.
- **Scratch to Reveal** — heart-shaped canvas with a glittery sage layer; scratch
  with mouse or touch; auto-completes at ~45 % cleared; keyboard accessible
  (Enter/Space reveals instantly).
- **Save the Date** — prominent pill button directly under the scratch heart; downloads
  a real `.ics` calendar file built from `data.ts` and auto-reveals the wedding date.
- **Countdown** — updates every second, frosted translucent cards, clamps at zero when passed.
- **Photo carousel** — crossfade, auto-advance, dot navigation below image, swipe on touch.
- **Venue** — embedded Google Map (no API key needed) + "Open in Maps" action.
- **RSVP** — validated form with guest counter and thank-you state; responses stored in
  `localStorage` (no backend required).
- **Bilingual English & Arabic** — interactive floating language switch with authentic
  calligraphy typography (`Amiri` & `Aref Ruqaa`), RTL layout, and complete Arabic translations.
- **Use this Design** — interactive modal with quick actions to export calendar (.ics),
  share via WhatsApp, or copy invitation link.
- **Music toggle** — optional ambient loop with top-right control; never autoplays with sound;
  the control hides itself if the audio file is missing.
- **Accessibility & performance** — semantic HTML, labelled controls,
  `prefers-reduced-motion` fallbacks (gate fades, reveals are instant),
  lazy-loaded below-fold images, WebP assets, transform/opacity-only animations,
  full cleanup of timers/observers/GSAP timelines on unmount.

## Assets you may want to replace

| Path | Used for | Replace with |
|------|----------|--------------|
| `public/images/gallery-1..4.webp` | photo carousel | your own wedding photos (keep the same filenames or update `data.ts`) |
| `public/images/hero-courtyard.webp` | hero background | your venue/couple artwork (portrait ~768×1344 works best) |
| `public/images/gate-texture.webp` | gate doors | any embossed/floral texture you prefer |
| `public/audio/ambient-loop.mp3` | background music | a licensed track you own (keep filename or update `data.ts`) |

The current gallery photos are original AI-generated images supplied so the
project runs complete out of the box — swap them for real photos before sending
the invitation to guests.
