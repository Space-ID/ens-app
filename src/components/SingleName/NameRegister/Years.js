import React from 'react'
import Increase from 'components/Increase'

const Years = ({ years, setYears, disable }) => {
  const incrementYears = () => setYears((parseFloat(years) + 1).toFixed(3))
  const decrementYears = () =>
    years >= 1 ? setYears((years - 1).toFixed(3)) : null
  return (
    <Increase
      disable={disable}
      years={years}
      decrementYears={decrementYears}
      incrementYears={incrementYears}
      setYears={setYears}
    />
  )
}

export default Years
