import React, { useState } from 'react'
import EthVal from 'ethval'
import Years from './Years'
import Price from './Price'
import { TOGAL_GAS_WEI } from './../../../constants/gas'
import { useQuery } from '@apollo/client'
import { HOME_DATA } from './CTA'
import { useAccount } from '../../QueryAccount'
import {
  startRequesting,
  successRequesting,
} from '../../../app/slices/registerSlice'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../Loader'
import AnimationSpin from '../../AnimationSpin'
import { RegisterState } from './constant'

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
          process to ensure no other user is registering this domain
          simultaneously. This may take up to 30 seconds.
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
            className="w-[160px] h-[42px] rounded-[16px] bg-[#30DB9E] text-[#071A2F] text-[18px] leading-[26px] font-semibold mx-auto mt-[24px]"
            disabled={isReadOnly || parseFloat(years) < 0.1}
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
          <div className="flex items-center mx-auto mt-[32px] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 10C0 7.34784 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34784 0 10 0C12.6522 0 15.1957 1.05357 17.0711 2.92893C18.9464 4.8043 20 7.34784 20 10C20 12.6522 18.9464 15.1957 17.0711 17.0711C15.1957 18.9464 12.6522 20 10 20C7.34784 20 4.8043 18.9464 2.92893 17.0711C1.05357 15.1957 0 12.6522 0 10H0ZM9.42933 14.28L15.1867 7.08267L14.1467 6.25067L9.23733 12.3853L5.76 9.488L4.90667 10.512L9.42933 14.2813V14.28Z"
                fill="#30DB9E"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  )
}

export default Step1Main
