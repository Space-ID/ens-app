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
    async getPartnerReferralLevelDetails(_, { domain }) {
      const instance = getReferral()
      return instance.getPartnerReferralLevelDetails(domain)
    },
    async isPartner(_, { domain }) {
      const instance = getReferral()
      return instance.isPartner(domain)
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
