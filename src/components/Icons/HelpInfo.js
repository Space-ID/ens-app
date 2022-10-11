import React from 'react'

export default function HelpInfo({ size = 12, className }) {
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M5.1204 3.8544C5.01729 3.92721 4.93398 4.02461 4.87803 4.13777C4.82208 4.25093 4.79526 4.37626 4.8 4.5024C4.8 4.66153 4.73679 4.81414 4.62426 4.92666C4.51174 5.03919 4.35913 5.1024 4.2 5.1024C4.04087 5.1024 3.88826 5.03919 3.77574 4.92666C3.66321 4.81414 3.6 4.66153 3.6 4.5024C3.6 3.7968 3.9264 3.2472 4.404 2.892C4.8648 2.5488 5.448 2.3964 6 2.3964C6.552 2.3964 7.134 2.5488 7.596 2.8908C8.0736 3.246 8.4 3.7956 8.4 4.5012C8.4 5.016 8.238 5.4072 7.9596 5.7084C7.74 5.946 7.458 6.108 7.2636 6.2196L7.2024 6.2556C6.978 6.3864 6.8472 6.4764 6.7584 6.594C6.6816 6.6924 6.6 6.858 6.6 7.1988C6.6 7.35793 6.53679 7.51054 6.42426 7.62306C6.31174 7.73559 6.15913 7.7988 6 7.7988C5.84087 7.7988 5.68826 7.73559 5.57574 7.62306C5.46321 7.51054 5.4 7.35793 5.4 7.1988C5.4 6.6396 5.544 6.2052 5.8056 5.8632C6.0528 5.5404 6.372 5.3496 6.5976 5.2188L6.6312 5.1996C6.8676 5.0616 6.9888 4.9908 7.0776 4.8936C7.1376 4.83 7.2 4.7352 7.2 4.5012C7.20496 4.37502 7.17824 4.24962 7.12227 4.13642C7.0663 4.02323 6.98287 3.92586 6.8796 3.8532C6.666 3.696 6.348 3.5976 6 3.5976C5.652 3.5976 5.3352 3.696 5.1204 3.8556V3.8544ZM6 9.6C6.15913 9.6 6.31174 9.53679 6.42426 9.42426C6.53679 9.31174 6.6 9.15913 6.6 9C6.6 8.84087 6.53679 8.68826 6.42426 8.57574C6.31174 8.46321 6.15913 8.4 6 8.4C5.84087 8.4 5.68826 8.46321 5.57574 8.57574C5.46321 8.68826 5.4 8.84087 5.4 9C5.4 9.15913 5.46321 9.31174 5.57574 9.42426C5.68826 9.53679 5.84087 9.6 6 9.6ZM0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 7.5913 11.3679 9.11742 10.2426 10.2426C9.11742 11.3679 7.5913 12 6 12C4.4087 12 2.88258 11.3679 1.75736 10.2426C0.632141 9.11742 0 7.5913 0 6ZM6 1.2C4.72696 1.2 3.50606 1.70571 2.60589 2.60589C1.70571 3.50606 1.2 4.72696 1.2 6C1.2 7.27304 1.70571 8.49394 2.60589 9.39411C3.50606 10.2943 4.72696 10.8 6 10.8C7.27304 10.8 8.49394 10.2943 9.39411 9.39411C10.2943 8.49394 10.8 7.27304 10.8 6C10.8 4.72696 10.2943 3.50606 9.39411 2.60589C8.49394 1.70571 7.27304 1.2 6 1.2Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}