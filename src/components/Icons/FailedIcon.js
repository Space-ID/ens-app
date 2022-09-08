import React from 'react'

export default function FailedIcon({ size = 20, className = 'text-red-100' }) {
  return (
    <div className={className}>
      <svg
        width={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM10.0026 10.7249L13.2746 14L14 13.2699L10.728 10L14 6.73008L13.2746 6.00514L10.0026 9.27506L6.73055 6L6 6.73008L9.27717 10L6 13.2699L6.73055 14L10.0026 10.7249Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
