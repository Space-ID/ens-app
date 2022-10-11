//Import packages
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import { useMutation, useQuery } from '@apollo/client'
import { getNamehash, emptyAddress } from 'ui'
import { formatsByCoinType } from '@siddomains/address-encoder'
import union from 'lodash/union'

//Import components
import PendingTx from 'components/PendingTx'
import Tooltip from 'components/Tooltip/index'

//Import GraphQL Queries
import {
  GET_RESOLVER_FROM_SUBGRAPH,
  GET_ADDRESSES,
  GET_TEXT_RECORDS,
} from 'graphql/queries'
import { SET_RESOLVER } from 'graphql/mutations'

import TEXT_PLACEHOLDER_RECORDS from 'constants/textRecords'

import COIN_LIST from 'constants/coinList'
import CopyIcon from 'components/Icons/CopyIcon'
import AnimationSpin from 'components/AnimationSpin'

import { isEmptyAddress } from 'utils/records'
import { usePrevious } from '../../../../utils/utils'

//Import GraphQL
import { refetchTilUpdatedSingle } from 'utils/graphql'

import useTransaction from 'hooks/useTransaction'

const COIN_PLACEHOLDER_RECORDS = ['ETH', ...COIN_LIST.slice(0, 3)]

function isContentHashEmpty(hash) {
  return hash?.startsWith('undefined') || parseInt(hash, 16) === 0
}

const useGetRecords = (domain) => {
  const { data: dataResolver } = useQuery(GET_RESOLVER_FROM_SUBGRAPH, {
    variables: {
      id: getNamehash(domain.name + '.bnb'),
    },
  })

  const resolver =
    dataResolver && dataResolver.domain && dataResolver.domain.resolver

  const coinList =
    resolver &&
    resolver.coinTypes &&
    resolver.coinTypes
      .map((c) => {
        return formatsByCoinType[c] && formatsByCoinType[c].name
      })
      .filter((c) => c)

  const {
    loading: addressesLoading,
    data: dataAddresses,
    refetch: refetchDataAddress,
  } = useQuery(GET_ADDRESSES, {
    variables: {
      name: domain.name + '.bnb',
      keys: union(coinList, COIN_PLACEHOLDER_RECORDS),
    },
    fetchPolicy: 'network-only',
  })
  const { loading: textRecordsLoading, data: dataTextRecords } = useQuery(
    GET_TEXT_RECORDS,
    {
      variables: {
        name: domain.name + 'bnb',
        keys: union(resolver && resolver.texts, TEXT_PLACEHOLDER_RECORDS),
      },
      fetchPolicy: 'network-only',
    }
  )
  return {
    dataAddresses,
    dataTextRecords,
    recordsLoading: addressesLoading || textRecordsLoading,
    refetchDataAddress,
  }
}

const processRecords = (records, placeholder) => {
  const nonDuplicatePlaceholderRecords = placeholder.filter(
    (record) => !records.find((r) => record === r.key)
  )

  const recordsSansEmpty = records.map((record) => {
    if (record.value === emptyAddress) {
      return { ...record, value: '' }
    }
    return record
  })

  return [
    ...recordsSansEmpty,
    ...nonDuplicatePlaceholderRecords.map((record) => ({
      key: record,
      value: '',
    })),
  ]
}

const getInitialTextRecords = (dataTextRecords, domain) => {
  const textRecords =
    dataTextRecords && dataTextRecords.getTextRecords
      ? processRecords(dataTextRecords.getTextRecords, TEXT_PLACEHOLDER_RECORDS)
      : processRecords([], TEXT_PLACEHOLDER_RECORDS)

  return textRecords?.map((textRecord) => ({
    contractFn: 'setText',
    ...textRecord,
  }))
}

const getInitialCoins = (dataAddresses) => {
  const addresses =
    dataAddresses && dataAddresses.getAddresses
      ? processRecords(dataAddresses.getAddresses, COIN_PLACEHOLDER_RECORDS)
      : processRecords([], COIN_PLACEHOLDER_RECORDS)

  return addresses?.map((address) => ({
    contractFn: 'setAddr(bytes32,uint256,bytes)',
    ...address,
  }))
}

const getInitialContent = (domain) => {
  return {
    contractFn: 'setContenthash',
    key: 'CONTENT',
    value: isContentHashEmpty(domain.content) ? '' : domain.content,
  }
}

const getCoins = (updatedRecords) =>
  updatedRecords
    .filter((record) => record.contractFn === 'setAddr(bytes32,uint256,bytes)')
    .sort((record) => (record.key === 'ETH' ? -1 : 1))

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
  setResolverAddress,
  pending,
  setConfirmed,
  refetchAddress,
  fetchAddress,
  txHash,
  registrantAddress,
  isRegsitrant,
  showAddressChangeModalHandle,
  pendingBNBAddress,
  updatingBNBAddress,
}) {
  const { dataAddresses, dataTextRecords, recordsLoading, refetchDataAddress } =
    useGetRecords(selectedDomain)

  const [updatedRecords, setUpdatedRecords] = useState([])
  const [initialRecords, setInitialRecords] = useState([])
  const [tooltipMessage, setTooltipMessage] = useState('Copy to clipboard')
  const [bnbAddress, setBNBAddress] = useState('')
  const [txState, setTxHash] = useTransaction()
  const [updateLoading, setUpdateloading] = useState(false)
  const [mutationResolver] = useMutation(SET_RESOLVER)

  useUpdatedRecords(recordsLoading, initialRecords, setUpdatedRecords)

  useInitRecords(
    selectedDomain,
    dataAddresses,
    dataTextRecords,
    setInitialRecords
  )

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  useEffect(() => {
    if (updatedRecords.length > 0) {
      setBNBAddress(getCoins(updatedRecords)[0]?.value)
    }
  }, [updatedRecords])

  useEffect(() => {
    if (txState.confirmed) {
      // setUpdateloading(false)
      setResolverAddress(process.env.REACT_APP_RESOLVER_ADDRESS)
    }
    if (txState.error) {
      setUpdateloading(false)
    }
  }, [txState])
  useEffect(() => {
    if (updateLoading && !isEmptyAddress(resolverAddress)) {
      setUpdateloading(false)
      if (isEmptyAddress(bnbAddress)) {
        handleEdit(true)
      }
    }
  }, [resolverAddress, bnbAddress, updateLoading])

  const handleResolverAddressCopy = (e) => {
    e.preventDefault()
    copyTextToClipboard(resolverAddress)
      .then(() => {
        setTooltipMessage('Copied')
        setTimeout(() => {
          setTooltipMessage('Copy to clipboard')
        }, 2000)
      })
      .catch((err) => {
        alert('err')
      })
  }

  const handleBNBAddressCopy = (e) => {
    e.preventDefault()
    copyTextToClipboard(getCoins(updatedRecords)[0]?.value)
      .then(() => {
        setTooltipMessage('Copied')
        setTimeout(() => {
          setTooltipMessage('Copy to clipboard')
        }, 2000)
      })
      .catch((err) => {
        alert('err')
      })
  }

  const handleEdit = (defaultValue = false) => {
    const params = { ...getCoins(updatedRecords)[0] }
    if (defaultValue === true) {
      params.value = registrantAddress
    } else {
      params.value = ''
    }
    showAddressChangeModalHandle(params)
  }

  const handleUpdate = async () => {
    const variables = {
      name: selectedDomain.name + '.bnb',
      address: process.env.REACT_APP_RESOLVER_ADDRESS,
    }
    try {
      setUpdateloading(true)
      const { data } = await mutationResolver({ variables })
      setTxHash(data?.setResolver)
    } catch (e) {
      setUpdateloading(false)
      console.error(e)
    }
  }

  return (
    <div className={cn(className)}>
      <div className="rounded-[24px]">
        {loadingResolverAddress ||
        !resolverAddress ||
        !isEmptyAddress(resolverAddress) ? (
          <>
            <p className="text-gray-600 font-bold text-[18px] xl:text-xl text-center md:text-left px-3">
              Records
            </p>
            <div className="bg-[rgba(67,140,136,0.25)] rounded-[24px] block md:flex items-center justify-between py-5 px-6 mt-5">
              {recordsLoading || pendingBNBAddress ? (
                <PendingTx
                  txHash={txHash}
                  onConfirmed={async () => {
                    refetchDataAddress()
                    setConfirmed()
                  }}
                  className="mt-1"
                >
                  {txHash ? undefined : ''}
                </PendingTx>
              ) : (
                <div>
                  <p className="text-gray-600 font-bold text-[18px] xl:text-xl text-center md:text-left">
                    BNB Address
                  </p>
                  <div className="flex items-center text-gray-600 text-[14px] xl:text-[18px] mt-1 break-all justify-center md:justify-start">
                    <p className="mr-2 text-center">
                      {`${bnbAddress.substring(0, 10)}...${bnbAddress.substring(
                        bnbAddress.length - 11
                      )}`}
                    </p>
                    <span
                      className="cursor-pointer"
                      onClick={handleBNBAddressCopy}
                    >
                      <Tooltip
                        title={tooltipMessage}
                        color="#508292"
                        contentClass="text-white text-xs font-semibold"
                      >
                        <CopyIcon />
                      </Tooltip>
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center mt-2">
                <button
                  disabled={pendingBNBAddress || !isRegsitrant}
                  className={cn(
                    'py-2 px-10 rounded-full md:ml-4 font-semibold',
                    pendingBNBAddress || !isRegsitrant
                      ? 'bg-gray-800 text-gray-700'
                      : 'bg-blue-100 text-white'
                  )}
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </div>
            </div>
            {!recordsLoading &&
              !updatingBNBAddress &&
              isEmptyAddress(bnbAddress) && (
                <p className="mt-2 text-lg text-red-100">
                  *You have not set your BNB Address.
                </p>
              )}
          </>
        ) : (
          <div className="mt-1 px-3 py-6 flex justify-between">
            <div>
              <p className="text-red-100 font-bold text-xl">Resolver error</p>
              <p className="text-gray-600 text-lg mt-1">
                There is an error occured in your resolver. Please update your
                resolver to solve the issue.
              </p>
            </div>
            <button
              disabled={updateLoading || pendingBNBAddress || !isRegsitrant}
              className={cn(
                'px-5 min-w-[108px] h-[40px] rounded-[20px] font-semibold text-base',
                updateLoading || pendingBNBAddress || !isRegsitrant
                  ? 'bg-gray-800 text-gray-700'
                  : 'bg-red-200 text-white'
              )}
              onClick={handleUpdate}
            >
              <div className="flex items-center justify-center">
                <p>Update</p>
                {updateLoading && (
                  <AnimationSpin className="ml-2" loadingColor="white" />
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
