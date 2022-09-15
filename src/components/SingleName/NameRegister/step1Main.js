import React, { useState } from 'react'
import EthVal from 'ethval'
import cn from 'classnames'
import Years from './Years'
import Price from './Price'
import { useQuery } from '@apollo/client'
import { HOME_DATA } from './CTA'
import { useAccount } from '../../QueryAccount'
import AnimationSpin from '../../AnimationSpin'
import { minYear, RegisterState } from './constant'
import CheckCircle from '../../Icons/CheckCircle'

const Step1Main = ({
  years,
  setYears,
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
  registerGasFast,
}) => {
  const account = useAccount()

  const {
    data: { isReadOnly },
  } = useQuery(HOME_DATA, {
    variables: {
      address: account,
    },
  })

  const handleRequest = () => {
    onRequest({ name: 'sss' })
  }
  const ethVal = new EthVal(`${price || 0}`).toEth()

  return (
    <>
      <div className="flex flex-col font-semibold text-white">
        <div className="font-bold text-center md:text-[24px] md:leading-[34px] text-xl leading-[28px]">
          Step 1: Request to Register
        </div>
        <div className="md:w-[640px] md:h-[130px] w-[312px] rounded-2xl p-[18px] bg-[#438C88]/25 mt-4 mb-[24px] flex flex-col md:flex-row">
          <div className="flex flex-col justify-between">
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
            <div className="text-[14px] leading-[22px] md:ml-[9px]">
              {`*Estimated with ${registerGasFast.toFixed(3)} BNB gas fee.`}
            </div>
          </div>
          <div className="md:w-[1px] md:h-full w-full h-[1px] bg-[#CCFCFF]/20 md:ml-8 my-3" />
          <div className="flex flex-col justify-between grow text-center md:mr-[9px]">
            <div className="text-[14px] leading-[22px] font-normal">
              Estimated Total
            </div>
            <div className="text-[32px] leading-[46px] font-bold">{`${registrationFee.toFixed(
              3
            )} BNB`}</div>
            <div className="text-[14px] leading-[22px] font-normal">{`USD ${registrationFeeInUsd.toFixed(
              3
            )}`}</div>
          </div>
        </div>
        <div className="text-center text-[14px] leading-[22px]">
          In this step, you may request for registration and perform the first
          of the two transactions. Upon requesting, the system will undergo a
          process to ensure other users are not trying to register for the same
          domain and protect you after request. This may take up to 30 seconds.
        </div>
        {isReadOnly && state === RegisterState.request && (
          <>
            <button
              className="w-[160px] h-[42px] rounded-2xl bg-green-200 text-dark-common text-[18px] leading-[26px] font-semibold mx-auto mt-[24px]"
              onClick={connectHandler}
            >
              Connect
            </button>
            <div className="mt-2 font-semibold text-center text-[14px] leading-[22px] text-red-100">
              *Please connect wallet to continue
            </div>
          </>
        )}
        {!isReadOnly && state === RegisterState.request && (
          <button
            className={cn(
              'w-[160px] h-[42px] rounded-2xl text-[18px] leading-[26px] font-semibold mx-auto mt-[24px]',
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
            <span className="text-green-100 text-[18px] leading-[26px] font-semibold">
              TX Pending
            </span>
            <AnimationSpin className="ml-[10px]" size={20} />
          </div>
        )}
        {state === RegisterState.requestSuccess && (
          <CheckCircle className="flex items-center mx-auto mt-[32px] text-green-200" />
        )}
      </div>
    </>
  )
}

export default Step1Main
