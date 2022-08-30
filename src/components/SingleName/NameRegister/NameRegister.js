import React, { useState, useReducer, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@apollo/client'
import cn from 'classnames'
import moment from 'moment'
import { useHistory } from 'react-router'
import axios from 'axios'
import last from 'lodash/last'
import { connectProvider } from 'utils/providerUtils'
import EthVal from 'ethval'
import { Button } from 'react-daisyui'

import {
  CHECK_COMMITMENT,
  GET_MINIMUM_COMMITMENT_AGE,
  GET_MAXIMUM_COMMITMENT_AGE,
  GET_RENT_PRICE,
  WAIT_BLOCK_TIMESTAMP,
  GET_BALANCE,
  GET_ETH_PRICE,
  GET_PRICE_CURVE,
} from 'graphql/queries'
import { useInterval, useGasPrice, useBlock } from 'components/hooks'
import { useAccount } from '../../QueryAccount'
import { registerMachine, registerReducer } from './registerReducer'
import { successRegistering } from 'app/slices/registerSlice'
import { calculateDuration, yearInSeconds } from 'utils/dates'
import { GET_TRANSACTION_HISTORY } from 'graphql/queries'

import Loader from 'components/Loader'
import CTA from './CTA'
import NotAvailable from './NotAvailable'
import Pricer from '../Pricer'
import ProgressRecorder from './ProgressRecorder'
import useNetworkInfo from '../../NetworkInformation/useNetworkInfo'
import { sendNotification } from './notification'
import PremiumPriceOracle from './PremiumPriceOracle'

import EditIcon from 'components/Icons/EditIcon'
import SuccessfulTickIcon from 'components/Icons/SuccessfulTickIcon'
import FailedIcon from 'components/Icons/FailedIcon'
import AnimationSpin from 'components/AnimationSpin'

const NameRegister = ({ domain, waitTime, registrationOpen }) => {
  const { t } = useTranslation()
  const [secret, setSecret] = useState(false)
  const { networkId } = useNetworkInfo()
  const dispatchSlice = useDispatch()
  const [step, dispatch] = useReducer(
    registerReducer,
    registerMachine.initialState
  )
  const [customStep, setCustomStep] = useState('START')
  let now, currentPremium, underPremium
  const [years, setYears] = useState(false)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [commitmentTimerRunning, setCommitmentTimerRunning] = useState(false)
  const [blockCreatedAt, setBlockCreatedAt] = useState(null)
  const [waitUntil, setWaitUntil] = useState(null)
  const [targetDate, setTargetDate] = useState(false)
  const [commitmentExpirationDate, setCommitmentExpirationDate] =
    useState(false)
  const [freeDuration, setFreeDuration] = useState(0)
  const [index, setIndex] = useState(0)
  const [registering, setRegistering] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [signature, setSignature] = useState([])
  const [isAuctionWinner, setIsAuctionWinner] = useState(false)
  const [discountAmount, setDiscountAmount] = useState({
    percent: 0,
    amount: 0,
  })
  const [winnerLoading, setWinnerLoading] = useState(false)

  const accountSlice = useSelector((state) => state.account)

  const handleYearChange = useCallback((v) => {
    const n = Number(v)
    if (Number.isNaN(n) || n < 1) {
      setYears(1)
    } else {
      setYears(n)
    }
  }, [])

  const {
    data: { getEthPrice: ethUsdPrice } = {},
    loading: ethUsdPriceLoading,
  } = useQuery(GET_ETH_PRICE)
  const { data: { getPriceCurve } = {} } = useQuery(GET_PRICE_CURVE)
  const { loading: gasPriceLoading, price: gasPrice } = useGasPrice()
  const { block } = useBlock()
  const { data: { waitBlockTimestamp } = {} } = useQuery(WAIT_BLOCK_TIMESTAMP, {
    variables: {
      waitUntil,
    },
    fetchPolicy: 'no-cache',
  })

  const { data: { transactionHistory } = {} } = useQuery(
    GET_TRANSACTION_HISTORY
  )

  const lastTransaction = last(transactionHistory)

  useEffect(() => {
    if (
      lastTransaction &&
      lastTransaction.txHash === transactionHash &&
      lastTransaction.txState === 'Confirmed'
    ) {
      successRegister()
      setRegistering(false)
    }
    if (
      lastTransaction &&
      lastTransaction.txHash === transactionHash &&
      lastTransaction.txState === 'Error'
    ) {
      setCustomStep('ERROR')
      setRegistering(false)
    }
  }, [transactionHistory])

  const history = useHistory()
  const account = useAccount()
  useEffect(() => {
    const fetchSignature = async () => {
      // setWinnerLoading(true)
      try {
        const result = await axios({
          method: 'get',
          url: `${process.env.REACT_APP_BACKEND_URL}/merkleleaf?domain=${domain.label}`,
        })
        setFreeDuration(result?.data?.data?.isaution ? 31556952 : 0)
        if (result?.data?.data?.index) {
          setIndex(result?.data?.data?.index)
          if (result?.data?.data?.isaution) {
            setIsAuctionWinner(true)
          } else {
            setIsAuctionWinner(false)
          }
          const params = {
            inputs: [
              {
                name: domain.label,
                index: result?.data?.data?.index,
                owner: account?.toLowerCase(), //
                duration,
                resolver:
                  process.env.REACT_APP_RESOLVER_ADDRESS.toLocaleLowerCase(),
                addr: account?.toLowerCase(), //Eth wallet of user connected with metamask
                freeDuration: result?.data?.data?.isaution ? 31556952 : 0,
              },
            ],
          }
          const result1 = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_MERKLE_BASE_URL}/getproof`,
            headers: {},
            data: params,
          })
          const proofs = result1?.data
          if (proofs && proofs.length > 0) {
            setSignature(proofs)
          } else {
            setSignature([])
          }
          setWinnerLoading(false)
        }
        //Cannot get index from merkletree
      } catch (err) {
        setWinnerLoading(false)
      }
    }
    fetchSignature()
  }, [years])

  const { data: { getBalance } = {} } = useQuery(GET_BALANCE, {
    variables: { address: account },
    fetchPolicy: 'no-cache',
  })

  const { data: { getMaximumCommitmentAge } = {} } = useQuery(
    GET_MAXIMUM_COMMITMENT_AGE,
    {
      fetchPolicy: 'no-cache',
    }
  )

  if (block) {
    now = moment(block.timestamp * 1000)
  }

  if (!commitmentExpirationDate && getMaximumCommitmentAge && blockCreatedAt) {
    setCommitmentExpirationDate(
      moment(blockCreatedAt).add(getMaximumCommitmentAge, 'second')
    )
  }

  const { data: { checkCommitment = false } = {} } = useQuery(
    CHECK_COMMITMENT,
    {
      variables: {
        label: domain.label,
        secret,
        commitmentTimerRunning,
      },
      fetchPolicy: 'no-cache',
    }
  )

  ProgressRecorder({
    checkCommitment,
    domain,
    networkId,
    states: registerMachine.states,
    dispatch,
    step,
    secret,
    setSecret,
    years,
    setYears,
    timerRunning,
    setTimerRunning,
    waitUntil,
    setWaitUntil,
    secondsPassed,
    setSecondsPassed,
    commitmentExpirationDate,
    setCommitmentExpirationDate,
    now,
  })

  useInterval(
    () => {
      if (blockCreatedAt && !waitUntil) {
        setWaitUntil(blockCreatedAt + waitTime * 1000)
      }
      if (secondsPassed < waitTime) {
        setSecondsPassed((s) => s + 1)
      } else {
        if (waitBlockTimestamp && timerRunning) {
          sendNotification(
            `${domain.name} ${t('register.notifications.ready')}`
          )
        }
        setTimerRunning(false)
      }
    },
    timerRunning ? 1000 : null
  )

  const parsedYears = parseFloat(isAuctionWinner ? years - 1 : years)
  const duration = calculateDuration(isAuctionWinner ? years - 1 : years)

  const { data: { getRentPrice } = {}, loading: rentPriceLoading } = useQuery(
    GET_RENT_PRICE,
    {
      variables: {
        duration,
        label: domain.label,
        commitmentTimerRunning,
      },
    }
  )

  const {
    data: { getRentPrice: getPremiumPrice } = {},
    loading: getPremiumPriceLoading,
  } = useQuery(GET_RENT_PRICE, {
    variables: {
      duration: 0,
      label: domain.label,
      commitmentTimerRunning,
    },
  })

  useEffect(() => {
    //Set the 40% discount if the domain length is consist of 3 characters
    if (getRentPrice) {
      const ethVal = new EthVal(`${getRentPrice || 0}`).toEth()
      if (domain.label.length === 3) {
        const tPrice = {
          amount: ethVal * 0.4,
          percent: 40,
        }
        setDiscountAmount({ ...tPrice })
      } else if (domain.label.length === 4) {
        setDiscountAmount({
          amount: ethVal * 0.2,
          percent: 20,
        })
      } else {
        setDiscountAmount({
          amount: 0,
          percent: 0,
        })
      }
    }
  }, [getRentPrice])

  let hasSufficientBalance
  if (!blockCreatedAt && checkCommitment > 0) {
    setBlockCreatedAt(checkCommitment * 1000)
  }
  if (getBalance && getRentPrice) {
    hasSufficientBalance = getBalance.gt(getRentPrice)
  }
  if (blockCreatedAt && !waitUntil) {
    setWaitUntil(blockCreatedAt + waitTime * 1000)
  }

  const oneMonthInSeconds = 2419200
  const twentyEightDaysInYears = oneMonthInSeconds / yearInSeconds

  const expiryDate = moment(domain.expiryTime)
  const oracle = new PremiumPriceOracle(expiryDate, getPriceCurve)
  const { releasedDate, zeroPremiumDate } = oracle

  if (!registrationOpen) return <NotAvailable domain={domain} />

  if (ethUsdPriceLoading || gasPriceLoading)
    return <Loader withWrap={true} large />

  if (!targetDate) {
    setTargetDate(zeroPremiumDate)
  }

  if (block) {
    currentPremium = oracle.getTargetAmountByDaysPast(oracle.getDaysPast(now))
    underPremium = now.isBetween(releasedDate, zeroPremiumDate)
  }

  const successRegister = () => {
    dispatchSlice(successRegistering())
    setCustomStep('SUCCESS')
  }

  const connectHandler = () => {
    connectProvider()
  }

  const backToHome = () => {
    window.location.href = process.env.REACT_APP_BACK_TO_HOME
  }

  // if (winnerLoading) return <AnimationSpin size={40} />

  return (
    <div className="min-w-[448px] mx-auto">
      <div className="flex justify-center">
        <p className="min-w-full max-w-full block text-ellipsis overflow-hidden break-words font-bold text-[20px] md:text-[28px] text-[#1EEFA4] py-2 border-[4px] border-[#1EEFA4] rounded-[22px] text-center max-w-max px-6">
          {domain.name}
        </p>
      </div>
      {customStep === 'START' && (
        <div>
          <div className="bg-[#488F8B]/25 backdrop-blur-[5px] rounded-[16px] p-6 mt-8">
            <Pricer
              name={domain.label}
              duration={duration}
              years={years}
              setYears={handleYearChange}
              ethUsdPriceLoading={ethUsdPriceLoading}
              ethUsdPremiumPrice={currentPremium}
              ethUsdPrice={ethUsdPrice}
              gasPrice={gasPrice}
              loading={rentPriceLoading}
              price={getRentPrice}
              premiumOnlyPrice={getPremiumPrice}
              underPremium={underPremium}
              displayGas={true}
              discount={discountAmount}
              signature={signature}
              isAuctionWinner={isAuctionWinner}
            />
          </div>
          <CTA
            setTransactionHash={setTransactionHash}
            setCustomStep={setCustomStep}
            signature={signature}
            hasSufficientBalance={hasSufficientBalance}
            step={step}
            label={domain.label}
            duration={duration}
            years={years}
            successRegister={successRegister}
            connectHandler={connectHandler}
            setRegistering={setRegistering}
            registering={registering}
            paymentSuccess={() => setCustomStep('PAYMENT')}
            freeDuration={freeDuration}
            index={index}
            canRegister={accountSlice.redeemableQuota}
          />
        </div>
      )}
      {(customStep === 'SUCCESS' ||
        customStep === 'PENDING' ||
        customStep === 'PAYMENT' ||
        customStep === 'ERROR') && (
        <div className="max-w-[436px]">
          <div className="bg-[#488F8B]/25 backdrop-blur-[5px] rounded-[16px] p-6 mt-8">
            <div className="flex justify-center">
              <EditIcon />
            </div>
            {customStep === 'PENDING' ? (
              <div className="font-semibold text-[24px] text-white text-center mt-2">
                Registration in progress...
              </div>
            ) : (
              <div className="font-semibold text-[24px] text-white text-center mt-2">
                {customStep === 'ERROR' ? (
                  <span>Registration incompleted :(</span>
                ) : (
                  <span>Registration completed!</span>
                )}
              </div>
            )}
            {customStep === 'PENDING' ||
              (customStep === 'PAYMENT' && (
                <div className="text-[14px] text-gray-700 leading-[22px] text-center">
                  Please be patient as the process might take a while.
                </div>
              ))}

            <div className="mt-8">
              <div className="text-center">
                <div
                  className={cn(
                    customStep === 'ERROR'
                      ? 'text-[#ED7E17]'
                      : 'text-[#30DB9E]',
                    'font-semibold text-[16px]'
                  )}
                >
                  Confirm Payment
                </div>
                {customStep === 'PENDING' ? (
                  <AnimationSpin className="flex justify-center mt-1" />
                ) : (
                  <div>
                    {customStep === 'ERROR' ? (
                      <FailedIcon className="text-[#ED7E17] flex justify-center my-2" />
                    ) : (
                      <SuccessfulTickIcon className="text-[#30DB9E] flex justify-center my-2" />
                    )}
                  </div>
                )}
              </div>
              <div className="mt-1 text-center">
                <div
                  className={cn(
                    'font-semibold text-[16px]',
                    customStep === 'PENDING'
                      ? 'text-[#7E9195]'
                      : customStep === 'ERROR'
                      ? 'text-[#ED7E17]'
                      : 'text-[#30DB9E]'
                  )}
                >
                  Successful registration. Name published
                </div>
                {customStep === 'PENDING' ? (
                  <div className="w-2 h-2 bg-[#7E9195] rounded-full flex justify-center mt-[14px] m-auto" />
                ) : customStep === 'PAYMENT' ? (
                  <AnimationSpin className="flex justify-center mt-1" />
                ) : (
                  <div>
                    {customStep === 'ERROR' ? (
                      <FailedIcon className="text-[#ED7E17] flex justify-center my-2" />
                    ) : (
                      <SuccessfulTickIcon className="text-[#30DB9E] flex justify-center my-2" />
                    )}
                  </div>
                )}
              </div>
            </div>
            {customStep === 'ERROR' && (
              <div className="text-[#BDCED1] text-[16px] text-center mt-8">
                Something went wrong in the registration process. You may choose
                to retry and be redirected back to the payment review page.
              </div>
            )}

            {customStep === 'ERROR' ? (
              <div className="flex justify-center mt-10">
                <Button
                  color="primary"
                  className={cn(
                    'py-2 rounded-2xl text-[#071A2F] font-semibold border-0 px-[30px] normal-case'
                  )}
                  onClick={() => setCustomStep('START')}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="flex justify-between px-8 mt-10 space-x-4">
                <Button
                  className="text-lg font-semibold leading-6 normal-case rounded-2xl btn-outline font-urbanist"
                  color="primary"
                  onClick={() => backToHome()}
                >
                  Back To Home
                </Button>
                <Button
                  color="primary"
                  className={cn(
                    'py-2 rounded-2xl font-semibold border-0 px-[19px] normal-case text-lg leading-6 font-urbanist',
                    customStep === 'SUCCESS'
                      ? 'text-[#071A2F] bg-[#30DB9E]'
                      : 'bg-[#7E9195] text-white'
                  )}
                  disabled={customStep !== 'SUCCESS'}
                  onClick={() => history.push('/profile')}
                >
                  Manage Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const NameRegisterDataWrapper = (props) => {
  const { data, loading, error } = useQuery(GET_MINIMUM_COMMITMENT_AGE)
  if (loading) return <AnimationSpin size={40} />
  if (error) {
    console.log(error)
  }
  return <NameRegister waitTime={data?.getMinimumCommitmentAge} {...props} />
}

export default NameRegisterDataWrapper
