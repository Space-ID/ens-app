import React, { useState, useReducer, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import last from 'lodash/last'
import { connectProvider } from 'utils/providerUtils'
import EthVal from 'ethval'

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
import { successRegistering, startRegistering } from 'app/slices/registerSlice'
import { calculateDuration, yearInSeconds } from 'utils/dates'
import { GET_TRANSACTION_HISTORY } from 'graphql/queries'

import Loader from 'components/Loader'
import NotAvailable from './NotAvailable'
import ProgressRecorder from './ProgressRecorder'
import useNetworkInfo from '../../NetworkInformation/useNetworkInfo'
import PremiumPriceOracle from './PremiumPriceOracle'

import AnimationSpin from 'components/AnimationSpin'
import Step2Sidebar from './step2Sidebar'
import Step1Sidebar from './step1Sidebar'
import Step1Main from './step1Main'
import Step2Main from './step2Main'
import RegisterProgress from './registerProgress'
import { REGISTER, COMMIT } from '../../../graphql/mutations'
import { TOGAL_GAS_WEI } from '../../../constants/gas'
import { RegisterState } from './constant'

const NameRegister = ({ domain, waitTime, registrationOpen }) => {
  const [secret, setSecret] = useState(false)
  const { networkId } = useNetworkInfo()
  const dispatchSlice = useDispatch()

  const [registerState, setRegisterState] = useState(RegisterState.request)
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
  const [transactionHash, setTransactionHash] = useState('')
  const [signature, setSignature] = useState([])

  const [canRegister, setCanRegister] = useState(false)

  const handleYearChange = useCallback((v) => {
    const n = Number(v)
    if (Number.isNaN(n) || n < 1) {
      setYears(1)
    } else {
      setYears(n)
    }
  }, [])

  // get eth price
  const {
    data: { getEthPrice: ethUsdPrice } = {},
    loading: ethUsdPriceLoading,
  } = useQuery(GET_ETH_PRICE)

  // get price curve
  const { data: { getPriceCurve } = {} } = useQuery(GET_PRICE_CURVE)
  // get gas price
  const { loading: gasPriceLoading, price: gasPrice } = useGasPrice()
  // latest block
  const { block } = useBlock()
  // wait block timestamp
  const { data: { waitBlockTimestamp } = {} } = useQuery(WAIT_BLOCK_TIMESTAMP, {
    variables: {
      waitUntil,
    },
    fetchPolicy: 'no-cache',
  })
  // get transaction history
  const { data: { transactionHistory } = {} } = useQuery(
    GET_TRANSACTION_HISTORY
  )
  // last transaction
  const lastTransaction = last(transactionHistory)

  // commit domain
  const [mutationCommit] = useMutation(COMMIT, {
    onCompleted: (data) => {
      if (data?.commit) {
        console.log('commit success;', data)
        setCommitmentTimerRunning(true)
      } else {
        setRegisterState(RegisterState.request)
      }
    },
    onError: (error) => {
      console.log('commit error:', error)
      setRegisterState(RegisterState.request)
    },
  })
  // register domain
  const [mutationRegister] = useMutation(REGISTER, {
    onCompleted: (data) => {
      console.log('register result:', data)
      if (data?.register) {
        setTransactionHash(data.register)
      } else {
        console.log('error')
        setRegisterState(RegisterState.registerError)
      }
    },
    onError: (error) => {
      console.log('register: error:', error)
    },
  })

  // check transaction
  useEffect(() => {
    if (
      lastTransaction &&
      lastTransaction.txHash === transactionHash &&
      lastTransaction.txState === 'Confirmed'
    ) {
      setRegisterState(RegisterState.registerSuccess)
    }
    if (
      lastTransaction &&
      lastTransaction.txHash === transactionHash &&
      lastTransaction.txState === 'Error'
    ) {
      setRegisterState(RegisterState.registerError)
    }
  }, [transactionHistory])

  const account = useAccount()

  // get balance
  const { data: { getBalance } = {} } = useQuery(GET_BALANCE, {
    variables: { address: account },
    fetchPolicy: 'no-cache',
  })
  // get max commitment age
  const { data: { getMaximumCommitmentAge } = {} } = useQuery(
    GET_MAXIMUM_COMMITMENT_AGE,
    {
      fetchPolicy: 'no-cache',
    }
  )

  if (block) {
    // latest bock time
    now = moment(block.timestamp * 1000)
  }

  // commit expiration date
  if (!commitmentExpirationDate && getMaximumCommitmentAge && blockCreatedAt) {
    setCommitmentExpirationDate(
      moment(blockCreatedAt).add(getMaximumCommitmentAge, 'second')
    )
  }
  // check commit
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
    states: RegisterState,
    dispatch: setRegisterState,
    step: registerState,
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
          // confirm
          setRegisterState(RegisterState.confirm)
        }
        setTimerRunning(false)
      }
    },
    timerRunning ? 1000 : null
  )
  useInterval(
    () => {
      if (checkCommitment > 0) {
        // incrementStep() todo: confirm?
        setRegisterState(RegisterState.requestSuccess)
        setTimerRunning(true) // start confirm timer
        setCommitmentTimerRunning(false)
      } else {
        setCommitmentTimerRunning(new Date()) // force refresh?
      }
    },
    commitmentTimerRunning ? 1000 : null
  )

  const duration = calculateDuration(years)

  // rent price
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
  // rent price duration 0
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

  const ethVal = new EthVal(`${getRentPrice || 0}`).toEth()
  // todo: canregister
  const registerGasFast = new EthVal(`${TOGAL_GAS_WEI * gasPrice.fast}`).toEth()
  const registrationFee = ethVal.add(registerGasFast)
  const registrationFeeInUsd = registrationFee.mul(ethUsdPrice ?? 0)

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

  if (ethUsdPriceLoading || gasPriceLoading) {
    return <Loader withWrap={true} large />
  }

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

  const handleRequest = () => {
    const variables = {
      label: domain.label,
      secret,
    }
    setRegisterState(RegisterState.requesting)
    mutationCommit({ variables })
  }
  const handleRetry = () => {
    setRegisterState(RegisterState.confirm)
  }
  const handleRegister = () => {
    if (!hasSufficientBalance) {
      return
    }
    setRegisterState(RegisterState.registering)
    // dispatch(startRegistering())
    const variables = {
      label: domain.label,
      duration,
      secret,
    }
    mutationRegister({ variables })
  }

  return (
    <div className="mx-auto flex flex-col items-center">
      <div className="flex justify-center mb-8">
        <p className="md:max-w-[928px] max-w-[360px] md:min-w-[320px] w-auto block text-ellipsis overflow-hidden break-words font-bold text-[20px] md:text-[28px] text-[#1EEFA4] py-2 border-[4px] border-[#1EEFA4] rounded-[22px] text-center truncate px-6">
          {domain.name}
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:w-[928px] w-[360px]">
        {(registerState === RegisterState.confirm ||
          registerState.startsWith(RegisterState.register)) && (
          <Step1Sidebar
            price={registrationFee}
            totalUsd={registrationFeeInUsd}
          />
        )}
        <div className="md:w-[742px] w-full h-full bg-[#438C88]/25 backdrop-blur-[5px] rounded-[16px] md:px-[50px] px-[24px] py-[24px]">
          {registerState.startsWith(RegisterState.request) && (
            <Step1Main
              state={registerState}
              duration={duration}
              years={years}
              setYears={handleYearChange}
              ethUsdPriceLoading={ethUsdPriceLoading}
              ethUsdPremiumPrice={currentPremium}
              ethUsdPrice={ethUsdPrice}
              loading={rentPriceLoading}
              price={getRentPrice}
              premiumOnlyPrice={getPremiumPrice}
              underPremium={underPremium}
              connectHandler={connectHandler}
              signature={signature}
              canRegister={canRegister}
              registerGasFast={registerGasFast}
              registrationFee={registrationFee}
              registrationFeeInUsd={registrationFeeInUsd}
              onRequest={handleRequest}
            />
          )}
          {(registerState === RegisterState.confirm ||
            registerState.startsWith(RegisterState.register)) && (
            <Step2Main
              state={registerState}
              onRegister={handleRegister}
              onRetry={handleRetry}
              hasSufficientBalance={hasSufficientBalance}
            />
          )}
        </div>
        {registerState.startsWith(RegisterState.request) && <Step2Sidebar />}
      </div>
      <RegisterProgress state={registerState} />
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
