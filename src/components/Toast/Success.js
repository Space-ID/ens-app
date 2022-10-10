import React from 'react'

export default function Success({ label }) {
  return (
    <div className="space-x-[10px] flex items-center">
      <p className="text-xl font-semibold leading-7 text-white font-urbanist whitespace-nowrap">
        {label}
      </p>
    </div>
  )
}
