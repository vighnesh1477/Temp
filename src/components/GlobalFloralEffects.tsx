import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../utils/helpers'

type Particle = {
  id: number
  x: number
  y: number
  symbol: string
  size: number
  duration: number
  dx: number
  dy: number
  rotation: number
  createdAt: number
  burst: boolean
}

const AMBIENT_FLOWERS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: 14 + ((i * 7) % 12),
  duration: 14 + ((i * 3) % 12),
  delay: -((i * 2.7) % 20),
  symbol: ['❀', '✿', '❁', '❋'][i % 4],
}))

const FLOWER_SYMBOLS = ['❀', '✿', '❁', '❋', '🍃', '❧']
/** Matched to the invite palette — blush, champagne, gold, deep rose, sage, ivory */
const FLOWER_COLORS = ['#E8B4B8', '#F3D9C6', '#D9BC7E', '#C97F88', '#A8BF97', '#FFF3E2']

/**
 * Global floral ambience — gentle flowers drifting across the whole page,
 * a blossom trail behind the cursor and a petal burst on every click.
 * Purely decorative: fixed layer, pointer-events none, respects reduced motion.
 */
export function GlobalFloralEffects() {
  const [particles, setParticles] = useState<Particle[]>([])
  const nextId = useRef(0)
  const lastTrailTime = useRef(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const spawn = (x: number, y: number, burst: boolean, count: number) => {
      const now = Date.now()

      const created: Particle[] = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2
        const distance = burst ? 45 + Math.random() * 100 : 15 + Math.random() * 35

        const id = nextId.current++

        return {
          id,
          x,
          y,
          symbol: FLOWER_SYMBOLS[Math.floor(Math.random() * FLOWER_SYMBOLS.length)],
          size: burst ? 14 + Math.random() * 13 : 12 + Math.random() * 9,
          duration: burst ? 1.2 + Math.random() * 0.9 : 1.5 + Math.random() * 1.2,
          dx: Math.cos(angle) * distance,
          dy: burst ? Math.sin(angle) * distance - 20 : 40 + Math.random() * 60,
          rotation: Math.random() * 260 - 130,
          createdAt: now,
          burst,
        }
      })

      setParticles((current) => [...current, ...created].slice(-100))
    }

    const handlePointerMove = (event: PointerEvent) => {
      // Only create hover trails for mouse or trackpad.
      if (event.pointerType !== 'mouse') return

      const now = performance.now()

      // Limit particle creation to keep the page smooth.
      if (now - lastTrailTime.current < 130) return

      lastTrailTime.current = now
      spawn(event.clientX, event.clientY, false, 1)
    }

    const handleClick = (event: MouseEvent) => {
      spawn(event.clientX, event.clientY, true, 9)
    }

    const cleanup = window.setInterval(() => {
      const now = Date.now()

      setParticles((current) =>
        current.filter((particle) => now - particle.createdAt < particle.duration * 1000 + 200),
      )
    }, 700)

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('click', handleClick)
      window.clearInterval(cleanup)
    }
  }, [reducedMotion])

  return (
    <>
      <style>{`
        .global-floral-layer {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow: hidden;
          pointer-events: none;
          contain: layout paint;
        }

        .ambient-flower {
          position: absolute;
          color: #E0AFBB;
          opacity: 0;
          line-height: 1;
          user-select: none;
          will-change: transform, opacity;
          animation: ambient-flower-float linear infinite;
        }

        @keyframes ambient-flower-float {
          0% {
            transform: translate3d(0, 35px, 0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.24;
          }
          50% {
            transform: translate3d(25px, -35px, 0) rotate(110deg);
            opacity: 0.3;
          }
          85% {
            opacity: 0.2;
          }
          100% {
            transform: translate3d(-18px, -110px, 0) rotate(230deg);
            opacity: 0;
          }
        }

        .floral-particle {
          position: fixed;
          display: block;
          line-height: 1;
          user-select: none;
          pointer-events: none;
          will-change: transform, opacity;
          text-shadow: 0 2px 8px rgba(137, 85, 89, 0.12);
        }

        .floral-particle-burst {
          animation: floral-burst-animation ease-out forwards;
        }

        .floral-particle-trail {
          animation: floral-trail-animation ease-out forwards;
        }

        @keyframes floral-burst-animation {
          0% {
            transform: translate(-50%, -50%) scale(0.2) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.15) rotate(20deg);
          }
          100% {
            transform:
              translate(
                calc(-50% + var(--flower-dx)),
                calc(-50% + var(--flower-dy))
              )
              rotate(var(--flower-rotation))
              scale(0.55);
            opacity: 0;
          }
        }

        @keyframes floral-trail-animation {
          0% {
            transform: translate(-50%, -50%) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          100% {
            transform:
              translate(
                calc(-50% + var(--flower-dx)),
                calc(-50% + var(--flower-dy))
              )
              rotate(var(--flower-rotation))
              scale(0.45);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ambient-flower {
            animation-duration: 35s !important;
          }
        }
      `}</style>

      <div className="global-floral-layer" aria-hidden="true">
        {/* Gentle floating flowers across the whole website */}
        {AMBIENT_FLOWERS.map((flower, i) => (
          <span
            key={`ambient-${i}`}
            className="ambient-flower"
            style={{
              left: flower.left,
              top: flower.top,
              fontSize: `${flower.size}px`,
              animationDuration: `${flower.duration}s`,
              animationDelay: `${flower.delay}s`,
            }}
          >
            {flower.symbol}
          </span>
        ))}

        {/* Click bursts and mouse-hover trails */}
        {particles.map((particle) => (
          <span
            key={particle.id}
            className={`floral-particle ${
              particle.burst ? 'floral-particle-burst' : 'floral-particle-trail'
            }`}
            style={
              {
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                fontSize: `${particle.size}px`,
                color: FLOWER_COLORS[particle.id % FLOWER_COLORS.length],
                animationDuration: `${particle.duration}s`,
                '--flower-dx': `${particle.dx}px`,
                '--flower-dy': `${particle.dy}px`,
                '--flower-rotation': `${particle.rotation}deg`,
              } as CSSProperties
            }
          >
            {particle.symbol}
          </span>
        ))}
      </div>
    </>
  )
}

export default GlobalFloralEffects