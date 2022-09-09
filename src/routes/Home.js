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
import VerifyModal from 'components/Modal/VerifyModal'

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export default () => {
  const [loading, setLoading] = useState(false)
  const [openVerifyModal, setOpenVerifyModal] = useState(true)
  const [isInHungerPhase, setIsInHungerPhase] = useState(0)
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
          <Search
            className="px-7 md:px-0 md:w-[600px] mx-auto"
            searchingDomainName={searchingDomainName}
          />
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist text-2xl mt-[42px]">
            Please wait for the staging launch to begin on next week.
          </p>
        </div>
      )
    else if (isInHungerPhase === 1) {
      return (
        <div className="mt-5 space-y-7">
          <Search
            className="px-7 md:px-0 md:w-[600px] mx-auto"
            searchingDomainName={searchingDomainName}
          />
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist text-2xl mt-[42px]">
            Please wait for the staging launch to begin on next week.
          </p>
        </div>
      )
    } else {
      return (
        <div className="mt-5 space-y-7">
          <Search
            className="px-7 md:px-0 md:w-[600px] mx-auto"
            searchingDomainName={searchingDomainName}
          />
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist text-2xl mt-[42px]">
            Staging Launch has ended. Please wait for the public registration.
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
      {openVerifyModal && (
        <VerifyModal closeModal={() => setOpenVerifyModal(false)} />
      )}
    </div>
  )
}
