//Import packages
import React, { useState } from 'react'
import cn from 'classnames'
import EthVal from 'ethval'
import { useDispatch } from 'react-redux'
import { useQuery } from '@apollo/client'
import { utils as ethersUtils } from 'ethers/lib/ethers'

//Import components
import Modal from './index'
import Years from '../SingleName/NameRegister/Years'
import Price from '../SingleName/NameRegister/Price'
import CheckBox from 'components/CheckBox'
import { setShowRedeem } from 'app/slices/giftCardSlice'
import { QUERY_POINT_BALANCE } from '../../graphql/queries'
import { useAccount } from '../QueryAccount'
import { TOGAL_GAS_WEI } from 'constants/gas'

export default function ExtendPeriodModal(props) {
  const {
    duration,
    years,
    setYears,
    ethUsdPriceLoading,
    currentPremium,
    ethUsdPrice,
    price,
    priceWithPoint,
    rentPriceLoading,
    gasPrice,
    extendHandler,
    ...otherProps
  } = props
  const account = useAccount()
  const dispatch = useDispatch()
  const [usePoint, setUsePoint] = useState(undefined)

  const { data: { getPointBalance = 0 } = {} } = useQuery(QUERY_POINT_BALANCE, {
    variables: { account },
    skip: !ethersUtils.isAddress(account),
    fetchPolicy: 'network-only',
  })

  const ethVal = new EthVal(`${price || 0}`).toEth()
  const ethValWithPoint = new EthVal(`${priceWithPoint || price || 0}`).toEth()
  const registerGasFast = new EthVal(
    `${TOGAL_GAS_WEI * (gasPrice?.fast ?? 0)}`
  ).toEth()
  const registrationFee = ethVal.add(registerGasFast)
  const registrationFeeInUsd = registrationFee.mul(ethUsdPrice ?? 0)
  const registrationFeeWithPoint = ethValWithPoint.add(registerGasFast)
  const registrationFeeWithPointInUsd = registrationFeeWithPoint.mul(
    ethUsdPrice ?? 0
  )

  return (
    <Modal title="Extend Registration" {...otherProps}>
      <div className="flex flex-col space-y-6 items-center">
        <div className="rounded-2xl p-[18px] bg-fill-2 flex flex-col md:flex-row md:space-x-8">
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex">
              <Years years={years} setYears={setYears} />
              <span className="text-white font-bold font-urbanist text-[18px] flex pt-2 md:mx-5 mx-3">
                =
              </span>
              <Price
                price={price}
                gasPrice={gasPrice.fast}
                loading={rentPriceLoading}
                ethUsdPrice={ethUsdPrice}
                underPremium={false}
                registrationFee={ethVal}
              />
            </div>
            <div className="text-sm md:ml-[9px]">
              {`*Estimated with ${registerGasFast.toFixed(3)} BNB gas fee.`}
            </div>
          </div>
          <div className="s-divider s-divider-v" />
          <div className="flex flex-col justify-between grow text-center md:mr-[9px] space-y-3">
            <div className="flex flex-col">
              <div className="text-sm font-normal">Estimated Total</div>
              <div
                className={cn(
                  'font-bold',
                  usePoint ? 'text-xl leading-[34px] line-through' : 'text-4xl'
                )}
              >
                {`${registrationFee.toFixed(3)} BNB`}
              </div>
              {usePoint && (
                <div className="text-[36px] leading-[36px] text-primary font-extrabold">{`${registrationFeeWithPoint.toFixed(
                  3
                )} BNB`}</div>
              )}
              <div className="text-sm font-normal">
                {`USD ${
                  usePoint
                    ? registrationFeeWithPointInUsd.toFixed(3)
                    : registrationFeeInUsd.toFixed(3)
                }`}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-1 text-sm text-gray-600 font-semibold">
              <div className="flex items-center">
                <CheckBox onChange={setUsePoint} />
                <span className="ml-3">Use SID point</span>
              </div>
              <div className="flex justify-between">
                <span className="mr-3">Point balance: {getPointBalance}</span>
                <button
                  className="px-2 rounded-[10px] bg-fill-3 text-xs text-white font-semibold"
                  onClick={() => dispatch(setShowRedeem(true))}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          className={cn(
            'btn btn-primary rounded-2xl w-[160px] h-[42px] text-lg text-black font-semibold'
          )}
          disabled={parseFloat(years) < 0.000001}
          onClick={() => {
            extendHandler(usePoint)
          }}
        >
          Extend
        </button>
      </div>
    </Modal>
  )
}
