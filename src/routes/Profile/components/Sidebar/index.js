import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { EMPTY_ADDRESS } from 'utils/records'
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

import { setSelectedDomain, setAllDomains } from 'app/slices/domainSlice'

export default function Sidebar({ className }) {
  const [domainList, setDomainList] = useState([])
  const dispatch = useDispatch()
  const selectedDomain = useSelector(state => state.domain.selectedDomain)
  const account = useAccount()

  const fetchDomainsList = async () => {
    const networkId = await getNetworkId()
    const params = {
      ChainID: networkId,
      Address: account
    }
    let result = await axios.post(
      'https://backend.stg.space.id/listname',
      params
    )
    const data = result?.data?.map(item => {
      const date = new Date(item?.expires)
      return {
        expires_at: `${date.getFullYear()}.${date.getMonth() +
          1}.${date.getDate()}`,
        ...item
      }
    })
    if (data.length > 0) {
      if (!selectedDomain) {
        dispatch(setSelectedDomain(data[0]))
      }
    }
    dispatch(setAllDomains(data))
    setDomainList(data)
  }

  useEffect(() => {
    if (account && account !== EMPTY_ADDRESS) {
      fetchDomainsList()
    }
    fetchDomainsList()
  }, [account])

  const selectDomain = async (domain, index) => {
    dispatch(setSelectedDomain(domain))
  }

  return (
    <div
      className={cn(
        'bg-[rgba(204,252,255,0.2)] backdrop-blur-sm rounded-[24px] p-[20px] min-h-[calc(100vh-180px)] flex flex-col justify-between',
        className
      )}
    >
      <div className="h-full flex flex-col">
        <ProfileCard className="mb-4" account={account} />
        {/* <WidgetFunction className="mt-4 mb-4" /> */}
        {/* <DomainPanel /> */}
        <DomainList
          className="mt-4 h-full flex flex-col"
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