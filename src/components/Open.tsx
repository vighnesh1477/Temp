import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Open.css'

/** Small golden leaf sprig used beside the plaque */
export function GoldSprig({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 26"
      width="54"
      height="22"
      aria-hidden="true"
      style={flip ? { transform: 'rotate(180deg)' } : undefined}
    >
      <g fill="none" stroke="#C2A15B" strokeWidth="1.6" strokeLinecap="round">
        <path d="M6 13 H 50" />
        <path d="M14 13 C 16 8, 20 6, 25 6" />
        <path d="M14 13 C 16 18, 20 20, 25 20" />
        <path d="M28 13 C 30 8, 34 6, 39 6" />
        <path d="M28 13 C 30 18, 34 20, 39 20" />
        <path d="M44 13 L 50 13" />
      </g>
      <circle cx="54" cy="13" r="2.4" fill="#C2A15B" />
      <circle cx="9" cy="13" r="1.7" fill="#C2A15B" />
    </svg>
  )
}

/** Ornamental cartouche medallion — now only used as automatic
 *  fallback if the plaque image fails to load */
export function GateMedallion({ label }: { label: string }) {
  return (
    <div className="gate-medallion">
      <svg viewBox="0 0 220 260" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="medFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FAF5E8" />
            <stop offset="0.55" stopColor="#F4EDE0" />
            <stop offset="1" stopColor="#EBE0CC" />
          </linearGradient>
          <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D9BC7E" />
            <stop offset="0.5" stopColor="#B9975A" />
            <stop offset="1" stopColor="#D9BC7E" />
          </linearGradient>
        </defs>
        {/* Cartouche body with baroque curves */}
        <path
          d="M110 10
             C 122 10, 131 16, 134 27
             C 149 24, 161 33, 160 47
             C 175 47, 184 59, 179 73
             C 193 78, 198 92, 190 104
             C 202 111, 203 127, 193 136
             C 202 146, 199 162, 187 167
             C 193 179, 187 192, 174 195
             C 177 209, 168 220, 154 220
             C 154 233, 143 242, 130 240
             C 124 250, 116 254, 110 254
             C 104 254, 96 250, 90 240
             C 77 242, 66 233, 66 220
             C 52 220, 43 209, 46 195
             C 33 192, 27 179, 33 167
             C 21 162, 18 146, 27 136
             C 17 127, 18 111, 30 104
             C 22 92, 27 78, 41 73
             C 36 59, 45 47, 60 47
             C 59 33, 71 24, 86 27
             C 89 16, 98 10, 110 10 Z"
          fill="url(#medFill)"
          stroke="url(#goldStroke)"
          strokeWidth="2.2"
        />
        {/* Inner gold scrollwork */}
        <g fill="none" stroke="#C2A15B" strokeWidth="1.5" strokeLinecap="round">
          <path d="M110 60 C 107 72, 107 84, 110 94" />
          <path d="M110 94 C 104 88, 96 87, 90 91" />
          <path d="M110 94 C 116 88, 124 87, 130 91" />
          <path d="M64 122 C 76 110, 92 110, 100 122" />
          <path d="M156 122 C 144 110, 128 110, 120 122" />
          <path d="M64 122 C 69 132, 79 136, 88 134" />
          <path d="M156 122 C 151 132, 141 136, 132 134" />
          <path d="M110 150 C 107 160, 107 170, 110 180" />
          <path d="M110 180 C 105 174, 98 173, 93 177" />
          <path d="M110 180 C 115 174, 122 173, 127 177" />
        </g>
        <g fill="#C2A15B">
          <circle cx="88" cy="134" r="1.8" />
          <circle cx="132" cy="134" r="1.8" />
          <circle cx="100" cy="122" r="1.6" />
          <circle cx="120" cy="122" r="1.6" />
        </g>
        {/* Cluster of 3 pearls at the top peak */}
        <g>
          <circle cx="110" cy="32" r="5.5" fill="#FFFDF8" stroke="#D2BF95" strokeWidth="1" />
          <circle cx="98" cy="38" r="3.6" fill="#FFFDF8" stroke="#D2BF95" strokeWidth="0.9" />
          <circle cx="122" cy="38" r="3.6" fill="#FFFDF8" stroke="#D2BF95" strokeWidth="0.9" />
        </g>
        {/* Cluster of 3 pearls at the bottom peak */}
        <g>
          <circle cx="110" cy="230" r="5.5" fill="#FFFDF8" stroke="#D2BF95" strokeWidth="1" />
          <circle cx="98" cy="224" r="3.6" fill="#FFFDF8" stroke="#D2BF95" strokeWidth="0.9" />
          <circle cx="122" cy="224" r="3.6" fill="#FFFDF8" stroke="#D2BF95" strokeWidth="0.9" />
        </g>
      </svg>
      <span className="gate-medallion__label">{label}</span>
    </div>
  )
}

export interface OpenProps {
  onOpened: () => void
  reducedMotion: boolean
  label: string
}

/**
 * Cinematic speed ramp for the entrance video.
 * Video time 0 → step1At          : steps[0] (normal, 1x)
 * Video time step1At → step2At    : steps[1] (2x)
 * Video time step2At → end        : steps[2] (3x)
 * The last `endCutoff` seconds of the video are skipped (blank tail),
 * a bright golden bloom covers the cut, then everything dissolves
 * into the invitation.
 */
const SPEED_RAMP = {
  steps: [1, 2, 3],
  step1At: 1.0,
  step2At: 2.0,
  /** seconds of the video tail to cut — set this to your blank tail length */
  endCutoff: 4.0,
  /** subtle zoom punch each time the speed steps up */
  kickScale: 1.035,
  kickDuration: 0.28,
}

/**
 * The Opening Scene component implementing the cinematic video entrance.
 */
export function Open({ onOpened, reducedMotion, label }: OpenProps) {
  const gateRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const medallionRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gone, setGone] = useState(false)
  const [plaqueOk, setPlaqueOk] = useState(true)
  const finishedRef = useRef(false)
  const rafRef = useRef(0)

  const finishOpening = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true

    const gate = gateRef.current

    // no animations for reduced-motion users — reveal instantly
    if (!gate || reducedMotion) {
      onOpened()
      setGone(true)
      return
    }

    // "Light from the centre": a golden bloom grows out of the exact
    // centre of the screen and swallows the video, then the whole gate
    // dissolves with a PURE opacity fade — nothing zooms, nothing punches.
    const tl = gsap.timeline()

    // 1 — UI chrome out fast
    tl.to(medallionRef.current, { opacity: 0, duration: 0.25, overwrite: 'auto' }, 0)

    const skip = document.querySelector('.gate-skip-btn')
    if (skip) tl.to(skip, { opacity: 0, duration: 0.3, ease: 'power1.out' }, 0)

    // 2 — video gently drawn into the light: slow push + soft blur
    //     (overwrite kills any ramp kick still running)
    tl.fromTo(
      videoRef.current,
      { scale: 1, filter: 'blur(0px) brightness(1)' },
      {
        scale: 1.05,
        filter: 'blur(6px) brightness(1.1)',
        transformOrigin: '50% 50%',
        duration: 1.0,
        ease: 'power1.in',
        overwrite: 'auto',
      },
      0,
    )

    // 3 — golden bloom expands from the exact centre (scale 0 -> cover)
    tl.fromTo(
      flashRef.current,
      { opacity: 1, scale: 0 },
      { scale: 1.12, duration: 1.0, ease: 'power2.in' },
      0.05,
    )

    // 4 — at full bloom, the invitation mounts beneath the gate
    tl.call(() => onOpened(), [], 1.05)

    // 5 — short beat on pure light, then melt into the invitation
    //     with a clean opacity fade only (no scale = no "boom")
    tl.to(
      gate,
      {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => setGone(true),
      },
      1.15,
    )
  }, [onOpened, reducedMotion])

  const handleOpen = useCallback(() => {
    if (finishedRef.current) return

    if (reducedMotion) {
      finishOpening()
      return
    }

    if (!isPlaying) {
      setIsPlaying(true)
      // Smoothly hide the TAP TO OPEN plaque
      if (medallionRef.current) {
        gsap.to(medallionRef.current, {
          scale: 0.6,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.in',
        })
      }

      // Play the cinematic video with the stepped speed ramp
      const video = videoRef.current
      if (video) {
        video.playbackRate = SPEED_RAMP.steps[0]
        // keep pitch natural if the track ever has audio
        video.preservesPitch = true
        video.play().catch(() => {
          // If browser restricts playback, finish directly
          finishOpening()
        })
      }
    }
  }, [isPlaying, reducedMotion, finishOpening])

  /**
   * rAF driver: steps the playbackRate 1x → 2x → 3x by video time,
   * punches a subtle zoom on each step-up, and triggers the reveal
   * just before the video ends (robust even at high playback rates).
   */
  useEffect(() => {
    if (!isPlaying) return

    let lastRate = SPEED_RAMP.steps[0]

    const tick = () => {
      const video = videoRef.current

      // stop the loop once finished or unmounted
      if (!video || finishedRef.current) return

      if (video.duration > 0) {
        const t = video.currentTime

        // cut the blank tail: bloom + reveal before the blank part plays
        const cutoff = SPEED_RAMP.endCutoff
        if (t >= video.duration - cutoff) {
          finishOpening()
          return
        }

        // stepped speed ramp based on video time
        const rate =
          t < SPEED_RAMP.step1At
            ? SPEED_RAMP.steps[0]
            : t < SPEED_RAMP.step2At
              ? SPEED_RAMP.steps[1]
              : SPEED_RAMP.steps[2]

        if (rate !== lastRate) {
          lastRate = rate
          video.playbackRate = rate

          // subtle cinematic kick each time the speed steps up
          if (videoRef.current) {
            gsap.fromTo(
              videoRef.current,
              { scale: 1 },
              {
                scale: SPEED_RAMP.kickScale,
                duration: SPEED_RAMP.kickDuration,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1,
                overwrite: 'auto',
              },
            )
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      const video = videoRef.current
      if (video) video.playbackRate = SPEED_RAMP.steps[0]
    }
  }, [isPlaying, finishOpening])

  useEffect(() => () => gsap.killTweensOf('*'), [])

  if (gone) return null

  return (
    <div
      ref={gateRef}
      className={`gate${isPlaying ? ' gate--playing' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleOpen()
        }
      }}
    >
      {/* Fullscreen cinematic video background */}
      <video
        ref={videoRef}
        className="gate-video"
        src="/video/flux-3-video_a_Create_a_premium_cin.mp4"
        poster="/video/first_frame.jpg"
        playsInline
        muted
        preload="auto"
        onEnded={finishOpening}
      />

      <div className="gate-video-overlay" aria-hidden="true" />

      {/* Bright golden bloom — grows from the centre, covers the video tail */}
      <div className="gate-flash" ref={flashRef} aria-hidden="true" />

      {/* Subtle Skip button during video playback */}
      {isPlaying && (
        <button
          type="button"
          className="gate-skip-btn"
          onClick={(e) => {
            e.stopPropagation()
            finishOpening()
          }}
          aria-label="Skip entrance video"
        >
          Skip &gt;
        </button>
      )}

      {/* Centered TAP TO OPEN plaque (image) with SVG fallback */}
      <div className="gate-medallion-wrap" ref={medallionRef}>
        <div className="gate-sprig gate-sprig--top">
          <GoldSprig />
        </div>

        {plaqueOk ? (
          <div className="gate-plaque" aria-hidden="true">
            <img
              src="/images/Ornate Gold Tap to Open Plaque.png"
              alt=""
              draggable={false}
              onError={() => setPlaqueOk(false)}
            />
          </div>
        ) : (
          <GateMedallion label={label} />
        )}

        <div className="gate-sprig gate-sprig--bottom">
          <GoldSprig flip />
        </div>
      </div>
    </div>
  )
}

// Export default and alias Gate
export default Open
export { Open as Gate }