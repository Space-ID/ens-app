import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { EMPTY_ADDRESS } from 'utils/records'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import axios from 'axios'

import { useAccount } from 'components/QueryAccount'
import { getNetworkId } from '@siddomains/ui'

import ProfileCard from './ProfileCard'

import DomainList from './DomainList'
import { GET_SINGLE_NAME } from 'graphql/queries'

import { setSelectedDomain, setAllDomains } from 'app/slices/domainSlice'

export default function Sidebar({ className, isReadOnly }) {
  const [domainList, setDomainList] = useState([])
  const [networkId, setNetworkID] = useState('')

  const dispatch = useDispatch()
  const selectedDomain = useSelector(state => state.domain.selectedDomain)
  const domains = useSelector(state => state.domain.domains)
  const account = useAccount()

  const fetchDomainsList = async () => {
    const networkId = await getNetworkId()
    setNetworkID(networkId)
    const params = {
      ChainID: networkId,
      Address: account
    }
    let result = await axios.post(
      'https://backend.prd.space.id/listname',
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
    if (!isReadOnly && account && account !== EMPTY_ADDRESS) {
      fetchDomainsList()
    }
    if (isReadOnly) {
      setDomainList([])
      dispatch(setSelectedDomain(null))
      dispatch(setAllDomains([]))
    }
  }, [isReadOnly, account])

  const selectDomain = async (domain, index) => {
    dispatch(setSelectedDomain(domain))
  }

  return (
    <div
      className={cn(
        'bg-[rgba(204,252,255,0.2)] backdrop-blur-sm rounded-[24px] p-[20px] min-h-[calc(100vh-180px)] flex flex-col justify-between max-w-[360px]',
        className
      )}
    >
      <div className="h-full flex flex-col">
        <ProfileCard
          className="mb-4"
          account={account}
          isReadOnly={isReadOnly}
          networkId={networkId}
        />
        {/* <WidgetFunction className="mt-4 mb-4" /> */}
        {/* <DomainPanel /> */}
        <DomainList
          className="mt-4 h-full flex flex-col"
          domainsList={domains}
          clickHandle={selectDomain}
          selectedDomain={selectedDomain}
        />
      </div>
    </div>
  )
}
