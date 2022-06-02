import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import axios from 'axios'
import { useAccount } from 'components/QueryAccount'
import { getNetworkId } from '@siddomains/ui'

import ProfileCard from './ProfileCard'
import WidgetFunction from './WidgetFunction'
import DomainPanel from './DomainPanel'
import DomainList from './DomainList'
import { GET_SINGLE_NAME } from 'graphql/queries'

import { setSelectedDomain } from 'app/slices/domainSlice'

export default function Sidebar({ className }) {
  const [domainList, setDomainList] = useState([])
  const dispatch = useDispatch()
  const selectedDomain = useSelector(state => state.domain.selectedDomain)
  const account = useAccount()

  // const { data, loading, error, refetch } = useQuery(GET_SINGLE_NAME, {
  //   variables: { name },
  //   fetchPolicy: 'no-cache',
  //   context: {
  //     queryDeduplication: false
  //   }
  // })
  const [fetchDomainDetailInfo, { called, loading, data }] = useLazyQuery(
    GET_SINGLE_NAME
  )

  const fetchDomainsList = async () => {
    const networkId = await getNetworkId()
    const params = {
      ChainID: networkId,
      Address: account
    }
    let result = await axios.post(
      'https://space-id-348516.uw.r.appspot.com/listname',
      params
    )
    const data = result?.data?.map(item => {
      const date = new Date(item?.expires)
      return {
        name: item?.name,
        expires_at: `${date.getFullYear()}.${date.getMonth()}.${date.getDate()}`
      }
    })
    setDomainList(data)
  }

  useEffect(() => {
    if (account) {
      fetchDomainsList()
    }
    fetchDomainsList()
  }, [account])

  const selectDomain = async (domain, index) => {
    console.log('domain clicked: ', domain)
    await fetchDomainDetailInfo({ variables: { name: domain.name } })
  }

  useEffect(() => {
    if (data) {
      console.log('data', data)
      dispatch(setSelectedDomain(data.singleName))
    }
  }, [data, called, loading])

  return (
    <div
      className={cn(
        'bg-[rgba(204,252,255,0.2)] backdrop-blur-sm rounded-[24px] p-[20px] min-h-[calc(100vh-180px)] flex flex-col justify-between',
        className
      )}
    >
      <div>
        <ProfileCard className="mb-4" />
        {/* <WidgetFunction className="mt-4 mb-4" /> */}
        <DomainPanel />
        <DomainList
          className="mt-4"
          domainsList={domainList}
          clickHandle={selectDomain}
          selectedDomain={selectedDomain}
        />
      </div>
      <div className="text-[#30DB9E] text-center text-[12px]">
        Learn how to manage your name
      </div>
    </div>
  )
}
