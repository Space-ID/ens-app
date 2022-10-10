import { setupENS } from 'ui'
import { isENSReadyReactive } from '../reactiveVars'

let ens = {},
  registrar = {},
  ensRegistryAddress = undefined,
  giftCard = {}

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
    } = await setupENS(option)
    ens = ensInstance
    registrar = registrarInstance
    ensRegistryAddress = ensAddress
    giftCard = giftCardInstance
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

export function getEnsAddress() {
  return ensRegistryAddress
}

export default function getENS() {
  return ens
}
