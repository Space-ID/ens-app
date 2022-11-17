import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, gql } from '@apollo/client'
import Search from 'components/SearchName/Search'
import { SpaceIDTextIcon } from 'components/Icons'
import { useAccount } from 'components/QueryAccount'
import { isEmptyAddress } from 'utils/records'
import AnimationSpin from 'components/AnimationSpin'
import { fetchStatisticData } from '../api'

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
  const [statisticData, setStatisticData] = useState(undefined)
  const searchingDomainName = useSelector(
    (state) => state.domain.searchingDomainName
  )
  const account = useAccount()
  const { data } = useQuery(HOME_DATA, {
    variables: {
      address: account,
    },
  })

  useEffect(() => {
    fetchStatisticData().then((res) => {
      const format = new Intl.NumberFormat('en', {
        notation: 'compact',
      }).format
      setStatisticData({
        registeredNum: format(res?.registeredNum ?? 0),
        holdersNum: format(res?.holdersNum ?? 0),
        partnersNum: format(res?.partnersNum ?? 0),
      })
    })
  }, [])

  const { isReadOnly } = data

  const getMainContent = () => {
    if (isEmptyAddress(account) || isReadOnly) {
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
        <Search
          className="px-7 md:px-0 md:w-[600px] mx-auto"
          searchingDomainName={searchingDomainName}
        />
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
        {statisticData && (
          <div
            className="mt-20 mx-auto flex md:flex-nowrap flex-wrap justify-between md:w-[623px] w-[358px] md:px-10 text-primary text-6xl text-[56px] font-bold text-center rounded-t-3xl"
            style={{
              background:
                'linear-gradient(180deg, rgba(67, 140, 136, 0.25) 0%, rgba(67, 140, 136, 0) 100%)',
            }}
          >
            <div className="py-6 md:w-auto w-full">
              <p>{statisticData.registeredNum}</p>
              <p className="text-sm font-semibold mt-1">
                .bnb domain registered
              </p>
            </div>
            <div className="s-divider w-[1px] h-auto hidden md:block"></div>
            <div className="s-divider s-divider-h md:hidden"></div>
            <div className="py-6 md:w-auto w-1/2 md:border-0 border-r border-fill-3">
              <p>{statisticData.holdersNum}</p>
              <p className="text-sm font-semibold mt-1">Unique holders</p>
            </div>
            <div className="s-divider w-[1px] hidden md:block"></div>
            <div className="py-6 md:w-auto w-1/2">
              <p>{statisticData.partnersNum}</p>
              <p className="text-sm font-semibold mt-1">
                <a href="https://docs.space.id/overview/integration-partners">
                  Eco-system Partners ↗
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
