import React from 'react'
import cn from 'classnames'

export default function Increase({
  handleChange,
  className,
  decrementYears,
  incrementYears,
  years,
  setYears,
  handleYear,
  disable,
}) {
  return (
    <div
      className={cn(
        'w-[120px] md:w-[160px] flex items-center justify-between px-2',
        className
      )}
    >
      <button
        disabled={years < 1}
        onClick={decrementYears}
        className={cn(
          'w-[20px] h-[20px] flex justify-center items-center text-white rounded-full cursor-pointer',
          years > 1 ? 'bg-green-300/50' : 'bg-gray-800',
          disable ? 'opacity-0' : ''
        )}
      >
        -
      </button>
      <input
        disabled={disable}
        min="0.077"
        onChange={(event) => {
          setYears(event.target.value ? parseFloat(event.target.value) : 0)
        }}
        className="text-white text-center text-base w-[60%] bg-transparent active:outline-none active:border-0"
        type="number"
        value={parseFloat(years)}
      />
      <button
        onClick={incrementYears}
        className={cn(
          'w-[20px] h-[20px] bg-green-300/50 flex justify-center items-center text-white rounded-full cursor-pointer',
          disable ? 'opacity-0' : ''
        )}
      >
        +
      </button>
    </div>
  )
}
