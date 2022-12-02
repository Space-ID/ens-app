import { BigNumber } from 'ethers'
import {
  getGiftCardRegistrar,
  getGiftCardController,
  getGiftCardLedger,
} from './contracts'
import { getProvider, getSigner } from './web3'
import { getBufferedPrice } from './utils'

const transferGasCost = 21000

class GiftCard {
  constructor(provider) {
    if (!provider) {
      throw new Error('Provider is required for GiftCard')
    }
    this.giftCardController = getGiftCardController({
      address: process.env.REACT_APP_GIFT_CARD_CONTROLLER,
      provider,
    })
    this.giftCardRegistrar = getGiftCardRegistrar({
      address: process.env.REACT_APP_GIFT_CARD_REGISTRAR,
      provider,
    })
    this.giftCardLedger = getGiftCardLedger({
      address: process.env.REACT_APP_GIFT_CARD_LEDGER,
      provider,
    })
  }

  async estimateGasLimit(cb) {
    let gas = 0
    try {
      gas = (await cb()).toNumber()
    } catch (e) {
      let matched =
        e.message.match(/\(supplied gas (.*)\)/) ||
        e.message.match(/\(gas required exceeds allowance (.*)\)/)
      if (matched) {
        gas = parseInt(matched[1])
      }
      console.log({ gas, e, matched })
    }
    if (gas > 0) {
      return gas + transferGasCost
    } else {
      return gas
    }
  }
  async getMintPrice(ids, amounts) {
    const res = await this.giftCardController.price(ids, amounts)
    return res
  }
  async getUserGiftCards(account, ids) {
    const accountArr = new Array(ids.length).fill(account)
    const res = await this.giftCardRegistrar.balanceOfBatch(accountArr, ids)
    return res
  }

  async getPointBalance(account) {
    const res = await this.giftCardLedger.balanceOf(account)
    return res
  }

  async transferGiftCard(from, to, ids, amounts) {
    const singer = await getSigner()
    const registrarWithSinger = this.giftCardRegistrar.connect(singer)
    return registrarWithSinger.safeBatchTransferFrom(from, to, ids, amounts, [])
  }

  async mintGiftCard(ids, amounts) {
    const singer = await getSigner()
    const ctlWithSinger = this.giftCardController.connect(singer)
    const price = await this.getMintPrice(ids, amounts)
    const priceWithBuffer = getBufferedPrice([price, BigNumber.from(0)])
    return ctlWithSinger.batchRegister(ids, amounts, {
      value: priceWithBuffer,
    })
  }
  async redeemGiftCard(ids, amounts) {
    const singer = await getSigner()
    const ledgerWithSinger = this.giftCardLedger.connect(singer)
    const res = await ledgerWithSinger.redeem(ids, amounts)
    return res
  }
}

export async function setUpGiftCard() {
  const provider = await getProvider()
  return new GiftCard(provider)
}
