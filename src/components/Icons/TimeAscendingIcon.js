import React from 'react'

export default function TimeAscendingIcon({
  size = 28,
  className = 'text-dark-100',
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
          d="M8.5 19.5H10.3866C10.6363 19.5 10.7767 19.7871 10.6234 19.9842L7.73681 23.6955C7.6167 23.85 7.3833 23.85 7.26319 23.6955L4.37659 19.9842C4.22332 19.7871 4.36375 19.5 4.61339 19.5H6.5V5.3C6.5 5.13431 6.63431 5 6.8 5H8.2C8.36569 5 8.5 5.13431 8.5 5.3V19.5ZM18.5 7.5C14.64 7.5 11.5 10.63 11.5 14.5C11.5 18.37 14.63 21.5 18.5 21.5C22.36 21.5 25.5 18.37 25.5 14.5C25.5 10.63 22.37 7.5 18.5 7.5ZM20.69 17.03L17.5 15.19V11.5H19V14.32L21.44 15.73L20.69 17.03Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}
