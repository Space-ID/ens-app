import React from 'react'

export default function ArrowIcon({
  className = 'text-dark-common',
  size = 9,
  direction = 'right',
}) {
  let deg = 0
  switch (direction) {
    case 'bottom':
      deg = 90
      break
    case 'left':
      deg = 180
      break
    case 'top':
      deg = 270
      break
    default:
      break
  }
  return (
    <div style={{ transform: `rotate(${deg}deg)` }} className={className}>
      <svg
        width={size}
        viewBox="0 0 9 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 1L7 7L1 13" stroke="currentColor" stroke-width="2" />
      </svg>
    </div>
  )
}
