import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, gql, useLazyQuery } from '@apollo/client'
import Search from 'components/SearchName/Search'
import { SpaceIDTextIcon, RefreshIcon } from 'components/Icons'
import { useAccount } from 'components/QueryAccount'
import { isEmptyAddress } from 'utils/records'
import AnimationSpin from 'components/AnimationSpin'
import VerifyModal from 'components/Modal/VerifyModal'
import { useGetStagingQuota, useStagingInfo } from '../hooks/stagingHooks'

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
  const modalFlag = useRef(false)
  const initStagingInfo = useSelector((state) => state.staging.init)
  const account = useAccount()
  const { fetchStagingQuota, loading: fetchQuotaLoading } =
    useGetStagingQuota(account)
  const {
    isStart,
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
    if (initStagingInfo) {
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [initStagingInfo])
  useEffect(() => {
    if (
      isStart &&
      !isEmptyAddress(account) &&
      !isReadOnly &&
      (!individualQuota || individualQuota <= 2) &&
      !modalFlag.current
    ) {
      modalFlag.current = true
      const tip = window.localStorage.getItem(`tip-${account}`)
      setOpenVerifyModal(!tip)
      window.localStorage.setItem(`tip-${account}`, '1')
    }
  }, [account, isReadOnly, individualQuota, isStart])

  const getMainContent = () => {
    if (loading)
      return (
        <AnimationSpin
          className="flex justify-center mt-10 text-center"
          size={40}
        />
      )
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
    return (
      <div className="mt-7 flex flex-col items-center">
        {isStart && !!totalQuota && (
          <div className="mb-5 flex items-center flex-col">
            <div className="flex md:justify-center md:flex-row flex-col items-center">
              <p className="text-lg text-gray-700">{`Staging launch limit: ${usedQuota}/${totalQuota}`}</p>
              {usedQuota < totalQuota && (
                <>
                  <div className="md:w-[1px] md:h-[26px] w-full h-[1px] bg-[#CCFCFF]/20 md:mx-6 my-2" />
                  <div className="text-lg text-gray-700 text-center flex items-center">
                    <p className="mr-2">{`Your registration limit: ${individualQuotaUsed}/${individualQuota}`}</p>
                    {individualQuota <= 2 && (
                      <>
                        {fetchQuotaLoading ? (
                          <AnimationSpin size={16} />
                        ) : (
                          <RefreshIcon
                            className="cursor-pointer"
                            onClick={() => fetchStagingQuota()}
                          />
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            {usedQuota < totalQuota && (
              <a
                className="text-base font-semibold text-green-200 font-urbanist cursor-pointer mt-5"
                onClick={() => setOpenVerifyModal(true)}
              >
                Staging Launch Rules ↗{' '}
              </a>
            )}
          </div>
        )}
        <Search
          className="px-7 md:px-0 md:w-[600px] mx-auto"
          searchingDomainName={searchingDomainName}
        />
        {!isStart && (
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist md:text-2xl text-xl mt-[80px]">
            Staging launch will begin on Sep 15th.
          </p>
        )}
        {isStart && usedQuota >= totalQuota ? (
          <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist md:text-2xl text-xl mt-[80px]">
            Staging Launch has ended. Please wait for the public registration.
          </p>
        ) : (
          isStart &&
          individualQuotaUsed >= individualQuota && (
            <p className="font-bold leading-[34px] text-center text-gray-700 font-urbanist md:text-2xl text-xl mt-[80px]">
              You have used up your quota. Please wait for the public
              registration.
            </p>
          )
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
