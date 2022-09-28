import React from 'react'
import cn from 'classnames'

function NumberInput({
  value = 0,
  onChange,
  className,
  disable,
  step = 1,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
}) {
  const onIncrease = () => {
    const res = value + step
    if (max !== undefined && res <= max) {
      onChange(res)
    }
  }
  const onDecrease = () => {
    const res = value - step
    if (min !== undefined && res >= min) {
      onChange(res)
    }
  }
  const handleInput = (e) => {
    const v = parseInt(e.target.value)
    if (v > max) {
      onChange(max)
    } else if (v < min) {
      onChange(min)
    } else {
      onChange(min)
    }
  }
  return (
    <div
      className={cn(
        'w-[120px] md:w-[160px] h-[40px] bg-[#C4C4C4]/20 flex rounded-lg items-center justify-between px-2',
        className
      )}
    >
      <button
        onClick={onDecrease}
        disabled={disable}
        className={cn(
          'w-[24px] h-[24px] flex justify-center items-center text-white rounded-md cursor-pointer',
          value > min ? 'bg-green-300/50' : 'bg-gray-800',
          disable ? 'opacity-0' : ''
        )}
      >
        -
      </button>
      <input
        disabled={disable}
        min={min}
        max={max}
        onChange={handleInput}
        className="text-white text-center font-bold font-urbanist text-lg w-[60%] bg-transparent active:outline-none active:border-0"
        type="number"
        value={`${value}`}
      />
      <button
        onClick={onIncrease}
        disabled={disable}
        className={cn(
          'w-[24px] h-[24px] bg-green-300/50 flex justify-center items-center text-white rounded-md cursor-pointer',
          value < max ? 'bg-green-300/50' : 'bg-gray-800',
          disable ? 'opacity-0' : ''
        )}
      >
        +
      </button>
    </div>
  )
}

export default NumberInput
