import React, { useEffect, useRef, useState } from 'react'
import { Title } from '@radix-ui/react-dialog'
import Qrious from 'qrious'
import { TwitterShareButton } from 'react-share'
import ReferralLink from './ReferralLink'
import { TwitterIcon } from '../../components/Icons'
import DownloadIcon from '../../components/Icons/DownloadIcon'
import Modal from '../../components/Modal'

function ReferralQrModal(props) {
  const { open, inviteUrl, onOpenChange, children, ...otherProps } = props
  const [canvas, setCanvas] = useState()
  const qrRef = useRef()
  useEffect(() => {
    if (open && inviteUrl) {
      qrRef.current = new Qrious({
        element: canvas,
        value: inviteUrl,
      })
    }
  }, [open, canvas, inviteUrl])
  const downloadQrCode = () => {
    const a = document.createElement('a')
    a.href = qrRef.current.toDataURL()
    a.download = 'Referral Invitation.png'
    a.click()
  }
  return (
    <Modal width="auto" open={open} onOpenChange={onOpenChange} {...otherProps}>
      <>
        <Title className="text-center text-3xl font-bold mb-8 mt-3">
          Referral Invitation
        </Title>
        <div className="space-y-5">
          <div className="referral-qrcode h-[444px] w-[444px]">
            {/*<div className='referral-qrcode-border'></div>*/}
            {/*<div className='referral-qrcode-bg'></div>*/}
            <canvas
              className="w-full h-full rounded-3xl absolute p-[2px]"
              ref={setCanvas}
            ></canvas>
          </div>
          <ReferralLink inviteUrl={inviteUrl} />
          <div className="grid gap-x-4 grid-cols-2 justify-between text-base font-semibold">
            <button
              className="btn btn-primary px-5 py-3 rounded-full"
              onClick={downloadQrCode}
              disabled={!qrRef.current}
            >
              <DownloadIcon className="mr-1" />
              Downlaod Image
            </button>
            <TwitterShareButton
              className="btn btn-secondary px-5 py-3 rounded-full btn-twitter"
              title="space id"
              url={inviteUrl}
            >
              <TwitterIcon className="text-white mr-1" />
              Share on Twitter
            </TwitterShareButton>
          </div>
        </div>
      </>
    </Modal>
  )
}

export default ReferralQrModal
