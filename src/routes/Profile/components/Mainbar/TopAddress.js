import React, { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import { utils as ethersUtils } from 'ethers/lib/ethers'
import { useDispatch, useSelector } from 'react-redux'

import { fetchDomainMetaData, fetchSkins } from 'api'

//Import Components
import CopyIcon from 'components/Icons/CopyIcon'

//Import Assets
import AnimationSpin from 'components/AnimationSpin'
import PendingTx from 'components/PendingTx'

import FailedImage from 'assets/images/image-failed.png'

import { refetchTilUpdatedSingle } from 'utils/graphql'

import {
  copyTextToClipboard,
  getDomainNftUrl,
  getSkinIdFromUrl,
} from 'utils/utils'
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
import { setPrimaryDomain } from 'app/slices/domainSlice'
import { ReferralLevelTitle } from 'routes/Referral/constants'
import { useAccount } from 'components/QueryAccount'
import CirclePlus from 'components/Icons/CircleUser'
import Diamond from 'components/Icons/Diamond'
import CircleStar from 'components/Icons/CircleStar'
import Heart from 'components/Icons/Heart'
import EditIcon from 'components/Icons/EditIcon'
import SkinManageModal from './SkinManageModal'
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
  const [skinModal, setSkinModal] = useState(false)
  const [skinList, setSkinList] = useState([])
  const [currentSkinId, setCurrentSkinId] = useState(undefined)
  const [currentSkinName, setCurentSkinName] = useState('Default')
  const primaryDomain = useSelector((state) => state.domain.primaryDomain)
  const selectDomainName = useRef()
  const account = useAccount()
  const dispatch = useDispatch()

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

  const handleImageChange = (v) => {
    setCurentSkinName(v.label)
    setCurrentSkinId(v.value)
    const url = getDomainNftUrl(selectedDomain?.name, v.value)
    setImageURL(url)
    if (selectedDomain?.name === primaryDomain?.name) {
      dispatch(setPrimaryDomain({ ...primaryDomain }))
    }
  }

  useEffect(() => {
    if (selectedDomain.name) {
      setSkinList([])
      setImageURL('')
      const domain = selectedDomain.name
      selectDomainName.current = domain
      fetchSkins(domain + '.bnb').then((res) => {
        if (domain === selectDomainName.current) {
          setSkinList(res ?? [])
        }
      })
      fetchDomainMetaData(selectedDomain.name).then((res) => {
        if (domain === selectDomainName.current) {
          const url = res?.image
          setImageURL(url)
          const id = getSkinIdFromUrl(url)
          setCurrentSkinId(id)
        }
      })
      fetchReferralDetails({ variables: { domain } })
    }
  }, [selectedDomain])
  useEffect(() => {
    if (currentSkinId === undefined && skinList.length <= 0) {
      setCurentSkinName('Default')
    } else if (currentSkinId === undefined && skinList.length > 0) {
      const temp = skinList.find((v) => v.name === 'Default')
      setCurentSkinName(temp?.name ?? 'Default')
      setCurrentSkinId(temp?.id)
    } else {
      setCurentSkinName(skinList.find((v) => v.id === currentSkinId)?.name)
    }
  }, [currentSkinId, skinList])

  useEffect(() => {
    if (getReferralDetails.length <= 0) {
      return
    }
    if (isPartner) {
      const [referralNum] = getReferralDetails
      setReferralNum(referralNum?.toNumber() ?? 0)
      setReferralLevel('p')
    } else {
      const [referralNum, level] = getReferralDetails
      setReferralNum(referralNum.toNumber())
      setReferralLevel(Math.min(level.toNumber(), 4))
    }
  }, [getReferralDetails, isPartner])

  const nftErrorLoading = () => {
    if (imageURL) {
      setImageURL(FailedImage)
    }
  }

  const handleCopyRegistrantAddress = (e) => {
    e.preventDefault()
    copyTextToClipboard(registrantAddress)
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
  return (
    <div className="flex xl:flex-row xl:items-stretch flex-col items-center w-full xl:space-x-7 pb-8 border-b border-fill-3">
      <div className="md:w-[320px] w-[310px] flex-shrink-0">
        <div className="relative md:max-w-[320px] max-w-[310px] md:h-[320px] h-[310px] bg-fill-2 rounded-[20px] drop-shadow-[0px_0px_55px_rgba(80,255,192,0.6)] overflow-hidden">
          <img src={imageURL} onError={nftErrorLoading} />
          <AnimationSpin
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
            size={48}
          />
        </div>
        <div className="relative mt-3">
          <p className="text-center text-white text-lg font-semibold px-7 truncate">
            <span className="text-primary">Skin: </span>
            <span className="capitalize">{currentSkinName}</span>
          </p>
          {!pending && isRegsitrant && (
            <button
              className="btn btn-icon absolute right-0 top-0 text-white"
              disabled={skinList.length <= 1}
              onClick={() => setSkinModal(true)}
            >
              <EditIcon />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between xl:h-auto 2md:h-[320px] h-auto 2md:w-full 2md:mt-0 mt-4 mb-[38px]">
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
                {isPartner ? 'VIP' : ReferralLevelTitle[referralLevel]}
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
      <SkinManageModal
        selectedDomain={selectedDomain}
        curImg={imageURL}
        skinList={skinList}
        open={skinModal}
        onOpenChange={setSkinModal}
        currentId={currentSkinId}
        onImageChange={handleImageChange}
      />
    </div>
  )
}
