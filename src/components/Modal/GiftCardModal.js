import { useEffect, useState } from 'react'
import cn from 'classnames'
import EthVal from 'ethval'
import GiftCardSwiper from 'components/GiftCard/GiftCardSwiper'
import { GiftCards } from 'constants/index'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ETH_PRICE, QUERY_GIFT_CARD_MINT_PRICE } from 'graphql/queries'
import Toast from 'components/Toast'
import useTransaction from 'hooks/useTransaction'
import Modal from './index'

import { MINT_GIFT_CARD } from '../../graphql/mutations'

const initialData = () =>
  GiftCards.map((item, i) => {
    return {
      ...item,
      count: 0,
    }
  })

const GiftCardModal = (props) => {
  const { children, onOpenChange, ...otherProps } = props
  const [giftCardData, setGiftCardData] = useState(initialData())
  const [amounts, setAmounts] = useState(new Array(giftCardData.length).fill(0))
  const [ids, setIds] = useState(giftCardData.map((v) => v.id))
  const [mintLoading, setMintLoading] = useState(false)
  const [txState, setTxHash] = useTransaction()
  // get eth price
  const { data: { getEthPrice: ethUsdPrice } = {} } = useQuery(GET_ETH_PRICE)

  const {
    data: { getGiftCardMintPrice } = {},
    loading: loadingPrice,
    error,
  } = useQuery(QUERY_GIFT_CARD_MINT_PRICE, {
    variables: {
      ids,
      amounts,
    },
    fetchPolicy: 'no-cache',
  })

  const [mintGiftCard] = useMutation(MINT_GIFT_CARD, {
    variables: {
      ids,
      amounts,
    },
    onCompleted: (data) => {
      setTxHash(data.mintGiftCard)
    },
    onError: (e) => {
      setMintLoading(false)
    },
  })

  useEffect(() => {
    const arr = giftCardData.map((v) => v.count)
    setAmounts(arr)
    // setIds(giftCardData.map(v => v.id))
  }, [giftCardData])

  useEffect(() => {
    if (txState.confirmed) {
      setMintLoading(false)
      onOpenChange(false)
      Toast.success('Gift Card successfully minted.')
    }
    if (txState.error) {
      setMintLoading(false)
    }
  }, [txState])

  const ethVal = new EthVal(`${getGiftCardMintPrice || 0}`).toEth()
  const mintFee = ethVal.toFixed(3)
  const mintFeeInUsd = ethVal.mul(ethUsdPrice ?? 0).toFixed(3)

  const handleMint = () => {
    setMintLoading(true)
    mintGiftCard({ variables: { amounts } })
  }
  return (
    <Modal
      title="Mint SPACE ID Gift Card"
      width="auto"
      onOpenChange={onOpenChange}
      {...otherProps}
    >
      <div className="grid md:gap-x-14 md:px-9 md:grid-cols-2 md:pb-6 grid-cols-1 gap-y-8">
        <div>
          <GiftCardSwiper
            value={giftCardData}
            onChange={setGiftCardData}
            disabled={mintLoading}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-[438px] grid-cols-[310px] auto-rows-min m-auto">
          <div className="grid md:gap-8 gap-[18px] md:grid-cols-[144px_1px_1fr] grid-cols-[120px_1px_1fr] bg-fill-2 rounded-2xl md:px-7 p-[18px]">
            <div className="flex flex-col justify-center">
              {giftCardData.map((v) => (
                <div
                  key={`${v.id}-${v.count}`}
                  className="flex justify-between items-center md:text-base text-sm"
                >
                  <span>${v.faceValue} Gift Card:</span>
                  <span className="font-semibold">{v.count}</span>
                </div>
              ))}
            </div>
            <div className="w-1px bg-fill-3" />
            <div className="flex flex-col justify-between items-center">
              <span className="md:text-xl text-sm font-semibold">
                Total Cost
              </span>
              <div className="md:text-5xl text-2xl font-bold">
                {mintFee} BNB
              </div>
              <span className="text-sm">USD ${mintFeeInUsd}</span>
            </div>
          </div>
          <p className="text-sm text-center text-green-600 md:w-[422px] w-[310px]">
            Upon purchasing SPACE ID Gift Card, you may send it to your friend
            as a gift, or redeem the points for personal use.
          </p>
          <div className="flex justify-center">
            <button
              disabled={loadingPrice || mintFeeInUsd <= 0}
              className={cn(
                'btn btn-primary rounded-2xl w-[160px] h-[42px] text-lg text-black font-semibold',
                mintLoading && 'loading'
              )}
              onClick={handleMint}
            >
              Mint
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default GiftCardModal
