import React, { useEffect, useState } from 'react'
import { EMPTY_ADDRESS } from 'utils/records'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

import { useAccount } from 'components/QueryAccount'
import { getNetworkId } from 'ui'

import ProfileCard from './ProfileCard'

import DomainList from './DomainList'

import { setSelectedDomain } from 'app/slices/domainSlice'

export default function Sidebar({ className, isReadOnly }) {
  const [networkId, setNetworkID] = useState('')

  const dispatch = useDispatch()
  const selectedDomain = useSelector((state) => state.domain.selectedDomain)
  const domains = useSelector((state) => state.domain.domains)
  const account = useAccount()

  useEffect(async () => {
    if (!isReadOnly && account && account !== EMPTY_ADDRESS) {
      const networkId = await getNetworkId()
      setNetworkID(networkId)
    }
  }, [isReadOnly, account])

  const selectDomain = async (domain) => {
    dispatch(setSelectedDomain(domain))
  }

  return (
    <div
      className={cn(
        'bg-fill-3 backdrop-blur-sm rounded-3xl p-5 min-h-[calc(100vh-180px)] flex flex-col justify-between w-[360px]',
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="pb-4 border-b border-fill-3">
          <ProfileCard
            className="pb-4"
            account={account}
            isReadOnly={isReadOnly}
            networkId={networkId}
          />
        </div>

        {/* <WidgetFunction className="mt-4 mb-4" /> */}
        {/* <DomainPanel /> */}
        <DomainList
          className="flex flex-col h-full mt-4"
          domainsList={domains}
          clickHandle={selectDomain}
          selectedDomain={selectedDomain}
        />
      </div>
    </div>
  )
}
