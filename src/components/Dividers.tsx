
import React from 'react'

const DIVIDER_IMAGES = {
  1: '/images/dividers/1.png',
  2: '/images/dividers/2.png',
  3: '/images/dividers/3.png',
  4: '/images/dividers/4.png',
}

type DividerImage = keyof typeof DIVIDER_IMAGES

/** Decorative image divider for the wedding invitation */
export function FloralDivider({
  image = 2,
  className = '',
}: {
  image?: DividerImage
  className?: string
}) {
  return (
    <div
      className={`floral-divider ${className}`}
      aria-hidden="true"
    >
      <img
        src={DIVIDER_IMAGES[image]}
        alt=""
        className="floral-divider__image"
        loading="lazy"
        draggable={false}
      />
    </div>
  )
}

/** Traditional divider used beneath section headings */
export function HeartDivider({
  image,
}: {
  image?: DividerImage
}) {
  return <FloralDivider image={image ?? 2} />
}

/** Decorative divider between sections */
export function WavyDivider({
  image = 3,
}: {
  image?: DividerImage
}) {
  return <FloralDivider image={image} />
}

/** Standard section heading */
export function SectionHeading({
  icon,
  title,
  id,
  dividerImage = 2,
}: {
  icon: React.ReactNode | null
  title: string
  id: string
  dividerImage?: DividerImage
}) {
  return (
    <header className="section-head" data-reveal>
      {icon && (
        <div className="section-head__icon">
          {icon}
        </div>
      )}

      <h2 className="section-head__title script-lg" id={id}>
        {title}
      </h2>

      <HeartDivider image={dividerImage} />
    </header>
  )
}
