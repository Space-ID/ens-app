import React from 'react'

export default function TwoPoints({ className = 'text-green-100', size = 8 }) {
  return (
    <div className={className}>
      <svg
        width={size}
        viewBox="0 0 8 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect y="0.000488281" width="8" height="8" rx="3" fill="currentColor" />
        <rect y="13.9995" width="8" height="8" rx="3" fill="currentColor" />
      </svg>
    </div>
  )
}
