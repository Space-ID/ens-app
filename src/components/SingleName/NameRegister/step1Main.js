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
import HelpInfo from '../../Icons/HelpInfo'
import Tooltip from '../../Tooltip/index'

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
          <div className="mt-4 mb-[24px] flex flex-col space-y-3 md:text-base text-sm font-semibold text-white">
            <div className="flex flex-col justify-center space-y-2 w-full">
              <div className="flex md:flex-row flex-col md:items-center justify-between md:space-x-6 md:space-y-0 space-y-2">
                <div className="flex items-center justify-between flex-1 bg-fill-2 rounded-2xl px-4 py-1">
                  <span>Registration Year</span>
                  <Years
                    years={years}
                    setYears={setYears}
                    disable={state !== RegisterState.request}
                  />
                </div>
                <Price
                  className="w-[116px] text-right ml-auto md:pr-4 pr-2"
                  price={price}
                  loading={loading}
                  ethUsdPrice={ethUsdPrice}
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
                      disabled={
                        getPointBalance <= 0 || state !== RegisterState.request
                      }
                    />
                    <span>SID point</span>
                    <Tooltip
                      side="bottom"
                      title={
                        <p className="text-sm text-white w-[280px] text-center">
                          SID Points are in-app credits which can be redeemed
                          from Gift Cards and be used to purchase domains.{' '}
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
                      disabled={state !== RegisterState.request}
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
