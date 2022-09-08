import React, { useState } from 'react'
import cn from 'classnames'
import { SettingIcon } from 'components/Icons'

export default function EditButton({ className, isON, handleClick }) {
  return (
    <React.Fragment>
      {isON ? (
        <button
          onClick={() => handleClick(!isON)}
          className={cn(
            'bg-blue-100 rounded-[15px] text-white flex py-[5px] px-3 font-semibold cursor-pointer',
            className
          )}
        >
          Edit on <SettingIcon className="text-white ml-[10px]" />
        </button>
      ) : (
        <button
          onClick={() => {
            handleClick(!isON)
          }}
          className={cn(
            'text-green-100 flex py-[5px] px-3 font-semibold cursor-pointer',
            className
          )}
        >
          Edit off <SettingIcon className="text-green-100 ml-[10px]" />
        </button>
      )}
    </React.Fragment>
  )
}
