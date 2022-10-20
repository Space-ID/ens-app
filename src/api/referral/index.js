import { getReferral } from 'apollo/mutations/ens'

const resolvers = {
  Query: {
    async getReferralDetails(_, { domain }) {
      const instance = getReferral()
      return instance.getReferralDetails(domain)
    },
    async getReferralBalance(_, { account }) {
      const instance = getReferral()
      return instance.getReferralBalance(account)
    },
    async getReferralLevelDetails() {
      const instance = getReferral()
      return instance.getReferralLevelDetails()
    },
  },
  Mutation: {
    async referralWithdraw() {
      const instance = getReferral()
      const res = await instance.referralWithdraw()
      const tx = res.hash
      return tx
    },
  },
}

export default resolvers
