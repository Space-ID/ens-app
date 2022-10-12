import React from 'react'
import priceCalculator from './PriceCalculator'

const Price = ({ className, loading, price, ethUsdPrice }) => {
  let c
  if (!loading && price) {
    c = priceCalculator({
      price, // in ETH, BN
      premium: price, // in ETH
      ethUsdPrice,
    })
  }
  const priceInUsd = c?.priceInUsd ?? 0
  return <div className={className}>{price.toFixed(3)} BNB</div>
}

export default Price
