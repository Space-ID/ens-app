import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { utils as ethersUtils } from 'ethers/lib/ethers'

//Import Components
import CopyIcon from 'components/Icons/CopyIcon'

//Import Assets
import AnimationSpin from 'components/AnimationSpin'
import PendingTx from 'components/PendingTx'

import FailedImage from 'assets/images/image-failed.png'

import { refetchTilUpdatedSingle } from 'utils/graphql'

import { getDomainNftUrl, copyTextToClipboard } from 'utils/utils'
import {
  getLocalTime,
  gracePeriodEndStr,
  isExpired,
  isExpiresLessThanOneMonth,
} from 'utils/dates'
import Tooltip from 'components/Tooltip/index'
import { useLazyQuery, useQuery } from '@apollo/client'
import {
  QUERY_IS_PARTNER,
  QUERY_POINT_BALANCE,
  QUERY_REFERRAL_DETAILS,
} from 'graphql/queries'
import { ReferralLevelTitle } from 'routes/Referral/constants'
import { useAccount } from 'components/QueryAccount'
import CirclePlus from 'components/Icons/CircleUser'
import Diamond from 'components/Icons/Diamond'
import CircleStar from 'components/Icons/CircleStar'
import Heart from 'components/Icons/Heart'
import './TopAddress.css'

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
  const [referralNum, setReferralNum] = useState(0)
  const [referralLevel, setReferralLevel] = useState(0)
  const account = useAccount()
  const [queryPointBalance, { data: { getPointBalance = 0 } = {} }] =
    useLazyQuery(QUERY_POINT_BALANCE, {
      variables: { account },
      skip: !ethersUtils.isAddress(account),
      fetchPolicy: 'network-only',
    })
  const [fetchReferralDetails, { data: { getReferralDetails = [] } = {} }] =
    useLazyQuery(QUERY_REFERRAL_DETAILS, { fetchPolicy: 'network-only' })
  const { data: { isPartner = false } = {} } = useQuery(QUERY_IS_PARTNER, {
    variables: { domain: selectedDomain?.name },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    if (selectedDomain.name) {
      const domain = selectedDomain.name
      const url = getDomainNftUrl(domain)
      setImageURL(url)
      fetchReferralDetails({ variables: { domain: selectedDomain.name } })
    }
  }, [selectedDomain])

  useEffect(() => {
    if (isPartner) {
      setReferralLevel('p')
    } else if (getReferralDetails.length <= 0) {
    } else {
      const [referralNum, level] = getReferralDetails
      setReferralNum(referralNum.toNumber())
      setReferralLevel(Math.min(level.toNumber(), 4))
    }
  }, [getReferralDetails, isPartner])

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
        <div className="flex flex-col 2md:items-stretch items-center">
          <p className="text-center 2md:text-left font-bold text-2xl font-semibold text-green-100 mt-8 2md:mt-0">
            Referral Stat
          </p>
          <div className="mt-2 flex">
            <div
              className={cn(
                'flex items-center space-x-2 px-3 py-[6px] text-xl font-bold bg-fill-3 border-2 rounded-xl mr-2',
                'referral-state' + referralLevel
              )}
            >
              {isPartner ? (
                <Heart />
              ) : referralLevel > 1 ? (
                <div className="flex space-x-1">
                  <Diamond />
                  {referralLevel > 2 && <Diamond />}
                  {referralLevel > 3 && <Diamond />}
                </div>
              ) : (
                <CircleStar />
              )}
              <span>
                {isPartner ? 'Partner' : ReferralLevelTitle[referralLevel]}
              </span>
            </div>
            <div
              className={cn(
                'flex items-center space-x-2 px-3 py-[6px] text-xl font-bold bg-fill-3 border-2 rounded-xl',
                'referral-state' + referralLevel
              )}
            >
              <CirclePlus />
              <span>{referralNum}</span>
            </div>
          </div>
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
