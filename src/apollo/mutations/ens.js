import { setupENS } from 'ui'
import { isENSReadyReactive } from '../reactiveVars'

let ens = {},
  registrar = {},
  ensRegistryAddress = undefined,
  giftCard = {},
  referral = {}

export async function setup({
  enforceReadOnly,
  enforceReload,
  customProvider,
  ensAddress,
}) {
  try {
    let option = {
      reloadOnAccountsChange: false,
      enforceReadOnly,
      enforceReload,
      customProvider,
      ensAddress,
    }
    if (process.env.REACT_APP_INFURA_URL) {
      option.infura = process.env.REACT_APP_INFURA_URL
    }
    const {
      ens: ensInstance,
      registrar: registrarInstance,
      providerObject,
      giftCard: giftCardInstance,
      referral: referralInstance,
    } = await setupENS(option)
    ens = ensInstance
    registrar = registrarInstance
    ensRegistryAddress = ensAddress
    giftCard = giftCardInstance
    referral = referralInstance
    isENSReadyReactive(true)
    return { ens, registrar, providerObject }
  } catch (err) {
    console.log('this is the error', err)
  }
}

export function getRegistrar() {
  return registrar
}

export function getGiftCard() {
  return giftCard
}
export function getReferral() {
  return referral
}

export function getEnsAddress() {
  return ensRegistryAddress
}

export default function getENS() {
  return ens
}
