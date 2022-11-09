import React from 'react'

function ReferralAddress({ address = '', ...other }) {
  return (
    <div {...other}>{`${address.slice(0, 6)}...${address.slice(
      address.length - 6
    )}`}</div>
  )
}

export default ReferralAddress
