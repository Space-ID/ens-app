import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-daisyui'
import { useQuery } from '@apollo/client'
import Search from 'components/SearchName/Search'
import { SpaceIDTextIcon } from 'components/Icons'

import { useAccount } from 'components/QueryAccount'
import { GET_ELIGIBLE_COUNT } from '../../graphql/queries'

import { isEmptyAddress } from '../../utils/records'
import { connectProvider } from 'utils/providerUtils'

import AnimationSpin from 'components/AnimationSpin'

import { setRedeemableQuota } from 'app/slices/accountSlice'

export default function Redemption() {
  const searchingDomainName = useSelector(
    (state) => state.domain.searchingDomainName
  )

  const account = useAccount()

  const dispatch = useDispatch()

  const { data, loading } = useQuery(GET_ELIGIBLE_COUNT, {
    variables: {
      account,
    },
    fetchPolicy: 'no-cache',
  })

  const connect = () => {
    connectProvider()
  }

  useEffect(() => {
    if (data?.getEligibleCount) {
      dispatch(setRedeemableQuota(data?.getEligibleCount?.toString()))
    }
  }, [data])

  const renderMainContent = () => {
    if (loading) {
      return (
        <AnimationSpin className="flex justify-center text-center" size={40} />
      )
    }
    if (data.getEligibleCount.toString() === '0') {
      return (
        <p className="text-2xl font-semibold leading-8 text-center text-gray-700 font-urbanist mt-[95px]">
          You have insufficient quota for domain redemption. Thank you for
          joining SPACE ID Pre-registration Event!
        </p>
      )
    }
    return (
      <div className="space-y-5">
        <p className="text-2xl font-semibold leading-8 text-center text-gray-700 font-urbanist">
          Redeemable quota: {loading ? null : data.getEligibleCount.toString()}
        </p>
        <Search
          className="px-7 md:px-0 md:w-[600px] mx-auto"
          searchingDomainName={searchingDomainName}
        />
      </div>
    )
  }

  return (
    <div className="py-20 mx-auto min-w-[100%] md:min-w-[60%] min-h-screen flex items-center justify-center">
      <div className="min-h-[202px]">
        <div className="flex justify-center mb-5">
          <SpaceIDTextIcon />
        </div>
        {isEmptyAddress(account) ? (
          <div className="mt-[95px] space-y-10">
            <p className="text-2xl font-bold leading-8 text-gray-700 font-urbanist">
              Pre-registration is now open for the whitelisted users.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={connect}
                color="primary"
                className="w-[226px] h-[66px] rounded-[20px] text-2xl font-semibold leading-8 normal-case font-urbanist text-dark-common"
              >
                Connect Wallet
              </Button>
            </div>
          </div>
        ) : (
          renderMainContent()
        )}
      </div>
    </div>
  )
}
