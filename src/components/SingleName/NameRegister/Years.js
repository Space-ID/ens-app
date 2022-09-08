import React from 'react'
import Increase from 'components/Increase'

const Years = ({ years, setYears, disable }) => {
  const incrementYears = () => setYears((parseFloat(years) + 1).toFixed(3))
  const decrementYears = () =>
    years >= 1 ? setYears((years - 1).toFixed(3)) : null
  return (
    <div className="md:ml-[9px]">
      <Increase
        disable={disable}
        years={years}
        decrementYears={decrementYears}
        incrementYears={incrementYears}
        setYears={setYears}
      />
      <div className="mt-1 text-xs font-semibold leading-5 text-center text-white">
        {' '}
        Registration Year{' '}
      </div>
    </div>
  )
}

export default Years
