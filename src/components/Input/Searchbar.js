import React from 'react'
import cn from 'classnames'

import SearchIcon from 'components/Icons/SearchIcon'

export default function Searchbar({ className, onChangeHandler }) {
  return (
    <div className={cn('relative w-full', className)}>
      <SearchIcon className="text-[rgba(204,252,255,0.3)] absolute top-[7px] left-[10px]" />
      <input
        onChange={onChangeHandler}
        className="border-[rgba(204,252,255,0.6)] border rounded-2xl bg-transparent w-full h-[30px] pl-[30px]"
      />
    </div>
  )
}
