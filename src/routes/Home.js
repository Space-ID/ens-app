import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import Search from 'components/SearchName/Search'
import { SpaceIDTextIcon } from 'components/Icons'
import { useAccount } from 'components/QueryAccount'
import { isEmptyAddress } from 'utils/records'
import AnimationSpin from 'components/AnimationSpin'
import VerifyModal from 'components/Modal/VerifyModal'
import { useStagingInfo } from '../hooks/stagingHooks'

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
  const [openVerifyModal, setOpenVerifyModal] = useState(false)
  const searchingDomainName = useSelector(
    (state) => state.domain.searchingDomainName
  )
  const account = useAccount()
  const {
    isStart,
    verify,
    totalQuota,
    usedQuota,
    individualQuota,
    individualQuotaUsed,
  } = useStagingInfo()
  const { data } = useQuery(HOME_DATA, {
    variables: {
      address: account,
    },
  })

  const { isReadOnly } = data

  useEffect(() => {
    if (!isEmptyAddress(account) && !isReadOnly && !verify) {
      setOpenVerifyModal(true)
    }
  }, [account, isReadOnly, verify])

  const getMainContent = () => {
    if (isEmptyAddress(account) || isReadOnly) {
      if (!isStart) {
        return (
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist md:text-2xl text-xl mt-[60px]">
            Staging launch will begin on Sep 15th.
          </p>
        )
      }
      return null
    }
    if (loading)
      return (
        <AnimationSpin
          className="flex justify-center mt-10 text-center"
          size={40}
        />
      )
    return (
      <div className="mt-7 flex flex-col items-center">
        <div className="mb-5">
          <div className="flex md:justify-center md:flex-row flex-col items-center">
            <p className="text-lg text-gray-700">{`Staging launch limit: ${usedQuota}/${totalQuota}`}</p>
            {verify && (
              <>
                <div className="md:w-[1px] md:h-[26px] w-full h-[1px] bg-[#CCFCFF]/20 md:mx-6 my-2" />
                <p className="text-lg text-gray-700 text-center">{`Your registration limit: ${individualQuotaUsed}/${individualQuota}`}</p>
              </>
            )}
          </div>
          {!verify && (
            <button
              className="w-[181px] h-[42px] rounded-2xl bg-green-200 text-dark-common text-lg font-semibold my-5"
              onClick={() => setOpenVerifyModal(true)}
            >
              Verify Your SBT
            </button>
          )}
        </div>
        <Search
          className="px-7 md:px-0 md:w-[600px] mx-auto"
          searchingDomainName={searchingDomainName}
        />
        {!isStart && (
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist md:text-2xl text-xl mt-[80px]">
            Staging launch will begin on Sep 15th.
          </p>
        )}
      </div>
    )
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
