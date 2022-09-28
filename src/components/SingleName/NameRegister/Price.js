import React from 'react'
import priceCalculator from './PriceCalculator'

const Price = ({
  loading,
  price,
  ethUsdPrice,
  ethUsdPremiumPrice,
  underPremium,
  registrationFee,
}) => {
  let withPremium, c
  if (!loading && price) {
    c = priceCalculator({
      price, // in ETH, BN
      premium: price, // in ETH
      ethUsdPrice,
    })
    if (underPremium) {
      withPremium =
        underPremium && ethUsdPremiumPrice
          ? `$${c.basePriceInUsd}(+$${c.premiumInUsd}) =`
          : null
    }
  }
  const priceInUsd = c?.priceInUsd
  return (
    <div>
      <div className="w-[120px] md:w-[160px] h-[40px] flex justify-center items-center bg-[#C4C4C4]/20 text-white font-bold font-urbanist text-lg rounded-lg">
        {registrationFee.toFixed(3)} <span>BNB</span>
        {withPremium && (
          <span>
            {withPremium}${priceInUsd} USD
          </span>
        )}
      </div>
      <div className="mt-1 text-xs font-semibold leading-5 text-center text-white">
        Registration Fee
      </div>
    </div>
  )
}

export default Price
