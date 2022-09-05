import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import Search from 'components/SearchName/Search'
import { SpaceIDTextIcon } from 'components/Icons'
import { useAccount } from 'components/QueryAccount'
import { isEmptyAddress } from 'utils/records'
import { ethers } from '@siddomains/ui'
import { GET_HUNGER_PHASE_INFO, GET_IS_CLAIMABLE } from 'graphql/queries'
import AnimationSpin from 'components/AnimationSpin'

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export default () => {
  // const [loading, setLoading] = useState(false);
  const [dailyUsed, setDailyUsed] = useState(null)
  const [dailyLimit, setDailyLimit] = useState(null)
  const [isInHungerPhase, setIsInHungerPhase] = useState(0)
  const [claimable, setClaimable] = useState(false)
  const searchingDomainName = useSelector(
    (state) => state.domain.searchingDomainName
  )

  const account = useAccount()

  const { data } = useQuery(HOME_DATA, {
    variables: {
      address: account,
    },
  })

  const { isReadOnly } = data

  const isTestEnded = false

  const [getHungerInfo, { loading, error, data: hungerPhaseInfo }] =
    useLazyQuery(GET_HUNGER_PHASE_INFO)

  const [getIsClaimable, { error: claimError, data: isClaimable }] =
    useLazyQuery(GET_IS_CLAIMABLE, {
      variables: { address: account },
    })

  useEffect(() => {
    if (account) {
      getIsClaimable()
      getHungerInfo()
    }
  }, [account])

  useEffect(() => {
    if (hungerPhaseInfo?.getHungerPhaseInfo) {
      const startTime = new Date(
        hungerPhaseInfo.getHungerPhaseInfo.startTime * 1000
      )
      const endTime = new Date(
        hungerPhaseInfo.getHungerPhaseInfo.endTime * 1000
      )
      const dailyQuota = ethers.BigNumber.from(
        hungerPhaseInfo.getHungerPhaseInfo.dailyQuota
      )
      const dailyUsed = ethers.BigNumber.from(
        hungerPhaseInfo.getHungerPhaseInfo.dailyUsed
      )
      const timeNow = new Date().getTime()
      if (timeNow < startTime) {
        setIsInHungerPhase(0)
      } else if (timeNow > endTime) {
        setIsInHungerPhase(2)
      } else {
        setIsInHungerPhase(1)
      }
      setDailyUsed(dailyUsed.toNumber())
      setDailyLimit(dailyQuota.toNumber())
    }
  }, [hungerPhaseInfo])

  useEffect(() => {
    if (isClaimable?.getIsClaimable) {
      setClaimable(true)
    } else setClaimable(false)
  }, [isClaimable])

  const getMainContent = () => {
    if (isEmptyAddress(account) || isReadOnly) return null
    if (loading)
      return (
        <AnimationSpin
          className="flex justify-center mt-10 text-center"
          size={40}
        />
      )
    if (isInHungerPhase === 0)
      return (
        <div className="mt-[55px]">
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist text-2xl">
            Please wait for the mainnet test to begin on Sep 7th.
          </p>
        </div>
      )
    else if (isInHungerPhase === 1) {
      return (
        <div className="mt-5 space-y-7">
          <p className="text-lg font-semibold leading-6 text-center text-gray-700 font-urbanist">
            Registration Limit: {dailyUsed}/{dailyLimit}
          </p>
          <Search
            className="px-7 md:px-0 md:w-[600px] mx-auto"
            searchingDomainName={searchingDomainName}
          />
          {!claimable && (
            <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist text-2xl mt-[42px]">
              Mainnet test for today has ended. Please come back for the next
              round on tomorrow.
            </p>
          )}
        </div>
      )
    } else {
      return (
        <div className="mt-5 space-y-7">
          <p className="text-lg font-semibold leading-6 text-center text-gray-700 font-urbanist">
            Registration Limit: {dailyUsed}/{dailyLimit}
          </p>
          <Search
            className="px-7 md:px-0 md:w-[600px] mx-auto"
            searchingDomainName={searchingDomainName}
          />
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist text-2xl mt-[42px]">
            Mainnet test has ended. Please wait for the public registration.
          </p>
        </div>
      )
    }
  }

  return (
    <div className="py-[84px] mx-auto min-w-[100%] md:min-w-[60%] min-h-screen flex items-center justify-center">
      <div className="min-h-[202px]">
        <div>
          <div className="flex justify-center">
            <SpaceIDTextIcon />
          </div>
        </div>
        {getMainContent()}
      </div>
    </div>
  )
}
