import React from 'react'
import Increase from 'components/Increase'

const Years = ({ years, setYears, disable }) => {
  const incrementYears = () => setYears(years + 1)
  const decrementYears = () => (years >= 1 ? setYears(years - 1) : null)
  return (
    <div className="md:ml-[9px]">
      <Increase
        disable={disable}
        years={years}
        decrementYears={decrementYears}
        incrementYears={incrementYears}
        setYears={setYears}
      />
      <div className="text-center text-white font-semibold mt-1 text-[12px] leading-[20px]">
        {' '}
        Registration Year{' '}
      </div>
    </div>
  )
}

export default Years
