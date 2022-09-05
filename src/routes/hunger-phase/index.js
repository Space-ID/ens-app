import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, gql } from '@apollo/client'
import Search from 'components/SearchName/Search'
import { SpaceIDTextIcon } from 'components/Icons'
import { useAccount } from 'components/QueryAccount'
import { isEmptyAddress } from 'utils/records'

import API from 'common/API'

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export default () => {
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

  //If value is 0 it means not started hunger phase 1 means is in the hunger phase and 2 means passed hunger phase
  const isInHungerPhase = 1
  const isTestEnded = true

  console.log('debug: account: ', account)

  useEffect(() => {
    if (account) {
      API.get(`/whitelist?address=${account}`)
        .then((res) => {
          console.log('debug: res.data: ', res.data)
          // User is eligible to send the wishlist
          if (res.data) {
            const timeNow = new Date().getTime()
            let tState = 1
          } else {
          }
        })
        .catch((err) => {
          console.log('debug: error when getting whitelist: ', err)
        })
        .finally(() => {
          dispatch(stopConnect())
        })
    }
  }, [account])

  const getMainContent = () => {
    if (isEmptyAddress(account) || isReadOnly) return null
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
            Registration Limit: 122/300
          </p>
          <Search
            className="px-7 md:px-0 md:w-[600px] mx-auto"
            searchingDomainName={searchingDomainName}
          />
          {isTestEnded && (
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
            Registration Limit: 122/300
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
