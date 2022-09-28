import React, { useState } from 'react'
import EthVal from 'ethval'
import { utils as ethersUtils } from 'ethers'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import { setShowRedeem } from 'app/slices/giftCardSlice'
import CheckBox from 'components/CheckBox'
import Years from './Years'
import Price from './Price'
import { useQuery } from '@apollo/client'
import { HOME_DATA } from './CTA'
import { useAccount } from '../../QueryAccount'
import AnimationSpin from '../../AnimationSpin'
import { minYear, RegisterState } from './constant'
import CheckCircle from '../../Icons/CheckCircle'
import { QUERY_POINT_BALANCE } from '../../../graphql/queries'

const Step1Main = ({
  years,
  setYears,
  usePoint,
  setUsePoint,
  ethUsdPriceLoading,
  ethUsdPrice,
  ethUsdPremiumPrice,
  loading,
  price,
  premiumOnlyPrice,
  gasPrice,
  underPremium,
  connectHandler,
  onRequest,
  state,
  registrationFee,
  registrationFeeInUsd,
  registrationFeeWithPoint,
  registrationFeeWithPointInUsd,
  registerGasFast,
}) => {
  const account = useAccount()
  const dispatch = useDispatch()
  const {
    data: { isReadOnly },
  } = useQuery(HOME_DATA, {
    variables: {
      address: account,
    },
  })

  const handleRequest = () => {
    onRequest()
  }
  const ethVal = new EthVal(`${price || 0}`).toEth()
  const { data: { getPointBalance = 0 } = {} } = useQuery(QUERY_POINT_BALANCE, {
    variables: { account },
    skip: !ethersUtils.isAddress(account),
    fetchPolicy: 'network-only',
  })

  return (
    <>
      <div className="flex flex-col font-semibold text-white">
        <div>
          <div className="font-bold text-center md:text-2xl text-xl">
            Step 1: Request to Register
          </div>
          <div className="rounded-2xl p-[18px] bg-fill-2 mt-4 mb-[24px] flex flex-col md:flex-row md:space-x-8">
            <div className="flex flex-col justify-center space-y-2">
              <div className="flex">
                <Years
                  years={years}
                  setYears={setYears}
                  disable={state !== RegisterState.request}
                />
                <span className="text-white font-bold font-urbanist text-[18px] flex pt-2 md:mx-5 mx-3">
                  =
                </span>
                <Price
                  price={price}
                  premiumOnlyPrice={premiumOnlyPrice}
                  gasPrice={gasPrice}
                  loading={loading}
                  ethUsdPriceLoading={ethUsdPriceLoading}
                  ethUsdPrice={ethUsdPrice}
                  ethUsdPremiumPrice={ethUsdPremiumPrice}
                  underPremium={underPremium}
                  years={years}
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
                    usePoint
                      ? 'text-xl leading-[34px] line-through'
                      : 'text-4xl'
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
                  <CheckBox
                    checked={usePoint}
                    onChange={setUsePoint}
                    disabled={state !== RegisterState.request}
                  />
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
        </div>
        <div className="flex flex-col space-y-6 md:max-w-[640px] max-w-[312px]">
          <div className="text-center text-sm">
            In this step, you may request for registration and perform the first
            of the two transactions. Upon requesting, the system will undergo a
            process to ensure other users are not trying to register for the
            same domain and protect you after request. This may take up to 30
            seconds.
          </div>
          {isReadOnly && state === RegisterState.request && (
            <>
              <button
                className="btn-primary w-[160px] h-[42px] rounded-2xl text-lg font-semibold mx-auto"
                onClick={connectHandler}
              >
                Connect
              </button>
              <div className="font-semibold text-center text-sm text-red-100">
                *Please connect wallet to continue
              </div>
            </>
          )}
          {!isReadOnly && state === RegisterState.request && (
            <button
              className={cn(
                'w-[160px] h-[42px] rounded-2xl text-lg font-semibold mx-auto mt-[24px]',
                isReadOnly || parseFloat(years) < minYear
                  ? 'bg-gray-800 text-white cursor-not-allowed'
                  : 'bg-green-200 text-dark-common'
              )}
              disabled={isReadOnly || parseFloat(years) < minYear}
              onClick={handleRequest}
            >
              Request
            </button>
          )}
          {state === RegisterState.requesting && (
            <div className="flex items-center mx-auto mt-[35px] ">
              <span className="text-green-100 text-lg font-semibold">
                TX Pending
              </span>
              <AnimationSpin className="ml-[10px]" size={20} />
            </div>
          )}
          {state === RegisterState.requestSuccess && (
            <CheckCircle className="flex items-center mx-auto mt-[32px] text-green-200" />
          )}
        </div>
      </div>
    </>
  )
}

export default Step1Main
