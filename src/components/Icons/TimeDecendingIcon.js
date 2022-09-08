import React from 'react'

export default function TimeDecendingIcon({
  className = 'text-dark-100',
  size = 28,
}) {
  return (
    <div className={className}>
      <svg
        width={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.5 7.5C14.64 7.5 11.5 10.63 11.5 14.5C11.5 18.37 14.63 21.5 18.5 21.5C22.36 21.5 25.5 18.37 25.5 14.5C25.5 10.63 22.37 7.5 18.5 7.5ZM20.69 17.03L17.5 15.19V11.5H19V14.32L21.44 15.73L20.69 17.03Z"
          fill="currentColor"
        />
        <path
          d="M4.61339 9.5L6.5 9.5L6.5 23.7C6.5 23.8657 6.63431 24 6.8 24L8.2 24C8.36569 24 8.5 23.8657 8.5 23.7L8.5 9.5L10.3866 9.5C10.6363 9.5 10.7767 9.21288 10.6234 9.01582L7.73681 5.30446C7.6167 5.15004 7.3833 5.15004 7.2632 5.30446L4.37659 9.01582C4.22332 9.21287 4.36375 9.5 4.61339 9.5Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
