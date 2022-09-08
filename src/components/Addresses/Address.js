import React from 'react'
import EmailImg from 'assets/images/profile/email.png'
import cn from 'classnames'

export default function Address({
  description = 'example@email.com',
  imageUrl = EmailImg,
  title = 'Email',
  bgColorClass = 'bg-[rgba(50,126,164,0.6)]',
  canEdit = false,
}) {
  return (
    <div
      className={cn(
        'group cursor-pointer rounded-[28px] w-full min-h-[56px] justify-center items-center text-white font-urbanist py-[9px] font-semibold text-base pl-6 relative',
        bgColorClass
      )}
    >
      {canEdit && (
        <div className="absolute hidden group-hover:flex w-full h-full bg-[rgba(72,143,139,0.25)] top-0 left-0 rounded-[28px] border-[2px] border-green-200 backdrop-blur-[8px] justify-center items-center font-semibold text-[18px]">
          <span className="mr-1">Edit</span>
          <span className="mr-1">|</span>
          <span className="text-rose-600">Delete</span>
        </div>
      )}

      <div className="text-xs text-gray-600 font-urbanist">{title}</div>
      <div className="text-semibold">{description}</div>
      <div className="absolute right-0 top-1">
        <img alt="email" src={imageUrl} />
      </div>
    </div>
  )
}
