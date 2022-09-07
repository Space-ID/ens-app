import React from 'react'
import EthVal from 'ethval'
const GWEI = 1000000000
const COMMIT_GAS_WEI = 42000
const REGISTER_GAS_WEI = 240000
const TOGAL_GAS_WEI = COMMIT_GAS_WEI + REGISTER_GAS_WEI

const EthRegistrationGasPrice = ({
  price,
  ethUsdPrice,
  gasPrice,
  name,
  years,
  isAuctionWinner,
  registrationFee,
  type = 'register',
  domain,
}) => {
  const ethVal = new EthVal(`${price || 0}`).toEth()
  const registerGasSlow = new EthVal(`${TOGAL_GAS_WEI * gasPrice.slow}`).toEth()
  const registerGasFast = new EthVal(`${TOGAL_GAS_WEI * gasPrice.fast}`).toEth()
  const totalSlow = ethVal.add(registerGasSlow)
  const totalFast = ethVal.add(registerGasFast)
  let totalInUsdSlow, totalInUsdFast
  // // No price oracle on Goerli
  if (ethUsdPrice) {
    totalInUsdSlow = totalSlow.mul(ethUsdPrice)
    totalInUsdFast = totalFast.mul(ethUsdPrice)
  }

  return (
    <div>
      <div className="text-white py-[25px] border-y border-white border-dashed mt-6 px-6">
        <div className="flex justify-between">
          <div className="font-semibold text-[14px]">Registration Fee</div>
          <div className="font-bold text-[16px]">
            {registrationFee.toFixed(3)} BNB
          </div>
        </div>

        {/*{discount.amount !== 0 && (*/}
        {/*  <div className="flex justify-between mt-[14px] text-[#1EEFA4]">*/}
        {/*    <div className="font-semibold text-[14px]">Discount</div>*/}
        {/*    <div className="font-bold text-[16px]">-{discount.percent}%</div>*/}
        {/*  </div>*/}
        {/*)}*/}
      </div>
      <div className="text-white py-[25px] border-b border-white border-dashed px-6">
        <div className="flex justify-between mt-[14px]">
          <div className="font-semibold text-[14px]">Gas Fee (Estimated)</div>
          <div className="font-bold text-[16px]">
            {registerGasFast.toFixed(3)} BNB
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-white">
        <div className="text-[14px] leading-[22px] font-urbanist">
          Total Cost
        </div>
        {/*{!(isAuctionWinner && years === 1) && domain?.length < 5 && (*/}
        {/*  <div className="font-bold text-[36px] text-white line-through heading-[34px]">*/}
        {/*    {registerGasFast.add(registrationFee).toFixed(3).toString()}*/}
        {/*    BNB*/}
        {/*  </div>*/}
        {/*)}*/}
        <div className="font-bold text-[36px] text-[#1EEFA4] italic">
          {totalFast.toFixed(3).toString()} BNB
        </div>
        <div className="text-[14px] font-urbanist text-white leading-[22px]">
          (${totalInUsdFast.toFixed(3)})
        </div>
      </div>
    </div>
  )
}

export default EthRegistrationGasPrice
