import React from 'react'

export default function ReferralStatDes() {
  return (
    <div className="text-sm text-white px-1">
      <p className="font-semibold">Referral Level</p>
      <ul className="">
        <li>
          <span className="mx-2">•</span>Set Primary Name to get{' '}
          <span className="font-semibold">Regular</span> (5% earning)
        </li>
        <li>
          <span className="mx-2">•</span>50 invitees to get{' '}
          <span className="font-semibold">Premium I</span> (8% earning)
        </li>
        <li>
          <span className="mx-2">•</span>300 invitees to get{' '}
          <span className="font-semibold">Premium II</span> (12% earning)
        </li>
        <li>
          <span className="mx-2">•</span>1000 invitees to get{' '}
          <span className="font-semibold">Premium III</span> (15% earning)
        </li>
      </ul>
    </div>
  )
}
