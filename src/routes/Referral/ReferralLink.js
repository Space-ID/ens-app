import React, { useEffect, useRef, useState } from 'react'
import { copyTextToClipboard } from '../../utils/utils'
import CopyIcon from '../../components/Icons/CopyIcon'
import Tooltip from '../../components/Tooltip'

function ReferralLink({ inviteUrl }) {
  const [message, setMessage] = useState('Copy to clipboard')
  const timer = useRef()
  const handleClick = () => {
    copyTextToClipboard(inviteUrl)
    setMessage('Copied !')
  }
  useEffect(() => {
    timer.current = window.setTimeout(() => {
      setMessage('Copy to clipboard')
    }, 2000)
    return () => {
      window.clearTimeout(timer.current)
    }
  }, [message])
  return (
    <div className="flex items-center justify-between text-green-600 w-full flex-1 bg-fill-2 px-4 py-2 rounded-full border-[1px] border-primary overflow-hidden">
      <span className="text-base text-white truncate">{inviteUrl}</span>
      <Tooltip
        title={<div>{message}</div>}
        color="#508292"
        contentClass="text-white text-xs font-semibold"
      >
        <div className="flex items-center ml-2" onClick={handleClick}>
          <CopyIcon />
          <span className="ml-2.5">Copy</span>
        </div>
      </Tooltip>
    </div>
  )
}

export default ReferralLink
