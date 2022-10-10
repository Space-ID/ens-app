import EthVal from 'ethval'
import { getGiftCard } from 'apollo/mutations/ens'
import { sendHelper } from '../resolverUtils'

const resolvers = {
  Query: {
    async getGiftCardMintPrice(_, { ids, amounts }) {
      const instance = getGiftCard()
      return instance.getMintPrice(ids, amounts)
    },
    async getUserGiftCards(_, { account, ids }) {
      const instance = getGiftCard()
      return instance.getUserGiftCards(account, ids)
    },
    async getPointBalance(_, { account }) {
      const instance = getGiftCard()
      const res = await instance.getPointBalance(account)
      const val = new EthVal(`${res || 0}`).toEth()
      return val.toNumber().toFixed(3)
    },
  },
  Mutation: {
    async mintGiftCard(_, { ids, amounts }) {
      const instance = getGiftCard()
      const tx = await instance.mintGiftCard(ids, amounts)
      return sendHelper(tx)
    },
    async redeemGiftCard(_, { ids, amounts }) {
      const instance = getGiftCard()
      const tx = await instance.redeemGiftCard(ids, amounts)
      return sendHelper(tx)
    },
    async transferGiftCard(_, { from, to, ids, amounts }) {
      const instance = getGiftCard()
      const tx = await instance.transferGiftCard(from, to, ids, amounts)
      return sendHelper(tx)
    },
  },
}

export default resolvers
