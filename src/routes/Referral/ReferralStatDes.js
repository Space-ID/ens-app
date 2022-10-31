import React, { useEffect } from 'react'
import { ReferralLevelTitle } from './constants'
// todo: partner
export default function ReferralStatDes({ levelDetails }) {
  return (
    <div className="text-sm text-white px-1">
      <p className="font-semibold">Referral Level</p>
      <ul className="">
        <li>
          <span className="mx-2">•</span>Set Primary Name to get{' '}
          <span className="font-semibold">{ReferralLevelTitle[1]}</span> (
          <span>{levelDetails[1].rate}</span> earning)
        </li>
        <li>
          <span className="mx-2">•</span>
          {levelDetails[2].limit} invitees to get{' '}
          <span className="font-semibold">{ReferralLevelTitle[2]}</span> (
          <span>{levelDetails[2].rate}</span> earning)
        </li>
        <li>
          <span className="mx-2">•</span>
          {levelDetails[3].limit} invitees to get{' '}
          <span className="font-semibold">{ReferralLevelTitle[3]}</span> (
          <span>{levelDetails[3].rate}</span> earning)
        </li>
        <li>
          <span className="mx-2">•</span>
          {levelDetails[4].limit} invitees to get{' '}
          <span className="font-semibold">{ReferralLevelTitle[4]}</span> (
          <span>{levelDetails[4].rate}</span> earning)
        </li>
      </ul>
    </div>
  )
}
