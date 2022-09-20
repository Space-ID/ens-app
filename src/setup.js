import { getAccounts, getNetwork, getNetworkId, isReadOnly } from './ui'
import { setup } from './apollo/mutations/ens'
import { connect, getWeb3Modal } from './api/web3modal'
import {
  accountsReactive,
  delegatesReactive,
  favouritesReactive,
  globalErrorReactive,
  isAppReadyReactive,
  isReadOnlyReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  subDomainFavouritesReactive,
  web3ProviderReactive,
  loadingWalletReactive,
} from './apollo/reactiveVars'
import { setupAnalytics } from './utils/analytics'
import { getReverseRecord } from './apollo/sideEffects'
import { safeInfo, setupSafeApp } from './utils/safeApps'

export const setFavourites = () => {
  favouritesReactive(
    JSON.parse(window.localStorage.getItem('ensFavourites')) || []
  )
}

export const setSubDomainFavourites = () => {
  subDomainFavouritesReactive(
    JSON.parse(window.localStorage.getItem('ensSubDomainFavourites')) || []
  )
}

export const isSupportedNetwork = (networkId) => {
  return networkId.toString() === process.env.REACT_APP_NETWORK_CHAIN_ID
}

export const getProvider = async (reconnect) => {
  try {
    let provider
    loadingWalletReactive(true)
    const web3modal = getWeb3Modal()
    if (web3modal.cachedProvider || reconnect) {
      provider = await connect()
      loadingWalletReactive(false)
      return provider
    }
    const { providerObject } = await setup({
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: false,
    })
    provider = providerObject
    loadingWalletReactive(false)
    return provider
  } catch (e) {
    if (e.message.match(/Unsupported network/)) {
      loadingWalletReactive(false)
      globalErrorReactive({
        ...globalErrorReactive(),
        network: 'Unsupported Network',
      })
      return
    }
  }
}

export const setWeb3Provider = async (provider) => {
  web3ProviderReactive(provider)

  const accounts = await getAccounts()

  if (provider) {
    if (provider.removeAllListeners) provider.removeAllListeners()
    accountsReactive(accounts)
  }

  provider?.on('chainChanged', async (_chainId) => {
    const networkId = await getNetworkId()
    if (!isSupportedNetwork(networkId)) {
      globalErrorReactive({
        ...globalErrorReactive(),
        network: 'Unsupported Network',
      })
      return
    }
    await setup({
      customProvider: provider,
      reloadOnAccountsChange: false,
      enforceReload: true,
    })

    networkIdReactive(networkId)
    networkReactive(await getNetwork())
    loadingWalletReactive(false)
  })

  provider?.on('accountsChanged', async (accounts) => {
    accountsReactive(accounts)
  })

  return provider
}

export default async (reconnect) => {
  try {
    setFavourites()
    setSubDomainFavourites()
    const provider = await getProvider(reconnect)

    if (!provider) throw 'Please install a wallet'

    const networkId = await getNetworkId()
    if (!isSupportedNetwork(parseInt(networkId))) {
      globalErrorReactive({
        ...globalErrorReactive(),
        network: 'Unsupported Network',
      })
      return
    }

    networkIdReactive(networkId)

    const network = await getNetwork()

    networkReactive(network)

    await setWeb3Provider(provider)

    if (accountsReactive?.[0]) {
      reverseRecordReactive(await getReverseRecord(accountsReactive?.[0]))
      delegatesReactive(await getShouldDelegate(accountsReactive?.[0]))
    }

    isReadOnlyReactive(isReadOnly())

    setupAnalytics()

    isAppReadyReactive(true)
    loadingWalletReactive(false)
  } catch (e) {
    loadingWalletReactive(false)
    console.error('setup error: ', e)
  }
}
