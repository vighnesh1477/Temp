import { useCallback, useEffect, useRef, useState } from 'react'
import { CalendarPlus } from 'lucide-react'
import { invitation, arabicInvitation } from '../data'
import { usePrefersReducedMotion, icsDate } from '../utils/helpers'
import { SectionHeading } from './Dividers'
import './ScratchCard.css'

export interface ScratchCardProps {
  scratch: (typeof invitation)['scratch'] | (typeof arabicInvitation)['scratch']
  wedding: (typeof invitation)['wedding'] | (typeof arabicInvitation)['wedding']
  isArabic: boolean
}

/** Blast when this share of the ORIGINAL heart foil has been scratched away */
const SCRATCH_BLAST_AT = 0.5
/** Hard cap on total blast particles — keeps mobile at 60fps */
const MAX_PARTICLES = 460

/** Rose-petal palette (blush → champagne → ivory) */
const PETAL_COLORS = ['#E8B4B8', '#DE9AA0', '#F3D9C6', '#FFF3E2', '#C97F88']
/** Sage foliage palette */
const LEAF_COLORS = ['#7A8F68', '#5F7351', '#93A87F', '#87A072']
/** Gold flecks mixed into the burst */
const GOLD_FLECKS = ['#E9C46A', '#F4E4B8', '#D9BC7E', '#C2A15B', '#FFF8E6']
/** Petal ring of the rose bloom crowning the frame */
const PETAL_RING = ['#E8B4B8', '#EDC3C6', '#E8B4B8', '#EDC3C6', '#F3D9C6']

/**
 * The heart in a 300×300 box — shared by the canvas foil (painted from the
 * same fractions) and the gilt SVG frame, so the frame rings the foil exactly
 * and simply STAYS after the blast. This is the "outer structure" that
 * survives.
 */
const HEART_PATH =
  'M150 96 C150 69 126 45 93 45 C51 45 30 84 30 114 ' +
  'C30 165 90 204 150 258 C210 204 270 165 270 114 ' +
  'C270 84 249 45 207 45 C174 45 150 69 150 96 Z'

type ParticleKind = 'petal' | 'leaf' | 'fleck' | 'spark' | 'shard'

interface Particle {
  kind: ParticleKind
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rot: number
  rotSpeed: number
  wobble: number
  wobbleSpeed: number
  sway: number
  life: number
  decay: number
  gravity: number
  drag: number
  tumble: number
  tumbleSpeed: number
}

/** Tiny heart-in-sparkle icon for the scratch heading */
export function SparkleHeart() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.2 5.4 14.1C3.9 12.7 3.4 10.6 4.3 8.9 5.5 6.6 8.4 6 10.3 7.6L12 9l1.7-1.4c1.9-1.6 4.8-1 6 1.3.9 1.7.4 3.8-1.1 5.2L12 20.2Z"
        fill="none"
        stroke="#4A5C3D"
        strokeWidth="1.6"
      />
      <path d="M19 3.2v3.4M17.3 4.9h3.4" stroke="#4A5C3D" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

/** Small gold line-diamond-line flourish used around the revealed date */
function Flourish({ end = false }: { end?: boolean }) {
  return (
    <svg
      className={`scratch__flourish${end ? ' scratch__flourish--end' : ''}`}
      viewBox="0 0 120 12"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="4" y1="6" x2="47" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
      <path d="M60 1.5 64.2 6 60 10.5 55.8 6 Z" fill="currentColor" />
      <line x1="73" y1="6" x2="116" y2="6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
    </svg>
  )
}

/**
 * Gilt heart frame that rings the scratch foil — hand-drawn gold outline,
 * a rose bloom crowning the top dip, laurel sprigs sweeping down both
 * shoulders and scattered gold sparkles. It sits ABOVE the foil and never
 * takes damage, so when the foil blasts away the heart structure remains
 * holding the wedding date.
 */
function HeartFrame() {
  return (
    <svg className="scratch__frame" viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sgFrameGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A8813F" />
          <stop offset="0.3" stopColor="#E9C46A" />
          <stop offset="0.55" stopColor="#B8924A" />
          <stop offset="0.8" stopColor="#F4E4B8" />
          <stop offset="1" stopColor="#C2A15B" />
        </linearGradient>
      </defs>

      {/* halo + outline, drawn slightly larger than the foil heart */}
      <g transform="translate(150 151.5) scale(1.075) translate(-150 -151.5)">
        <path
          className="frame-halo"
          d={HEART_PATH}
          pathLength={1}
          fill="none"
          stroke="rgba(233, 196, 106, 0.26)"
          strokeWidth="7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className="frame-outline"
          d={HEART_PATH}
          pathLength={1}
          fill="none"
          stroke="url(#sgFrameGold)"
          strokeWidth="2.7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
      {/* fine inner hairline that catches the foil edge */}
      <path
        className="frame-hairline"
        d={HEART_PATH}
        pathLength={1}
        fill="none"
        stroke="rgba(255, 248, 230, 0.6)"
        strokeWidth="1"
        strokeLinejoin="round"
        transform="translate(150 151.5) scale(0.955) translate(-150 -151.5)"
      />

      {/* rose bloom crowning the top dip */}
      <g className="frame-ornament" transform="translate(150 89)">
        {PETAL_RING.map((fill, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-5.4"
            rx="3"
            ry="5.2"
            transform={`rotate(${i * 72})`}
            fill={fill}
            stroke="rgba(146, 84, 92, 0.4)"
            strokeWidth="0.5"
          />
        ))}
        <circle r="2.4" fill="url(#sgFrameGold)" />
      </g>

      {/* laurel sprigs sweeping down both shoulders */}
      <g className="frame-ornament" transform="translate(150 96)">
        {[1, -1].map((side) => (
          <g key={side} transform={side === 1 ? 'rotate(24)' : 'scale(-1 1) rotate(24)'}>
            <path d="M4 4 Q 30 14 54 10" fill="none" stroke="#7A8F68" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="18" cy="10.5" rx="2.6" ry="5.4" transform="rotate(38 18 10.5)" fill="#87A072" />
            <ellipse cx="34" cy="13" rx="2.5" ry="5.2" transform="rotate(24 34 13)" fill="#7A8F68" />
            <ellipse cx="48" cy="12" rx="2.3" ry="4.8" transform="rotate(10 48 12)" fill="#93A87F" />
          </g>
        ))}
      </g>

      {/* scattered gold sparkles */}
      <g className="frame-ornament" fill="#D9BC7E">
        <path d="M24 134 l1.7 3.6 3.6 1.7 -3.6 1.7 -1.7 3.6 -1.7 -3.6 -3.6 -1.7 3.6 -1.7 Z" opacity="0.9" />
        <path d="M271 130 l1.5 3.2 3.2 1.5 -3.2 1.5 -1.5 3.2 -1.5 -3.2 -3.2 -1.5 3.2 -1.5 Z" opacity="0.75" />
        <path d="M150 24 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z" opacity="0.85" />
        <circle cx="48" cy="50" r="1.7" opacity="0.7" />
        <circle cx="252" cy="50" r="1.7" opacity="0.7" />
        <circle cx="118" cy="284" r="1.5" opacity="0.65" />
        <circle cx="182" cy="284" r="1.5" opacity="0.65" />
      </g>
    </svg>
  )
}

export function ScratchCard({ scratch, wedding, isArabic }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [blasting, setBlasting] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const isPointerDown = useRef(false)
  const blastingRef = useRef(false)
  const revealedRef = useRef(false)
  const initialFoilRef = useRef(0)
  const lastCheckRef = useRef(0)
  const rafRef = useRef(0)
  const startBlastRef = useRef<() => void>(() => {})

  /** Draws the rich emerald-and-gold scratch foil clipped to a heart */
  const paintHeart = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = canvas.clientWidth || 300
    const height = canvas.clientHeight || size * 1.6
    canvas.width = size * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    const heart = () => {
      const w = size
      const h = size
      ctx.beginPath()
      ctx.moveTo(w / 2, h * 0.32)
      ctx.bezierCurveTo(w / 2, h * 0.23, w * 0.42, h * 0.15, w * 0.31, h * 0.15)
      ctx.bezierCurveTo(w * 0.17, h * 0.15, w * 0.1, h * 0.28, w * 0.1, h * 0.38)
      ctx.bezierCurveTo(w * 0.1, h * 0.55, w * 0.3, h * 0.68, w / 2, h * 0.86)
      ctx.bezierCurveTo(w * 0.7, h * 0.68, w * 0.9, h * 0.55, w * 0.9, h * 0.38)
      ctx.bezierCurveTo(w * 0.9, h * 0.28, w * 0.83, h * 0.15, w * 0.69, h * 0.15)
      ctx.bezierCurveTo(w * 0.58, h * 0.15, w / 2, h * 0.23, w / 2, h * 0.32)
      ctx.closePath()
    }

    heart()
    ctx.save()
    ctx.clip()

    // Deep royal-emerald foil gradient
    const grad = ctx.createLinearGradient(0, 0, size, size)
    grad.addColorStop(0, '#4A6A54')
    grad.addColorStop(0.45, '#35523F')
    grad.addColorStop(1, '#22392B')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)

    // Fine glitter — gold, ivory and forest speckles
    for (let i = 0; i < 950; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = Math.random() * 1.4 + 0.3
      const roll = Math.random()
      ctx.globalAlpha = 0.18 + Math.random() * 0.55
      ctx.fillStyle =
        roll > 0.72 ? '#E9C46A' : roll > 0.5 ? '#F4E4B8' : roll > 0.22 ? '#FFFDF0' : '#1C3024'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // Etched gold filigree — twin curls flanking a small heart
    ctx.strokeStyle = 'rgba(233, 196, 106, 0.5)'
    ctx.lineWidth = 1.4
    ctx.lineCap = 'round'
    const curl = (side: number) => {
      ctx.save()
      ctx.translate(size / 2, size * 0.36)
      ctx.scale(side, 1)
      ctx.beginPath()
      ctx.moveTo(size * 0.02, 0)
      ctx.bezierCurveTo(size * 0.1, -size * 0.045, size * 0.15, size * 0.01, size * 0.12, size * 0.05)
      ctx.bezierCurveTo(size * 0.1, size * 0.075, size * 0.065, size * 0.06, size * 0.07, size * 0.03)
      ctx.stroke()
      ctx.restore()
    }
    curl(1)
    curl(-1)

    // Etched mini heart at the centre — a hint of what's underneath
    ctx.save()
    ctx.translate(size / 2, size * 0.52)
    const hs = size * 0.085
    ctx.beginPath()
    ctx.moveTo(0, hs * 0.55)
    ctx.bezierCurveTo(-hs * 1.1, -hs * 0.25, -hs * 0.55, -hs * 1.05, 0, -hs * 0.35)
    ctx.bezierCurveTo(hs * 0.55, -hs * 1.05, hs * 1.1, -hs * 0.25, 0, hs * 0.55)
    ctx.strokeStyle = 'rgba(233, 196, 106, 0.55)'
    ctx.lineWidth = 1.3
    ctx.stroke()
    ctx.restore()

    // Soft radiant sheen upper-centre
    const sheen = ctx.createRadialGradient(size * 0.5, size * 0.34, 10, size * 0.5, size * 0.5, size * 0.72)
    sheen.addColorStop(0, 'rgba(255,255,245,0.3)')
    sheen.addColorStop(0.5, 'rgba(255,255,245,0.06)')
    sheen.addColorStop(1, 'rgba(12,26,16,0.28)')
    ctx.fillStyle = sheen
    ctx.fillRect(0, 0, size, size)

    // Diagonal silk band for a foil-like sheen
    const silk = ctx.createLinearGradient(0, size * 0.9, size, size * 0.1)
    silk.addColorStop(0, 'rgba(255,252,240,0)')
    silk.addColorStop(0.48, 'rgba(255,252,240,0.1)')
    silk.addColorStop(0.54, 'rgba(255,252,240,0.16)')
    silk.addColorStop(0.6, 'rgba(255,252,240,0)')
    ctx.fillStyle = silk
    ctx.fillRect(0, 0, size, size)

    ctx.restore()
  }, [])

  /**
   * One readback — counts still-opaque foil samples on a sparse grid.
   * Compared against the baseline taken right after painting this measures
   * scratching of the HEART only (the corners outside the heart are always
   * empty, so they never skew the count).
   */
  const countFoil = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return -1
    const w = canvas.width
    const h = canvas.height
    if (!w || !h) return -1
    let data: Uint8ClampedArray
    try {
      data = ctx.getImageData(0, 0, w, h).data
    } catch {
      return -1
    }
    const stride = Math.max(4, Math.round(w / 90)) * 4
    let opaque = 0
    for (let i = 3; i < data.length; i += stride) {
      if (data[i] > 40) opaque++
    }
    return opaque
  }, [])

  /**
   * The garden blast: the remaining foil shatters into emerald shards while
   * rose petals, sage leaves, gold flecks and star sparkles burst outward,
   * then flutter down with gravity over the revealed wedding date. Twin
   * shock rings and an ivory-gold flash sell the explosion.
   */
  const runBlast = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return false
    const w = canvas.width
    const h = canvas.height
    if (!w || !h) return false

    const dpr = w / (canvas.clientWidth || w)
    const size = w / dpr // heart square in CSS px
    const u = size / 300 // physics scale so the blast feels identical at any size
    const cx = w / 2
    const cy = size * 0.5 * dpr // heart centre in device px

    const particles: Particle[] = []
    const push = (p: Particle) => {
      if (particles.length < MAX_PARTICLES) particles.push(p)
    }

    /** Radial burst helper — outward speed + upward pop */
    const burst = (x: number, y: number, speed: number, up: number) => {
      const dx = x - cx
      const dy = y - cy
      const dist = Math.max(1, Math.hypot(dx, dy))
      return {
        vx: (dx / dist) * speed + (Math.random() - 0.5) * 2.4 * u * dpr,
        vy: (dy / dist) * speed * 0.5 - up,
      }
    }

    const spawnLoose = (kind: ParticleKind, count: number) => {
      for (let i = 0; i < count; i++) {
        // start near the heart's centre mass so the burst reads as one explosion
        const a = Math.random() * Math.PI * 2
        const rad = Math.random() * size * 0.3 * dpr
        const x = cx + Math.cos(a) * rad
        const y = cy + Math.sin(a) * rad * 0.9
        const speed = (1.6 + Math.random() * 4.6) * u * dpr
        const { vx, vy } = burst(x, y, speed, (0.8 + Math.random() * 2.6) * u * dpr)
        const base: Particle = {
          kind,
          x,
          y,
          vx,
          vy,
          size: 1,
          color: '#fff',
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.14,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.03 + Math.random() * 0.08,
          sway: 0,
          life: 1,
          decay: 0.006,
          gravity: 0.2,
          drag: 0.98,
          tumble: Math.random() * Math.PI * 2,
          tumbleSpeed: 0.05 + Math.random() * 0.09,
        }
        if (kind === 'petal') {
          base.size = (6 + Math.random() * 7) * u * dpr
          base.color = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0]
          base.gravity = 0.085 * u * dpr
          base.drag = 0.972
          base.sway = (0.9 + Math.random() * 0.9) * u * dpr
          base.decay = 0.0038 + Math.random() * 0.0042
          base.rotSpeed = (Math.random() - 0.5) * 0.05
        } else if (kind === 'leaf') {
          base.size = (5 + Math.random() * 5) * u * dpr
          base.color = LEAF_COLORS[(Math.random() * LEAF_COLORS.length) | 0]
          base.gravity = 0.115 * u * dpr
          base.drag = 0.975
          base.sway = (0.7 + Math.random() * 0.7) * u * dpr
          base.decay = 0.004 + Math.random() * 0.004
          base.rotSpeed = (Math.random() - 0.5) * 0.07
        } else if (kind === 'fleck') {
          base.size = (1.6 + Math.random() * 2.2) * u * dpr
          base.color = GOLD_FLECKS[(Math.random() * GOLD_FLECKS.length) | 0]
          base.gravity = 0.3 * u * dpr
          base.drag = 0.985
          base.sway = 0.4 * u * dpr
          base.decay = 0.008 + Math.random() * 0.008
        } else {
          // spark — floaty star glint
          base.size = (2.2 + Math.random() * 3) * u * dpr
          base.color = Math.random() > 0.5 ? '#FFF8E6' : '#E9C46A'
          base.gravity = 0.05 * u * dpr
          base.drag = 0.99
          base.sway = 0.55 * u * dpr
          base.decay = 0.011 + Math.random() * 0.009
        }
        push(base)
      }
    }

    // The garden mix
    spawnLoose('petal', 26)
    spawnLoose('leaf', 18)
    spawnLoose('fleck', 40)
    spawnLoose('spark', 18)

    // Foil shards — harvested from the actual remaining foil pixels
    let data: Uint8ClampedArray | null = null
    try {
      data = ctx.getImageData(0, 0, w, h).data
    } catch {
      data = null
    }
    if (data) {
      const step = Math.max(5, Math.round(w / 78))
      const shards: Particle[] = []
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const i = (y * w + x) * 4
          if (data[i + 3] < 130) continue
          const { vx, vy } = burst(x, y, (2.2 + Math.random() * 6.2) * u * dpr, (0.8 + Math.random() * 2.6) * u * dpr)
          shards.push({
            kind: 'shard',
            x,
            y,
            vx,
            vy,
            size: step * (0.5 + Math.random() * 0.7),
            color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
            rot: 0,
            rotSpeed: (Math.random() - 0.5) * 0.12,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: 0.05 + Math.random() * 0.08,
            sway: 0.3 * u * dpr,
            life: 1,
            decay: 0.007 + Math.random() * 0.009,
            gravity: 0.4 * u * dpr,
            drag: 0.985,
            tumble: 0,
            tumbleSpeed: 0,
          })
        }
      }
      const cap = 120
      const take =
        shards.length > cap
          ? shards.filter((_, idx) => idx % Math.ceil(shards.length / cap) === 0)
          : shards
      for (const s of take) push(s)
    }

    if (particles.length === 0) return false

    // clear the foil — the date sits underneath; the particles fly on top
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const maxR = Math.max(w, size * dpr) * 0.62
    let prev = performance.now()
    let elapsedMs = 0

    /** Petal shape — soft teardrop with a lighter inner sheen */
    const drawPetal = (s: number, color: string) => {
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.bezierCurveTo(s * 0.62, -s * 0.5, s * 0.7, s * 0.25, 0, s)
      ctx.bezierCurveTo(-s * 0.7, s * 0.25, -s * 0.62, -s * 0.5, 0, -s)
      ctx.fillStyle = color
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(0, -s * 0.5)
      ctx.bezierCurveTo(s * 0.26, -s * 0.28, s * 0.24, s * 0.2, 0, s * 0.55)
      ctx.bezierCurveTo(-s * 0.24, s * 0.2, -s * 0.26, -s * 0.28, 0, -s * 0.5)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fill()
    }

    /** Leaf shape — pointed ellipse with a centre vein */
    const drawLeaf = (s: number, color: string) => {
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.quadraticCurveTo(s * 0.66, -s * 0.05, 0, s)
      ctx.quadraticCurveTo(-s * 0.66, -s * 0.05, 0, -s)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = 'rgba(28, 44, 20, 0.4)'
      ctx.lineWidth = Math.max(0.6, s * 0.1)
      ctx.beginPath()
      ctx.moveTo(0, -s * 0.6)
      ctx.lineTo(0, s * 0.6)
      ctx.stroke()
    }

    /** Four-point star glint */
    const drawSpark = (s: number, color: string) => {
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.lineTo(s * 0.26, 0)
      ctx.lineTo(0, s)
      ctx.lineTo(-s * 0.26, 0)
      ctx.closePath()
      ctx.moveTo(-s, 0)
      ctx.lineTo(0, s * 0.26)
      ctx.lineTo(s, 0)
      ctx.lineTo(0, -s * 0.26)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    const frame = (now: number) => {
      // rAF timestamps can arrive a hair BEFORE the performance.now() taken
      // at schedule time — clamp to >= 0 or the first frame goes negative
      const dtms = Math.max(0, Math.min(48, now - prev))
      prev = now
      elapsedMs += dtms
      const dt = dtms / 16.667

      ctx.clearRect(0, 0, w, h)

      // ivory-gold flash core for the first beats of the blast
      if (elapsedMs < 300) {
        const p = Math.min(1, elapsedMs / 300)
        const r = maxR * (0.25 + 0.75 * p)
        const flash = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        flash.addColorStop(0, `rgba(255, 250, 235, ${0.85 * (1 - p)})`)
        flash.addColorStop(0.4, `rgba(244, 228, 184, ${0.5 * (1 - p)})`)
        flash.addColorStop(1, 'rgba(233, 196, 106, 0)')
        ctx.fillStyle = flash
        ctx.fillRect(0, 0, w, h)
      }

      // twin shock rings — ivory outer, gold inner
      if (elapsedMs < 460) {
        const p = Math.min(1, elapsedMs / 460)
        const ease = 1 - Math.pow(1 - p, 3)
        ctx.beginPath()
        ctx.arc(cx, cy, Math.max(0, maxR * ease), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 248, 225, ${0.55 * (1 - p)})`
        ctx.lineWidth = Math.max(1, 5 * u * dpr * (1 - p))
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(cx, cy, Math.max(0, maxR * 0.8 * ease), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(233, 196, 106, ${0.4 * (1 - p)})`
        ctx.lineWidth = Math.max(1, 3.4 * u * dpr * (1 - p))
        ctx.stroke()
      }

      let alive = 0
      for (const pt of particles) {
        pt.vy += pt.gravity * dt
        pt.vx *= Math.pow(pt.drag, dt)
        // terminal fall speed per kind — petals float, shards drop
        const term =
          (pt.kind === 'petal'
            ? 2.0
            : pt.kind === 'leaf'
              ? 2.6
              : pt.kind === 'spark'
                ? 1.8
                : pt.kind === 'fleck'
                  ? 6.5
                  : 7.5) *
          u *
          dpr
        if (pt.vy > term) pt.vy = term
        pt.wobble += pt.wobbleSpeed * dt
        pt.tumble += pt.tumbleSpeed * dt
        pt.rot += pt.rotSpeed * dt
        pt.x += (pt.vx + Math.sin(pt.wobble) * pt.sway) * dt
        pt.y += pt.vy * dt
        pt.life -= pt.decay * dt
        if (pt.life <= 0 || pt.y > h + pt.size) continue
        alive++
        // fade near the canvas edges so nothing pops at a hard border
        const fadeBottom = Math.min(1, Math.max(0, (h - pt.y) / (h * 0.14)))
        const fadeTop = Math.min(1, Math.max(0, pt.y / (h * 0.08)))
        const twinkle = pt.kind === 'spark' ? 0.55 + 0.45 * Math.sin(pt.wobble * 2.7) : 1
        ctx.globalAlpha = Math.max(0, Math.min(1, pt.life)) * fadeBottom * fadeTop * twinkle

        ctx.save()
        ctx.translate(pt.x, pt.y)
        ctx.rotate(pt.rot)
        if (pt.kind === 'petal' || pt.kind === 'leaf') {
          // scaleX oscillation fakes a 3D tumble as they flutter down
          const flip = 0.25 + 0.75 * Math.abs(Math.cos(pt.tumble))
          ctx.scale(flip, 1)
          if (pt.kind === 'petal') drawPetal(pt.size, pt.color)
          else drawLeaf(pt.size, pt.color)
        } else if (pt.kind === 'spark') {
          drawSpark(pt.size, pt.color)
        } else if (pt.kind === 'fleck') {
          ctx.rotate(Math.PI / 4)
          ctx.fillStyle = pt.color
          ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size)
        } else {
          ctx.fillStyle = pt.color
          ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size)
        }
        ctx.restore()
      }
      ctx.globalAlpha = 1

      if (alive > 0 && elapsedMs < 3600) {
        rafRef.current = requestAnimationFrame(frame)
        return
      }

      // blast over — hand the stage to the revealed state
      ctx.clearRect(0, 0, w, h)
      blastingRef.current = false
      revealedRef.current = true
      setBlasting(false)
      setRevealed(true)
    }

    rafRef.current = requestAnimationFrame(frame)
    return true
  }, [])

  /** Blasts the remaining foil away and reveals the wedding date */
  const startBlast = useCallback(() => {
    if (blastingRef.current || revealedRef.current) return
    const canvas = canvasRef.current

    // reduced motion: no particles — clear and reveal straight away
    if (!canvas || reducedMotion) {
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
      }
      revealedRef.current = true
      setRevealed(true)
      return
    }

    blastingRef.current = true
    setBlasting(true)
    if (!runBlast(canvas)) {
      // particle harvest failed — reveal instantly instead
      blastingRef.current = false
      setBlasting(false)
      revealedRef.current = true
      setRevealed(true)
    }
  }, [reducedMotion, runBlast])

  useEffect(() => {
    startBlastRef.current = startBlast
  }, [startBlast])

  /**
   * Throttled progress check: once half of the original foil is gone,
   * the rest blasts automatically.
   */
  const checkProgress = useCallback(
    (force = false) => {
      if (blastingRef.current || revealedRef.current) return
      const now = performance.now()
      if (!force && now - lastCheckRef.current < 120) return
      lastCheckRef.current = now
      const baseline = initialFoilRef.current
      if (baseline <= 0) return
      const remaining = countFoil()
      if (remaining < 0) return
      if (remaining <= baseline * (1 - SCRATCH_BLAST_AT)) {
        startBlastRef.current()
      }
    },
    [countFoil],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return
    paintHeart(canvas)
    initialFoilRef.current = countFoil()

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Pointer input lives on the square STAGE (the canvas is 160% tall for
    // fall room, so it must not swallow taps on the hint/button below).
    const scratchAt = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      const radius = 24

      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const onPointerDown = (e: PointerEvent) => {
      if (blastingRef.current || revealedRef.current) return
      isPointerDown.current = true
      scratchAt(e.clientX, e.clientY)
      checkProgress(true)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current) return
      if (blastingRef.current || revealedRef.current) return
      scratchAt(e.clientX, e.clientY)
      checkProgress()
    }

    const onPointerUp = () => {
      if (!isPointerDown.current) return
      isPointerDown.current = false
      checkProgress(true)
    }

    stage.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      stage.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [paintHeart, checkProgress, countFoil])

  /** Opens Google Calendar prefilled with the wedding event — guest just hits Save */
  const addToGoogleCalendar = () => {
    startBlast()
    const start = new Date(invitation.wedding.dateTime)
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Wedding of ${invitation.closing.signature}`,
      dates: `${icsDate(start)}/${icsDate(end)}`,
      details: invitation.message.replace(/\n/g, ' '),
      location: `${invitation.venue.name}, ${invitation.venue.address}`,
      ctz: 'Asia/Calcutta',
    })
    window.open(
      `https://calendar.google.com/calendar/render?${params.toString()}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <section className="section scratch-section" aria-labelledby="scratch-heading">
      <SectionHeading icon={<SparkleHeart />} title={scratch.heading} id="scratch-heading" />
      <div className="scratch" data-reveal>
        <div
          ref={stageRef}
          className={`scratch__stage${revealed ? ' scratch__stage--revealed' : ''}${
            blasting ? ' scratch__stage--blasting' : ''
          }`}
        >
          <div className="scratch__reveal" aria-hidden={!revealed}>
            <Flourish />
            <p className="scratch__invited">{scratch.revealedTitle}</p>
            <p className="scratch__date">{wedding.dateLabel}</p>
            <p className="scratch__day">{wedding.dayLabel}</p>
            <p className="scratch__time">{wedding.timeLabel}</p>
            <Flourish end />
          </div>
          {!revealed && (
            <canvas
              ref={canvasRef}
              className={`scratch__canvas${blasting ? ' scratch__canvas--blasting' : ''}`}
              role="img"
              aria-label="Scratch the heart to reveal the wedding date"
              tabIndex={blasting ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  startBlast()
                }
              }}
            />
          )}
          {/* Gilt heart frame — scratched foil melts away, the frame remains */}
          <HeartFrame />
        </div>
        {!(revealed && reducedMotion) && (
          <p
            className={`scratch__hint${revealed && !reducedMotion ? ' scratch__hint--done' : ''}${
              blasting ? ' scratch__hint--hide' : ''
            }`}
          >
            {revealed
              ? isArabic
                ? 'نتطلع بشوق لرؤيتكم!'
                : 'See you there! ❤'
              : scratch.revealHint}
          </p>
        )}
      </div>

      {/* Save the Date pill button matching Screenshot 3 */}
      <button
        type="button"
        className="btn-primary save-date-pill"
        onClick={addToGoogleCalendar}
        aria-label="Add wedding date to Google Calendar"
      >
        <CalendarPlus size={16} aria-hidden="true" />
        <span>{scratch.saveTheDate}</span>
      </button>
    </section>
  )
}

export default ScratchCard