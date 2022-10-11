import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import { utils as ethersUtils } from 'ethers'
import GiftCardSwiper from 'components/GiftCard/GiftCardSwiper'
import { GiftCardFaceIds, GiftCards, noGiftCardUlr } from 'constants/index'
import { isEmptyAddress } from 'utils/records'
import Modal from './index'
import { useAccount } from '../QueryAccount'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { QUERY_POINT_BALANCE, QUERY_USER_GIFT_CARDS } from 'graphql/queries'
import { REDEEM_GIFT_CARD, TRANSFER_GIFT_CARD } from 'graphql/mutations'
import useTransaction from 'hooks/useTransaction'
import Toast from '../Toast'
import DomainInput from '../Input/DomainInput'

const TabValue = {
  redeem: 'REDEEM',
  transfer: 'TRANSFER',
}
const GiftCardRedeemModal = (props) => {
  const { children, onOpenChange, ...otherProps } = props
  const [giftCardData, setGiftCardData] = useState([])
  const [curTab, setCurTab] = useState(TabValue.redeem)
  const [totalPoints, setTotalPoints] = useState(0)
  const [toAddress, setToAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [txState, setTxHash] = useTransaction()
  const account = useAccount()
  const curTabRef = useRef(curTab)
  const primaryDomain = useSelector((state) => state.domain.primaryDomain)

  curTabRef.current = curTab

  const { data: { getPointBalance = 0 } = {}, refetch } = useQuery(
    QUERY_POINT_BALANCE,
    {
      variables: { account },
      skip: !ethersUtils.isAddress(account),
      fetchPolicy: 'network-only',
    }
  )

  const [fetchUserGiftCards, { loading: queryLoading }] = useLazyQuery(
    QUERY_USER_GIFT_CARDS,
    {
      variables: {
        ids: GiftCardFaceIds,
        account,
      },
      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        const res = data?.getUserGiftCards ?? []
        const newData = []
        res.forEach((v, i) => {
          const num = v?.toNumber() ?? 0
          if (num > 0) {
            newData.push({
              ...GiftCards[i],
              count: 0,
              total: num,
            })
          }
        })
        setGiftCardData(newData)
      },
    }
  )

  const [transferGiftCard] = useMutation(TRANSFER_GIFT_CARD, {
    variables: {
      from: account,
      to: toAddress,
    },
    onCompleted: (data) => {
      setTxHash(data.transferGiftCard)
    },
    onError: (e) => {
      console.error(e)
      setLoading(false)
    },
  })

  const [redeemGiftCard] = useMutation(REDEEM_GIFT_CARD, {
    onCompleted: (data) => {
      setTxHash(data.redeemGiftCard)
    },
    onError: (e) => {
      console.error(e)
      setLoading(false)
    },
  })

  useEffect(async () => {
    if (!isEmptyAddress(account)) {
      fetchUserGiftCards()
    }
  }, [account])

  useEffect(() => {
    let total = 0
    giftCardData.forEach((value) => {
      total += value.faceValue * value.count
    })
    setTotalPoints(total)
  }, [giftCardData])

  useEffect(() => {
    if (txState.error) {
      setLoading(false)
    }
    if (txState.confirmed) {
      setLoading(false)
      // fetchUserGiftCards()
      refetch()
      Toast.success(
        curTabRef.current === TabValue.transfer
          ? 'Gift Card successfully transferred.'
          : 'SID Points successfully redeemed.'
      )
      onOpenChange(false)
    }
  }, [txState])

  const handleTransfer = () => {
    if (ethersUtils.isAddress(toAddress) && !isEmptyAddress(toAddress)) {
      setLoading(true)
      let ids = []
      let arr = []
      giftCardData.forEach((v) => {
        if (v.count > 0) {
          ids.push(v.id)
          arr.push(v.count)
        }
      })
      transferGiftCard({ variables: { amounts: arr, ids } })
    }
  }
  const handleRedeem = () => {
    setLoading(true)
    let ids = []
    let arr = []
    giftCardData.forEach((v) => {
      if (v.count > 0) {
        ids.push(v.id)
        arr.push(v.count)
      }
    })
    redeemGiftCard({ variables: { amounts: arr, ids } })
  }

  return (
    <Modal
      title="My Gift Card"
      width="auto"
      onOpenChange={onOpenChange}
      {...otherProps}
    >
      <div className="grid md:gap-x-14 md:px-9 md:grid-cols-2 md:grid-rows-[46px_1fr] md:pb-6 grid-cols-1 gap-8 ">
        {/*tab btn*/}
        <div className="w-full px-2.5 py-2 bg-fill-4 rounded-2xl flex items-center justify-between text-center text-gray-700 text-sm font-semibold space-x-3">
          <button
            disabled={loading}
            className={cn(
              'flex-1 rounded-xl py-1',
              curTab === TabValue.redeem && 'bg-boxBg text-green-200'
            )}
            onClick={() => setCurTab(TabValue.redeem)}
          >
            Redeem
          </button>
          <button
            disabled={loading}
            className={cn(
              'flex-1 rounded-xl py-1',
              curTab === TabValue.transfer && 'bg-boxBg text-green-200'
            )}
            onClick={() => setCurTab(TabValue.transfer)}
          >
            Transfer
          </button>
        </div>
        {/*swiper*/}
        <div className="m-auto md:row-span-full">
          {giftCardData.length <= 0 ? (
            <img
              className="mx-auto md:w-[320px] w-[240px]"
              src={noGiftCardUlr}
              alt=""
              style={{
                filter: 'drop-shadow(0px 0px 32px rgba(80, 255, 192, 0.6))',
              }}
            />
          ) : (
            <GiftCardSwiper
              value={giftCardData}
              onChange={setGiftCardData}
              disabled={loading}
            />
          )}
        </div>

        <div className="grid gap-6 grid-cols-1">
          {/*<div className="grid md:gap-8 gap-[18px] md:grid-cols-[144px_1px_1fr] grid-cols-[120px_1px_1fr] bg-fill-2 rounded-2xl md:px-7 p-[18px]">*/}
          <div className="flex justify-center md:space-x-8 space-x-[18px] bg-fill-2 rounded-2xl md:px-7 p-[18px]">
            <div
              className={cn(
                'flex flex-col justify-center',
                curTab === TabValue.redeem
                  ? 'md:w-[144px] w-[120px]'
                  : 'md:min-w-[144px] min-w-[120px]'
              )}
            >
              {giftCardData.map((v) => (
                <div
                  key={`${v.id}-${v.count}`}
                  className="flex justify-between items-center md:text-base text-sm truncate"
                >
                  <span className="whitespace-nowrap mr-1">
                    ${v.faceValue} Gift Card:
                  </span>
                  <span className="font-semibold">{`${v.count}/${v.total}`}</span>
                </div>
              ))}
            </div>
            {curTab === TabValue.redeem && (
              <>
                <div className="divider s-divider s-divider-v my-0" />
                <div className="flex items-center justify-center flex-grow">
                  <div className="md:text-xl text-base font-semibold text-center">
                    <span>
                      Points to{' '}
                      {curTab === TabValue.redeem ? 'Redeem' : 'Transfer'}
                    </span>
                    <br />
                    <span className="md:text-5xl text-2xl font-bold text-primary">
                      {totalPoints}
                    </span>
                    <span> Points</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {/*redeem*/}
          {curTab === TabValue.redeem && (
            <>
              <p className="text-sm text-center text-green-600 md:w-[422px] w-[310px]">
                After redemption, the points will be added to your address point
                balance and the corresponding NFTs will be burned.
              </p>
              <p className="text-center md:text-lg text-base font-semibold">
                Current point balance:{' '}
                <span className="text-primary">{getPointBalance}</span>
              </p>
              <div className="flex justify-center">
                <button
                  disabled={totalPoints <= 0 || queryLoading}
                  className={cn(
                    'btn btn-primary rounded-2xl w-[160px] h-[42px] text-lg text-black font-semibold',
                    loading && 'loading'
                  )}
                  onClick={handleRedeem}
                >
                  Redeem
                </button>
              </div>
            </>
          )}
          {/*transfer*/}
          {curTab === TabValue.transfer && (
            <>
              <div className="text-base font-semibold">
                From domain/address
                <br />
                <span className="text-sm text-gray-600 font-normal">
                  {primaryDomain?.name ? `${primaryDomain.name}.bnb` : account}
                </span>
              </div>
              <div className="text-base font-semibold">
                Recipient domain/address
                <br />
                <DomainInput
                  placeholder="Enter the domain/address"
                  onChange={(v) => setToAddress(v)}
                />
              </div>
              <p className="text-sm text-center text-green-600 md:w-[422px] w-[310px]">
                After transferring, the points will be added to your address
                point balance and the corresponding NFTs will be burned.
              </p>
              <div className="flex justify-center">
                <button
                  disabled={
                    totalPoints <= 0 ||
                    !ethersUtils.isAddress(toAddress) ||
                    queryLoading
                  }
                  className={cn(
                    'btn btn-primary rounded-2xl w-[160px] h-[42px] text-lg text-black font-semibold',
                    loading && 'loading'
                  )}
                  onClick={handleTransfer}
                >
                  Transfer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default GiftCardRedeemModal
