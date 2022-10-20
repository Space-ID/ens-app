import merge from 'lodash/merge'
import managerResolvers from './manager/resolvers'
import auctionRegistrarResolvers from './registrar/resolvers'
import subDomainRegistrarResolvers from './subDomainRegistrar/resolvers'
import giftCardResolvers from './giftCard'
import referralResolvers from './referral'
export default merge(
  managerResolvers,
  auctionRegistrarResolvers,
  subDomainRegistrarResolvers,
  giftCardResolvers,
  referralResolvers
)
