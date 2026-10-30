import { useEffect, useRef, useState } from 'react'
import { invitation } from '../data'
import './Carousel.css'

export function Carousel() {
  const images = invitation.gallery
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const pointerStart = useRef<number | null>(null)

  useEffect(() => {
    if (paused || document.hidden) return
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 4500)
    return () => window.clearInterval(t)
  }, [paused, images.length])

  return (
    <section className="section carousel-section" aria-label="Photo gallery">
      <div
        className="carousel"
        data-reveal
        onPointerDown={(e) => {
          pointerStart.current = e.clientX
          setPaused(true)
        }}
        onPointerUp={(e) => {
          const start = pointerStart.current
          pointerStart.current = null
          setPaused(false)
          if (start === null) return
          const dx = e.clientX - start
          if (Math.abs(dx) > 40) {
            setIndex((i) => (i + (dx < 0 ? 1 : images.length - 1)) % images.length)
          }
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className={`carousel__img${i === index ? ' carousel__img--active' : ''}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            draggable={false}
          />
        ))}
      </div>

      {/* Dots indicator placed cleanly below the photo on the linen background (Screenshot 4) */}
      <div className="carousel__dots-external" role="tablist" aria-label="Choose photo" data-reveal>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Photo ${i + 1}`}
            className={`carousel__dot${i === index ? ' carousel__dot--active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}

export default Carousel
