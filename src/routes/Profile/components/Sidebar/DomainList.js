import React, { useState, useEffect, useCallback } from 'react'
import cn from 'classnames'
import moment from 'moment'

import { Searchbar } from 'components/Input'
import { BarIcon } from 'components/Icons'
import ArrowIcon from 'components/Icons/ArrowIcon'
import SortAscendingIcon from '../../../../components/Icons/SortAssendingIcon'
import SortDescendingIcon from 'components/Icons/SortDecendingIcon'
import TimeAscendingIcon from 'components/Icons/TimeAscendingIcon'
import TimeDecendingIcon from 'components/Icons/TimeDecendingIcon'

function sortFunctionByAToZ(first, second) {
  if (first.name > second.name) {
    return -1
  }
  if (first.name < second.name) {
    return 1
  }
  return 0
}

function sortFunctionByZToA(first, second) {
  if (first.name > second.name) {
    return 1
  }
  if (first.name < second.name) {
    return -1
  }
  return 0
}

function sortByTimeAscending(first, second) {
  if (moment(first.expires) > moment(second.expires)) {
    return 1
  }
  if (moment(first.expires) < moment(second.expires)) {
    return -1
  }
  return 0
}

function sortByTimeDescending(first, second) {
  if (moment(first.expires) > moment(second.expires)) {
    return -1
  }
  if (moment(first.expires) < moment(second.expires)) {
    return 1
  }
  return 0
}

export default function DomainList({
  className,
  domainsList,
  clickHandle,
  selectedDomain,
}) {
  const [searchKey, setSearchKey] = useState('')
  const [domains, setDomains] = useState(domainsList)
  const [sortBy, setSortBy] = useState(null)

  const onChangeHandler = (event) => {
    setSearchKey(event.target.value.trim())
  }

  useEffect(() => {
    if (domainsList) {
      setDomains(domainsList)
    }
  }, [domainsList])

  const handleSortBy = useCallback(
    (param) => {
      let lDomains
      if (searchKey) {
        lDomains = domainsList.filter(
          (item) => item.name.indexOf(searchKey) !== -1
        )
      } else {
        lDomains = [...domainsList]
      }
      if (param === 'AToZ') {
        lDomains.sort(sortFunctionByZToA)
      } else if (param === 'ZToA') {
        lDomains.sort(sortFunctionByAToZ)
      } else if (param === 'TimeAscending') {
        lDomains.sort(sortByTimeAscending)
      } else if (param === 'TimeDecendingIcon') {
        lDomains.sort(sortByTimeDescending)
      }
      // if(searchKey) {
      //   lDomains = domains.filter(item => item.name.indexOf(searchKey) !== -1)
      // }
      setDomains(lDomains)
    },
    [searchKey, domainsList]
  )

  useEffect(() => {
    handleSortBy(sortBy)
  }, [searchKey, sortBy, domainsList])

  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between pr-5">
        <Searchbar className="mr-[14px]" onChangeHandler={onChangeHandler} />
        <div className="relative h-full group">
          <BarIcon className="text-[rgba(204,252,255,0.6)] cursor-pointer h-full flex items-center" />
          <div className="absolute z-[10] bg-[rgba(204,252,255,0.6)] rounded-xl p-3 hidden group-hover:block cursor-pointer top-[30px] right-[-20px] backdrop-blur-md">
            <div onClick={() => setSortBy('AToZ')}>
              <SortAscendingIcon className="text-dark-100 border-b border-b-[rgba(67,140,136,0.25)] p-1" />
            </div>
            <div onClick={() => setSortBy('ZToA')}>
              <SortDescendingIcon className="text-dark-100 border-b border-b-[rgba(67,140,136,0.25)] p-1" />
            </div>
            <div onClick={() => setSortBy('TimeAscending')}>
              <TimeAscendingIcon className="text-dark-100 border-b border-b-[rgba(67,140,136,0.25)] p-1" />
            </div>
            <div onClick={() => setSortBy('TimeDescending')}>
              <TimeDecendingIcon className="p-1 text-dark-100" />
            </div>
          </div>
        </div>
      </div>
      {domainsList.length > 0 ? (
        <div className="mt-4 relative max-h-[calc(100vh-335px)] md:max-h-[60vh] overflow-y-auto mr-3 pr-2">
          {domains.map((item, index) => (
            <div
              onClick={() => {
                clickHandle(item, index)
              }}
              className={cn(
                'mb-5 w-full py-2 px-4 relative cursor-pointer overflow-hidden break-all',
                item.name === selectedDomain?.name
                  ? 'bg-green-100 rounded-2xl'
                  : ''
              )}
            >
              <div
                className={cn(
                  item.name === selectedDomain?.name
                    ? 'text-dark-common text-xl pr-5'
                    : 'text-green-200',
                  'font-semibold text-base'
                )}
              >
                {item.name}
              </div>
              <div
                className={
                  ('text-[14px]',
                  cn(
                    item.name === selectedDomain?.name
                      ? 'text-[#2A9971]'
                      : 'text-gray-700'
                  ))
                }
              >
                expires {moment(item.expires_at).format('YYYY-MM-DD')}
              </div>
              {item.name === selectedDomain?.name && (
                <div className="absolute right-4 top-[calc(50%-7px)]">
                  <ArrowIcon />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-700 text-base text-center mt-[40px]">
          This address doesn't own any domain
        </div>
      )}
    </div>
  )
}
