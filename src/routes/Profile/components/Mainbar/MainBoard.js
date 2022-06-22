// Import packages
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import { useQuery } from '@apollo/client'
import { getNamehash, emptyAddress } from '@siddomains/ui'
import { formatsByCoinType } from '@siddomains/address-encoder'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import union from 'lodash/union'

//Import components
import { Address } from 'components/Addresses'
import { AddNewButton } from 'components/Button'
import CopyIcon from 'components/Icons/CopyIcon'
import Info from 'components/Icons/Info'
import AnimationSpin from 'components/AnimationSpin'
import PendingTx from 'components/PendingTx'

//Import queries
import {
  GET_RESOLVER_FROM_SUBGRAPH,
  GET_ADDRESSES,
  GET_TEXT_RECORDS
} from 'graphql/queries'
import { refetchTilUpdatedSingle } from 'utils/graphql'

//Import Redux
import { toggleEditMode } from 'app/slices/accountSlice'
import { usePrevious } from '../../../../utils/utils'

//Import constants
import TEXT_PLACEHOLDER_RECORDS from 'constants/textRecords'
import COIN_LIST from 'constants/coinList'

//Import custom functions
import { convertToETHAddressDisplayFormat } from '../../../../utils/utils'

const haveAddresses = true
const haveProfile = true

const COIN_PLACEHOLDER_RECORDS = ['ETH', ...COIN_LIST.slice(0, 3)]

function isContentHashEmpty(hash) {
  return hash?.startsWith('undefined') || parseInt(hash, 16) === 0
}

const useGetRecords = domain => {
  const { data: dataResolver } = useQuery(GET_RESOLVER_FROM_SUBGRAPH, {
    variables: {
      id: getNamehash(domain.name + '.bnb')
    }
  })

  const resolver =
    dataResolver && dataResolver.domain && dataResolver.domain.resolver

  const coinList =
    resolver &&
    resolver.coinTypes &&
    resolver.coinTypes
      .map(c => {
        return formatsByCoinType[c] && formatsByCoinType[c].name
      })
      .filter(c => c)

  const { loading: addressesLoading, data: dataAddresses } = useQuery(
    GET_ADDRESSES,
    {
      variables: {
        name: domain.name + '.bnb',
        keys: union(coinList, COIN_PLACEHOLDER_RECORDS)
      },
      fetchPolicy: 'network-only'
    }
  )

  const { loading: textRecordsLoading, data: dataTextRecords } = useQuery(
    GET_TEXT_RECORDS,
    {
      variables: {
        name: domain.name + 'bnb',
        keys: union(resolver && resolver.texts, TEXT_PLACEHOLDER_RECORDS)
      },
      fetchPolicy: 'network-only'
    }
  )
  return {
    dataAddresses,
    dataTextRecords,
    recordsLoading: addressesLoading || textRecordsLoading
  }
}

const processRecords = (records, placeholder) => {
  const nonDuplicatePlaceholderRecords = placeholder.filter(
    record => !records.find(r => record === r.key)
  )

  const recordsSansEmpty = records.map(record => {
    if (record.value === emptyAddress) {
      return { ...record, value: '' }
    }
    return record
  })

  return [
    ...recordsSansEmpty,
    ...nonDuplicatePlaceholderRecords.map(record => ({
      key: record,
      value: ''
    }))
  ]
}

const getInitialTextRecords = (dataTextRecords, domain) => {
  const textRecords =
    dataTextRecords && dataTextRecords.getTextRecords
      ? processRecords(dataTextRecords.getTextRecords, TEXT_PLACEHOLDER_RECORDS)
      : processRecords([], TEXT_PLACEHOLDER_RECORDS)

  return textRecords?.map(textRecord => ({
    contractFn: 'setText',
    ...textRecord
  }))
}

const getInitialCoins = dataAddresses => {
  const addresses =
    dataAddresses && dataAddresses.getAddresses
      ? processRecords(dataAddresses.getAddresses, COIN_PLACEHOLDER_RECORDS)
      : processRecords([], COIN_PLACEHOLDER_RECORDS)

  return addresses?.map(address => ({
    contractFn: 'setAddr(bytes32,uint256,bytes)',
    ...address
  }))
}

const getCoins = updatedRecords =>
  updatedRecords
    .filter(record => record.contractFn === 'setAddr(bytes32,uint256,bytes)')
    .sort(record => (record.key === 'ETH' ? -1 : 1))

const getInitialContent = domain => {
  return {
    contractFn: 'setContenthash',
    key: 'CONTENT',
    value: isContentHashEmpty(domain.content) ? '' : domain.content
  }
}

const getInitialRecords = (domain, dataAddresses, dataTextRecords) => {
  const initialTextRecords = getInitialTextRecords(dataTextRecords, domain)
  var initialCoins = getInitialCoins(dataAddresses)

  initialCoins[0].key = 'EVM'
  const initialContent = getInitialContent(domain)

  return [...initialTextRecords, ...initialCoins, initialContent]
}

const useInitRecords = (
  domain,
  dataAddresses,
  dataTextRecords,
  setInitialRecords
) => {
  useEffect(() => {
    setInitialRecords(getInitialRecords(domain, dataAddresses, dataTextRecords))
  }, [domain, dataAddresses, dataTextRecords])
}

const useUpdatedRecords = (
  recordsLoading,
  initialRecords,
  setUpdatedRecords
) => {
  const prevInitialRecords = usePrevious(initialRecords)
  useEffect(() => {
    if (!recordsLoading || prevInitialRecords !== initialRecords) {
      setUpdatedRecords(initialRecords)
    }
  }, [recordsLoading, initialRecords, prevInitialRecords])
}

export default function MainBoard({
  selectedDomain,
  className,
  resolverAddress,
  loadingResolverAddress,
  setResolver,
  pending,
  setConfirmed,
  refetchAddress,
  fetchAddress,
  address,
  txHash
}) {
  const editOn = useSelector(state => state.account.profileEditMode)

  const { dataAddresses, dataTextRecords, recordsLoading } = useGetRecords(
    selectedDomain
  )
  const [updatedRecords, setUpdatedRecords] = useState([])
  const [initialRecords, setInitialRecords] = useState([])

  useInitRecords(
    selectedDomain,
    dataAddresses,
    dataTextRecords,
    setInitialRecords
  )

  useUpdatedRecords(recordsLoading, initialRecords, setUpdatedRecords)

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  const handleResolverAddressCopy = e => {
    e.preventDefault()
    copyTextToClipboard(resolverAddress)
      .then(() => {
        alert('copied')
      })
      .catch(err => {
        alert('err')
      })
  }

  const handleBNBAddressCopy = e => {
    e.preventDefault()
    copyTextToClipboard(getCoins(updatedRecords)[0]?.value)
      .then(() => {
        alert('copied')
      })
      .catch(err => {
        alert('err')
      })
  }

  return (
    <div className={cn(className)}>
      <div className="bg-[rgba(67,140,136,0.25)] rounded-[24px] p-5">
        <p className="text-[#B1D6D3] font-bold text-[20px]">Records</p>
        <div className="bg-[rgba(67,140,136,0.25)] rounded-[24px] flex items-center justify-between py-[19px] px-6 mt-5">
          <div>
            <p className="text-[#B1D6D3] font-bold text-[20px]">BNB Address</p>
            <div className="flex items-center text-[#B1D6D3] text-[18px] mt-1">
              <p className="mr-2">{getCoins(updatedRecords)[0]?.value}</p>
              <span className="cursor-pointer" onClick={handleBNBAddressCopy}>
                <CopyIcon />
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <Info />
            <button className="text-white py-2 px-[40px] bg-[#7E9195] rounded-full ml-4">
              Edit
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 mt-8 flex justify-between">
        {loadingResolverAddress ? (
          <AnimationSpin />
        ) : (
          <div>
            <p className="text-[#B1D6D3] font-bold text-[20px]">Resolver</p>
            {pending ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={async () => {
                  refetchTilUpdatedSingle({
                    refetch: refetchAddress,
                    interval: 300,
                    keyToCompare: 'registrant',
                    prevData: address
                  })
                  await fetchAddress()
                  setConfirmed()
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center text-[#B1D6D3] text-[18px] mt-1">
                <p className="mr-2">{resolverAddress}</p>
                <div
                  className="cursor-pointer"
                  onClick={e => handleResolverAddressCopy(e)}
                >
                  <CopyIcon />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center">
          <Info />
          <button
            className="text-white py-2 px-[40px] bg-[#7E9195] rounded-full ml-4"
            onClick={setResolver}
          >
            Set
          </button>
        </div>
      </div>
    </div>
  )
}
