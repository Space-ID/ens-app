import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import moment from 'moment'
import keccak256 from 'keccak256'
import Web3 from 'web3'

//Import Components
import CopyIcon from 'components/Icons/CopyIcon'

//Import Assets
import AnimationSpin from 'components/AnimationSpin'
import PendingTx from 'components/PendingTx'

import FailedImage from 'assets/images/image-failed.png'

//Import GraphQL
import { refetchTilUpdatedSingle } from 'utils/graphql'
import { Tooltip } from '../../../../components/Tooltip/Tooltip'

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
  refetchExp,
  fetchExp,
  expDate,
}) {
  const [tooltipMessage, setTooltipMessage] = useState('Copy to clipboard')
  const [imageURL, setImageURL] = useState('')

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
      let label = keccak256(Buffer.from(domain)).toString('hex')
      let nftId = Web3.utils.toBN(label).toString()
      const url = `https://meta.image.space.id/image/${
        process.env.REACT_APP_MODE === 'production' ? 'mainnet' : 'stg'
      }/${nftId}.svg`
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
    <div className={cn('md:flex w-full md:space-x-7', className)}>
      <div className="relative bg-cover md:mr-7 w-[320px] h-[320px] drop-shadow-[0px_0px_55px_rgba(80,255,192,0.6)] flex-none">
        <img
          className="rounded-[20px]"
          src={imageURL}
          onError={nftErrorLoading}
        />
      </div>
      <div className="ml-0 pt-6 md:space-y-[120px] md:w-full">
        <div className="justify-between md:flex">
          <div>
            <p className="text-center md:text-left font-bold text-[18px] xl:text-[24px] text-[#1EEFA4]">
              Registrant
            </p>
            {loadingRegistration ? (
              <AnimationSpin />
            ) : (
              <div className="flex items-center justify-center md:justify-start">
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
                  <div className="flex text-[14px] xl:text-[18px] text-white font-semibold items-center mt-2 break-all md:break-normal">
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
                      <Tooltip message={tooltipMessage} delay={1000}>
                        <CopyIcon />
                      </Tooltip>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!pending && !loadingRegistration && (
            <div className="flex items-center justify-center md:justify-start">
              <button
                disabled={pending || !isRegsitrant}
                className={cn(
                  'py-2 px-6 rounded-full md:mr-4 font-semibold',
                  pending || !isRegsitrant
                    ? 'bg-[#7E9195] text-white'
                    : 'bg-[#30DB9E] text-[#134757]'
                )}
                onClick={transferRegistrantAddress}
              >
                Transfer
              </button>
            </div>
          )}
        </div>
        <div className="items-center justify-between mt-8 md:flex md:mt-0">
          <div>
            <p className="font-bold text-[18px] xl:text-[20px] text-[#1EEFA4] text-center md:text-left">
              Expiry Date
            </p>
            {pendingExp ? (
              <PendingTx
                txHash={txHash}
                onConfirmed={async () => {
                  refetchTilUpdatedSingle({
                    refetch: refetchExp,
                    interval: 300,
                    keyToCompare: 'expires',
                    prevData: expDate,
                  })
                  await fetchExp()
                  setConfirmed()
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex text-[14px] xl:text-[18px] text-white font-semibold items-center mt-2">
                {/* <p>2023.04.22 at 08:00 (UTC+8:00)</p> */}
                <p className="w-full text-center md:text-left">
                  {moment(selectedDomain?.expires_at).format('YYYY.MM.DD')}
                  <span className="mx-1">at</span>
                  {moment(selectedDomain?.expires_at).format('hh:mm')}
                  <span className="ml-1">(UTC)</span>
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center mt-4 md:justify-start md:mt-0">
            <button
              disabled={pendingExp || loadingRegistration || !isRegsitrant}
              className={cn(
                'py-2 px-[28px] rounded-full md:mr-4 font-semibold',
                pendingExp || loadingRegistration || !isRegsitrant
                  ? 'bg-[#7E9195] text-white'
                  : 'bg-[#30DB9E] text-[#134757]'
              )}
              onClick={extendHandler}
            >
              Extend
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
