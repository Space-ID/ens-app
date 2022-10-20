import React from 'react'
import badge1 from '../../assets/images/referral/referral-badge1.svg'
import badge2 from '../../assets/images/referral/referral-badge2.svg'
import badge3 from '../../assets/images/referral/referral-badge3.svg'

export default function LevelBadge({ level }) {
  return (
    <>
      {level > 1 && (
        <>
          <div
            className="s-divider s-divider-h my-2"
            style={{ width: '100px' }}
          ></div>
          <div className="flex">
            {level >= 2 && <img src={badge1} alt="" width={48} height={54} />}
            {level >= 3 && <img src={badge2} alt="" width={48} height={54} />}
            {level >= 4 && <img src={badge3} alt="" width={48} height={54} />}
          </div>
        </>
      )}
    </>
  )
}
