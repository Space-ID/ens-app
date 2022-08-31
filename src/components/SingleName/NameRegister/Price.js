import React from 'react'
import priceCalculator from './PriceCalculator'

const Price = ({
  loading,
  price,
  ethUsdPrice,
  ethUsdPremiumPrice,
  underPremium,
  years,
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
      <div className="w-[120px] md:w-[160px] h-[40px] flex justify-center items-center bg-[#C4C4C4]/20 text-white font-bold font-urbanist text-[18px] leading-[26px] rounded-[8px]">
        {registrationFee.toFixed(3)} <span>BNB</span>
        {withPremium && (
          <span>
            {withPremium}${priceInUsd} USD
          </span>
        )}
      </div>
      <div className="text-center text-white font-semibold mt-1 text-[12px] leading-[20px]">
        Registration Fee
      </div>
    </div>
  )
}

export default Price
