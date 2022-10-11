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
import HelpInfo from '../Icons/HelpInfo'
import Tooltip from '../Tooltip/index'

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
        <div className="rounded-2xl p-[18px] bg-fill-2 flex flex-col space-y-3 md:text-base text-sm font-semibold text-white">
          <div className="flex flex-col justify-center space-y-2 md:w-[600px] w-[274px]">
            <div className="flex md:flex-row flex-col md:items-center justify-between md:space-x-6 md:space-y-0 space-y-2">
              <div className="flex items-center justify-between flex-1 bg-fill-2 rounded-2xl px-4 py-1">
                <span>Registration Year</span>
                <Years years={years} setYears={setYears} />
              </div>
              <Price
                className="w-[116px] text-right ml-auto md:pr-4 pr-2"
                price={price}
                gasPrice={gasPrice.fast}
                loading={rentPriceLoading}
                ethUsdPrice={ethUsdPrice}
                underPremium={false}
                registrationFee={ethVal}
              />
            </div>
            <div className="flex md:flex-row flex-col md:items-center justify-between md:space-x-6 md:space-y-0 space-y-2">
              <div className="flex items-center justify-between flex-1 bg-fill-2 rounded-2xl px-4 py-1">
                <div
                  className={cn(
                    'flex items-center space-x-2',
                    getPointBalance <= 0 ? 'text-gray-800' : ''
                  )}
                >
                  <CheckBox
                    checked={usePoint}
                    onChange={setUsePoint}
                    disabled={getPointBalance <= 0}
                  />
                  <span>SID point</span>
                  <Tooltip
                    color="#2980E8"
                    side="bottom"
                    contentClass="rounded-xl p-2"
                    offset={10}
                    title={
                      <p className="text-sm text-white w-[280px] text-center">
                        SID Points are in-app credits which can be redeemed from
                        Gift Cards and be used to purchase domains.{' '}
                        <a
                          className="underline"
                          style={{ color: 'white' }}
                          href=""
                          target="_blank"
                        >
                          More details here
                        </a>
                      </p>
                    }
                  >
                    <HelpInfo className="text-green-600" />
                  </Tooltip>
                </div>
                <div className="flex justify-between space-x-3">
                  <span className="md:text-sm text-xs text-green-600">
                    Balance: {getPointBalance}
                  </span>
                  <button
                    className="px-2 rounded-[10px] bg-fill-3 text-xs text-white font-semibold"
                    onClick={() => dispatch(setShowRedeem(true))}
                  >
                    Redeem
                  </button>
                </div>
              </div>
              <div className="w-[116px] text-right ml-auto md:pr-4 pr-2">
                {usePoint &&
                  `- USD $${(
                    registrationFeeInUsd - registrationFeeWithPointInUsd
                  ).toFixed(2)}`}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between md:px-4 px-2">
              <span className="font-normal">Estimated Gas Fee</span>
              <span className="w-[116px] text-right ml-auto">{`USD $${registerGasFast
                .mul(ethUsdPrice)
                .toFixed(2)}`}</span>
            </div>
          </div>
          <div className="divider md:pr-4 pr-0 s-divider s-divider-h"></div>
          <div className="flex items-center justify-between md:px-4 px-2 text-right">
            <span>Total</span>
            <div className="flex items-center text-xl font-bold md:space-x-4 space-x-2">
              <div className="text-primary">
                {usePoint
                  ? registrationFeeWithPoint.toFixed(3)
                  : registrationFee.toFixed(3)}
                BNB
              </div>
              <div className="divider divider-horizontal s-divider s-divider-v"></div>
              <div>
                {`USD $${
                  usePoint
                    ? registrationFeeWithPointInUsd.toFixed(2)
                    : registrationFeeInUsd.toFixed(2)
                }`}
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
