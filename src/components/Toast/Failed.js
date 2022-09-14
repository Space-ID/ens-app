import React from 'react'
import FailedCircleIcon from '../Icons/FailedCircleIcon'

export default function Failed({ label }) {
  return (
    <div className="space-x-[10px] flex items-center">
      <FailedCircleIcon />
      <p className="text-xl font-semibold leading-7 text-white font-urbanist">
        {label}
      </p>
    </div>
  )
}
