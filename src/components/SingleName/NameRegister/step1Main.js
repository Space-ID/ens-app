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
  disable,
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
      <div className="text-white font-semibold flex flex-col">
        <div className="font-bold text-center md:text-[24px] md:leading-[34px] text-[20px] leading-[28px]">
          Step 1: Request to Register
        </div>
        <div className="md:w-[640px] md:h-[130px] w-[312px] rounded-[16px] p-[18px] bg-[#438C88]/25 mt-[16px] mb-[24px] flex flex-col md:flex-row">
          <div className="flex flex-col justify-between">
            <div className="flex">
              <Years
                years={years}
                setYears={setYears}
                disable={state !== RegisterState.request}
              />
              <span className="text-white font-bold font-urbanist text-[18px] flex pt-2 md:mx-[20px] mx-[12px]">
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
          <div className="md:w-[1px] md:h-full w-full h-[1px] bg-[#CCFCFF]/20 md:ml-[32px] my-[12px]" />
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
              className="w-[160px] h-[42px] rounded-[16px] bg-[#30DB9E] text-[#071A2F] text-[18px] leading-[26px] font-semibold mx-auto mt-[24px]"
              onClick={connectHandler}
            >
              Connect
            </button>
            <div className="mt-[8px] font-semibold text-center text-[14px] leading-[22px] text-[#ED7E17]">
              *Please connect wallet to continue
            </div>
          </>
        )}
        {!isReadOnly && state === RegisterState.request && (
          <button
            className={cn(
              'w-[160px] h-[42px] rounded-[16px] text-[18px] leading-[26px] font-semibold mx-auto mt-[24px]',
              disable
                ? 'bg-gray-800 text-white cursor-not-allowed'
                : 'bg-[#30DB9E] text-[#071A2F]'
            )}
            disabled={disable || isReadOnly || parseFloat(years) < minYear}
            onClick={handleRequest}
          >
            Request
          </button>
        )}
        {state === RegisterState.requesting && (
          <div className="flex items-center mx-auto mt-[35px] ">
            <span className="text-[#1EEFA4] text-[18px] leading-[26px] font-semibold">
              TX Pending
            </span>
            <AnimationSpin className="ml-[10px]" size={20} />
          </div>
        )}
        {state === RegisterState.requestSuccess && (
          <CheckCircle className="flex items-center mx-auto mt-[32px] " />
        )}
      </div>
    </>
  )
}

export default Step1Main
