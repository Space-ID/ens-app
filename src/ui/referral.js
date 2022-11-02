import { namehash } from '@siddomains/sidjs'
import { getReferralContract } from './contracts'
import { getProvider, getSigner } from './web3'

class Referral {
  constructor(provider) {
    if (!provider) {
      throw new Error('Provider is required for GiftCard')
    }
    this.referralController = getReferralContract({
      address: process.env.REACT_APP_REFERRAL,
      provider,
    })
  }

  async getReferralLevelDetails() {
    const arr = []
    for (let i = 0; i < 5; i++) {
      arr.push(this.referralController.comissionCharts(i))
    }
    const res = await Promise.all(arr)
    return res
  }

  async getPartnerReferralLevelDetails(domain = '') {
    const d = domain.endsWith('.bnb') ? domain : domain + '.bnb'
    const hash = namehash(d)
    const res = await this.referralController.partnerComissionCharts(hash)
    return res
  }

  async getReferralDetails(domain = '') {
    const d = domain.endsWith('.bnb') ? domain : domain + '.bnb'
    const hash = namehash(d)
    const res = await this.referralController.getReferralDetails(hash)
    return res
  }

  async getReferralBalance(account) {
    const res = await this.referralController.referralBalance(account)
    return res
  }

  async referralWithdraw() {
    const singer = await getSigner()
    const ctl = this.referralController.connect(singer)
    const res = await ctl.withdraw()
    return res
  }

  async isPartner(domain = '') {
    const d = domain.endsWith('.bnb') ? domain : domain + '.bnb'
    const hash = namehash(d)
    const res = await this.referralController.isPartner(hash)
    return res
  }
}

export async function setUpReferral() {
  const provider = await getProvider()
  return new Referral(provider)
}
