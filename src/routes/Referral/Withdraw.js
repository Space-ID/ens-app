import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useMutation, useQuery } from '@apollo/client'
import EthVal from 'ethval'
import Info from 'components/Icons/Info'
import Tooltip from '../../components/Tooltip'
import { QUERY_REFERRAL_BALANCE } from '../../graphql/queries'
import { REFERRAL_WITHDRAW } from '../../graphql/mutations'
import { useAccount } from '../../components/QueryAccount'

export default function Withdraw() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const account = useAccount()

  const [handleWithDraw] = useMutation(REFERRAL_WITHDRAW, {
    onError() {
      setLoading(false)
    },
    onCompleted(res) {
      setLoading(false)
      setBalance((0).toFixed(3))
    },
  })

  const { data: { getReferralBalance } = {} } = useQuery(
    QUERY_REFERRAL_BALANCE,
    { variables: { account }, fetchPolicy: 'network-only' }
  )

  const onWithDraw = () => {
    setLoading(true)
    handleWithDraw()
  }

  useEffect(() => {
    const ethVal = new EthVal(`${getReferralBalance || 0}`).toEth()
    setBalance(ethVal.toNumber().toFixed(3))
  }, [getReferralBalance])

  return (
    <div className="flex items-center justify-between sm:flex-row flex-col sm:pl-8 sm:pr-6 px-4 py-4 sm:space-y-0 space-y-3 rounded-3xl bg-boxBg">
      <div className="flex items-center sm:flex-row flex-col sm:space-x-8 space-x-0 sm:space-y-0 space-y-3">
        <div className="flex items-center space-x-2 text-xl">
          <span>Commision</span>
          <Tooltip
            color="#2980E8"
            side="bottom"
            contentClass="rounded-xl p-2"
            offset={5}
            title={
              <p className="text-sm text-white w-[275px] text-center">
                All cumulated earnings from registrations using your primary
                domain name’s referral link will be shown here.
              </p>
            }
          >
            <Info />
          </Tooltip>
        </div>
        <p className="text-4xl font-bold">{balance} BNB</p>
      </div>
      <button
        className={cn(
          'btn btn-primary text-base font-bold rounded-full px-6 py-2',
          loading ? 'loading' : ''
        )}
        disabled={balance <= 0}
        onClick={onWithDraw}
      >
        Withdraw
      </button>
    </div>
  )
}
