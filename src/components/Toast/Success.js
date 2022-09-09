import { SuccessCheckIcon } from 'components/Icons'
import React from 'react'

export default function Success({ label }) {
  return (
    <div className="space-x-[10px] flex items-center">
      <SuccessCheckIcon />
      <p className="text-xl font-semibold leading-7 text-white font-urbanist">
        {label}
      </p>
    </div>
  )
}
