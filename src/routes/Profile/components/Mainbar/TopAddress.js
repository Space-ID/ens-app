import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import moment from 'moment'

//Import Components
import CopyIcon from 'components/Icons/CopyIcon'

//Import Assets
import AnimationSpin from 'components/AnimationSpin'
import PendingTx from 'components/PendingTx'

import FailedImage from 'assets/images/image-failed.png'

//Import GraphQL
import { refetchTilUpdatedSingle } from 'utils/graphql'

import { getDomainNftUrl } from 'utils/utils'
import {
  getLocalTime,
  gracePeriodEndStr,
  isExpired,
  isExpiresLessThanOneMonth,
} from 'utils/dates'
import Tooltip from 'components/Tooltip/index'
import { useLazyQuery } from '@apollo/client'
import { QUERY_POINT_BALANCE } from '../../../../graphql/queries'
import { utils as ethersUtils } from 'ethers/lib/ethers'
import { useAccount } from '../../../../components/QueryAccount'

export default function TopAddress({
  className,
  selectedDomain,
  registrantAddress,
  loadingRegistration,
  transferRegistrantAddress,
  pending,
  setConfirmed,
  refetchAddress,
  fetchAddress,
  address,
  txHash,
  extendHandler,
  isRegsitrant,
  pendingExp,
}) {
  const [tooltipMessage, setTooltipMessage] = useState('Copy to clipboard')
  const [imageURL, setImageURL] = useState('')
  const account = useAccount()
  const [queryPointBalance, { data: { getPointBalance = 0 } = {} }] =
    useLazyQuery(QUERY_POINT_BALANCE, {
      variables: { account },
      skip: !ethersUtils.isAddress(account),
      fetchPolicy: 'network-only',
    })

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  useEffect(() => {
    if (selectedDomain.name) {
      const domain = selectedDomain.name
      const url = getDomainNftUrl(domain)
      setImageURL(url)
    }
  }, [selectedDomain])

  const nftErrorLoading = () => {
    setImageURL(FailedImage)
  }

  const handleCopyRegistrantAddress = (e) => {
    e.preventDefault()
    copyTextToClipboard(registrantAddress)
      .then(() => {
        // alert('copied')
        setTooltipMessage('Copied')
        setTimeout(() => {
          setTooltipMessage('Copy to clipboard')
        }, 2000)
      })
      .catch((err) => {
        alert('err')
      })
  }
  return (
    <div className="flex 2md:flex-row 2md:items-stretch flex-col items-center w-full 2md:space-x-7 pb-8 border-b border-fill-3">
      <img
        className="rounded-[20px] drop-shadow-[0px_0px_55px_rgba(80,255,192,0.6)] max-w-[320px] w-full"
        src={imageURL}
        onError={nftErrorLoading}
      />
      <div className="flex flex-col justify-between 2md:w-full 2md:mt-0 mt-4">
        <div className="justify-between 2md:flex">
          <div>
            <p className="text-center 2md:text-left font-bold text-2xl font-semibold text-green-100">
              Registrant
            </p>
            {loadingRegistration ? (
              <AnimationSpin />
            ) : (
              <div className="flex items-center justify-center 2md:justify-start">
                {pending ? (
                  <PendingTx
                    txHash={txHash}
                    onConfirmed={async () => {
                      refetchTilUpdatedSingle({
                        refetch: refetchAddress,
                        interval: 300,
                        keyToCompare: 'registrant',
                        prevData: address,
                      })
                      await fetchAddress()
                      setConfirmed()
                    }}
                    className="mt-1"
                  />
                ) : (
                  <div className="flex text-lg text-white font-semibold items-center mt-2 break-all md:break-normal">
                    <p className="text-center">
                      {registrantAddress
                        ? `${registrantAddress.substring(
                            0,
                            10
                          )}...${registrantAddress.substring(
                            registrantAddress.length - 11
                          )}`
                        : ''}
                    </p>
                    <div className="ml-2" onClick={handleCopyRegistrantAddress}>
                      <Tooltip
                        title={tooltipMessage}
                        color="#508292"
                        contentClass="text-white text-xs font-semibold"
                      >
                        <CopyIcon />
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!pending && !loadingRegistration && (
            <div className="flex items-center justify-center 2md:justify-start mt-4 2md:mt-0">
              <button
                disabled={pending || !isRegsitrant}
                className="btn-primary py-2 px-6 rounded-full 2md:mr-4 font-semibold"
                onClick={transferRegistrantAddress}
              >
                Transfer
              </button>
            </div>
          )}
        </div>
        <div>
          <div className="items-center justify-between mt-8 2md:flex 2md:mt-0">
            <div>
              <p className="font-bold text-2xl font-semibold text-green-100 text-center 2md:text-left">
                Expiry Date
              </p>
              {pendingExp ? (
                <PendingTx
                  txHash={txHash}
                  onConfirmed={async () => {
                    queryPointBalance()
                    setConfirmed()
                  }}
                  className="mt-1"
                />
              ) : (
                <div className="flex text-lg text-white font-semibold items-center mt-2">
                  {/* <p>2023.04.22 at 08:00 (UTC+8:00)</p> */}
                  <p
                    className={cn(
                      'w-full text-center 2md:text-left',
                      isExpiresLessThanOneMonth(selectedDomain?.expires)
                        ? 'text-red-100'
                        : ''
                    )}
                  >
                    {getLocalTime(selectedDomain?.expires).format('YYYY.MM.DD')}
                    <span className="mx-1">at</span>
                    {getLocalTime(selectedDomain?.expires).format(
                      'HH:mm (UTCZ)'
                    )}
                  </p>
                </div>
              )}
              {isExpired(selectedDomain?.expires) && (
                <p className="bg-red-100 py-1 px-2.5 text-white text-base rounded-xl mt-2 2md:hidden text-center font-semibold">
                  {`Expired. Grace period ends ${gracePeriodEndStr(
                    selectedDomain?.expires
                  )}`}
                </p>
              )}
            </div>
            <div className="flex items-center justify-center mt-4 2md:justify-start 2md:mt-0">
              <button
                disabled={pendingExp || loadingRegistration || !isRegsitrant}
                className="btn-primary py-2 px-[28px] rounded-full 2md:mr-4 font-semibold"
                onClick={extendHandler}
              >
                Extend
              </button>
            </div>
          </div>
          {isExpired(selectedDomain?.expires) && (
            <p className="bg-red-100 py-1 px-2.5 text-white text-base rounded-xl mt-2 2md:mr-4 2md:block hidden font-semibold">
              {`Expired. Grace period ends ${gracePeriodEndStr(
                selectedDomain?.expires
              )}`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
