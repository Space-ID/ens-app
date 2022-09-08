import React from 'react'
import cn from 'classnames'

export default function WidgetFunction({ className }) {
  const noAnnouncement = true
  return (
    <div className={cn('w-full bg-gray-800 rounded-2xl h-[44px]', className)} />
  )
}
