import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import cn from 'classnames'
import { useScroll } from 'ahooks'
import Modal from 'components/Modal'
import { useAccount } from 'components/QueryAccount'
import AnimationSpin from 'components/AnimationSpin'
import { fetchReferralHistory } from '../../api'
import { isEmptyAddress } from '../../utils/records'

const bscscanUrl =
  process.env.REACT_APP_MODE === 'stg'
    ? 'https://testnet.bscscan.com/tx/'
    : 'https://bscscan.com/tx/'

const WithdrawListItem = ({ data }) => {
  return (
    <li className="flex items-center justify-between px-4 mb-4 text-green-600 text-xs font-semibold">
      <div>
        <p>{data.moneyType === 1 ? 'Commission' : 'Withdrawal'}</p>
        <p
          className={cn(
            'text-lg',
            data.moneyType === 1
              ? 'referral-commission-amount'
              : 'referral-withdraw-amount'
          )}
        >
          {(data.amount / 10 ** 18).toFixed(3)} BNB
        </p>
        <p>{moment.unix(data.createdAt).format('YYYY-DD-MM HH:mm:ss')}</p>
      </div>
      <a
        href={`${bscscanUrl}${data.txHash}`}
        target="_blank"
        className="text-sm text-green-600"
      >
        Txid ↗
      </a>
    </li>
  )
}

function WithdrawListModal({ open, ...other }) {
  const [total, setTotal] = useState((0).toFixed(3))
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const lastId = useRef(0)
  const hasMore = useRef(false)
  const listRef = useRef()
  const account = useAccount()
  const scroll = useScroll(listRef)
  useEffect(() => {
    if (account && !isEmptyAddress(account) && open) {
      setList([])
      setLoading(true)
      fetchReferralHistory(account)
        .then((res) => {
          if (Array.isArray(res?.records)) {
            const data = res?.records
            setList(data)
            setTotal(((res?.totalEarnings ?? 0) / 10 ** 18).toFixed(3))
            lastId.current = data.length > 0 ? data[data.length - 1].id : 0
            if (data.length > 0) {
              hasMore.current = true
            }
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else if (open === false) {
      setList([])
      setTotal((0).toFixed(3))
    }
  }, [account, open])
  useEffect(() => {
    if (
      hasMore.current &&
      !loading &&
      scroll !== undefined &&
      listRef.current !== undefined
    ) {
      if (listRef.current?.scrollHeight - scroll.top - 240 <= 5) {
        setLoading(true)
        fetchReferralHistory(account, lastId.current)
          .then((res) => {
            if (Array.isArray(res.records)) {
              const data = res.records
              setList(list.concat(data))
              lastId.current = data.length > 0 ? data[data.length - 1].id : 0
              if (data.length <= 0) {
                hasMore.current = false
              }
            }
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }, [scroll, list])
  return (
    <Modal open={open} title="History" width="380px" {...other}>
      <div className="flex items-center justify-between bg-fill-2 px-4 py-3 rounded-2xl mb-4">
        <span className="text-lg font-semibold">Total Earnings</span>
        <span className="text-2xl font-bold">{total} BNB</span>
      </div>
      <ul className="h-[240px] overflow-y-auto" ref={listRef}>
        {list.map((item) => (
          <WithdrawListItem key={item.createdAt} data={item} />
        ))}
        {loading && (
          <li className="flex items-center">
            <AnimationSpin className="mx-auto" />
          </li>
        )}
      </ul>
    </Modal>
  )
}

export default WithdrawListModal
