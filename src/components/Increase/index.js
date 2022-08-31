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
        'w-[120px] md:w-[160px] h-[40px] bg-[#C4C4C4]/20 flex rounded-[8px] items-center justify-between px-2',
        className
      )}
    >
      <button
        disabled={years < 1}
        onClick={decrementYears}
        className={cn(
          'w-[24px] h-[24px] flex justify-center items-center text-white rounded-[4px] cursor-pointer',
          years > 1 ? 'bg-[#0EA59C]/50' : 'bg-[#7E9195]',
          disable ? 'opacity-0' : ''
        )}
      >
        -
      </button>
      <input
        disabled={disable}
        min="0.1"
        onChange={(event) => {
          setYears(event.target.value)
        }}
        className="text-white text-center font-bold font-urbanist text-[18px] w-[60%] bg-transparent active:outline-none active:border-0"
        type="number"
        value={parseFloat(years)}
      />
      <button
        onClick={incrementYears}
        className={cn(
          'w-[24px] h-[24px] bg-[#0EA59C]/50 flex justify-center items-center text-white rounded-[4px] cursor-pointer',
          disable ? 'opacity-0' : ''
        )}
      >
        +
      </button>
    </div>
  )
}
