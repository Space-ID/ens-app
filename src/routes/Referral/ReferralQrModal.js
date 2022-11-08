import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Title } from '@radix-ui/react-dialog'
import Qrious from 'qrious'
import { toPng } from 'html-to-image'
import { isMobile } from 'utils/utils'
import ReferralLink from './ReferralLink'
import DownloadIcon from '../../components/Icons/DownloadIcon'
import Modal from '../../components/Modal'
const mobile = isMobile()
function ReferralQrModal(props) {
  const {
    open,
    inviteUrl,
    domain,
    referralOpt,
    onOpenChange,
    children,
    ...otherProps
  } = props
  const [canvas, setCanvas] = useState()
  const [qrCode, setQrCode] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const qrRef = useRef()
  useEffect(() => {
    if (open && inviteUrl) {
      qrRef.current = new Qrious({
        background: 'transparent',
        foreground: '#1EEFA4',
        size: 112,
        // padding:1,
        element: canvas,
        value: inviteUrl,
      })
      setQrCode(qrRef.current.toDataURL())
    }
  }, [open, canvas, inviteUrl])
  const downloadQrCode = () => {
    setLoading(true)
    const node = document.getElementById('invite-img')
    toPng(node, {
      canvasWidth: 444,
      canvasHeight: 444,
      pixelRatio: 1,
      backgroundColor: 'rgba(0,0,0,0)',
    })
      .then((res) => {
        const a = document.createElement('a')
        a.href = res
        a.download = 'Referral Invitation.png'
        a.click()
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <Modal width="auto" open={open} onOpenChange={onOpenChange} {...otherProps}>
      <>
        <Title className="text-center text-3xl font-bold mb-8 mt-3">
          Referral Invitation
        </Title>
        <canvas
          className="absolute hidden w-[110px] h-[110px]"
          ref={setCanvas}
        ></canvas>
        <div className="space-y-5 sm:w-[444px] w-[310px] pb-3">
          <div
            id="invite-img"
            className={cn(
              'referral-qrcode sm:h-[444px] h-[310px] w-full font-semibold',
              `referral-qr-${referralOpt.key}`
            )}
          >
            <div className="referral-qrcode-border"></div>
            <div className="referral-qrcode-bg"></div>
            <div className="absolute top-4 left-5 right-5">
              <div className="absolute top-0 right-0 flex flex-col space-y-[6px]">
                {referralOpt.icons.map((v) => (
                  <img src={v} alt="" width={16} height={16} />
                ))}
              </div>
              <p className="text-6xl sm:text-[48px] font-bold referral-qr-domain truncate mr-5">
                {domain}
              </p>
              <p className="sm:text-2xl text-lg">
                inivite you to get a <span className="text-primary">.bnb</span>{' '}
                Domain!
              </p>
              <img
                className="absolute sm:right-[70px] right-[42px] sm:top-[180px] top-[116px] sm:w-[110px] w-[80px]"
                src={qrCode}
                alt=""
              />
            </div>
            <p className="sm:text-sm text-[10px] leading-[16px] text-green-600 sm:w-[196px] w-[140px] absolute bottom-4 left-5 font-normal">
              Incubated by <span className="font-semibold">Binance Labs</span>,{' '}
              <span className="text-primary font-semibold">.bnb</span> Domain
              Name Service by <span className="font-semibold">SPACE ID</span>{' '}
              provides the standard BNB Chain identifier.
            </p>
          </div>
          <ReferralLink inviteUrl={inviteUrl} />
          <button
            className={cn(
              'btn btn-primary px-5 py-3 rounded-full w-full text-base font-semibold',
              loading ? 'loading' : ''
            )}
            onClick={downloadQrCode}
            disabled={!qrRef.current || !qrCode}
          >
            <DownloadIcon className="mr-1" />
            Downlaod Image
          </button>
          {mobile && (
            <p className="text-green-600 sm:text-base text-xs font-semibold text-center">
              Open this page in your browser to download the poster
            </p>
          )}
        </div>
      </>
    </Modal>
  )
}

export default ReferralQrModal
