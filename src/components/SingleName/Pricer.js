import React from 'react'
import cn from 'classnames'
import EthVal from 'ethval'
import { useSelector } from 'react-redux'

import Years from './NameRegister/Years'
import Price from './NameRegister/Price'
import EthRegistrationGasPrice from './NameRegister/EthRegistrationGasPrice'
import { useTranslation } from 'react-i18next'

function PricerInner({
  years,
  setYears,
  ethUsdPriceLoading,
  ethUsdPrice,
  ethUsdPremiumPrice,
  className,
  loading,
  price,
  premiumOnlyPrice,
  gasPrice,
  reference,
  underPremium,
  name,
  displayGas = false,
  isAuctionWinner,
}) {
  const ethVal = new EthVal(`${price || 0}`).toEth()
  const registrationFee = ethVal
  return (
    <>
      <div className={cn('flex justify-between', className)} ref={reference}>
        <Years years={years} setYears={setYears} />
        <span className="text-white font-bold font-urbanist text-[18px] flex pt-2 mr-[13px]">
          =
        </span>
        <Price
          isAuctionWinner={isAuctionWinner}
          price={price}
          premiumOnlyPrice={premiumOnlyPrice}
          gasPrice={gasPrice}
          loading={loading}
          ethUsdPriceLoading={ethUsdPriceLoading}
          ethUsdPrice={ethUsdPrice}
          ethUsdPremiumPrice={ethUsdPremiumPrice}
          underPremium={underPremium}
          years={years}
          registrationFee={registrationFee}
        />
      </div>
      {displayGas && gasPrice && (
        <div>
          <EthRegistrationGasPrice
            name={name}
            price={price}
            gasPrice={gasPrice}
            loading={loading}
            ethUsdPriceLoading={ethUsdPriceLoading}
            ethUsdPrice={ethUsdPrice}
            ethUsdPremiumPrice={ethUsdPremiumPrice}
            underPremium={underPremium}
            years={years}
            isAuctionWinner={isAuctionWinner}
            registrationFee={registrationFee}
            domain={name}
          />
        </div>
      )}
    </>
  )
}

export const PricerAll = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />
})

const Pricer = React.forwardRef((props, reference) => {
  return <PricerInner reference={reference} {...props} />
})

export default Pricer
