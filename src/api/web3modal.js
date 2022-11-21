import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import { chainsInfo } from 'utils/constants'

import { getNetwork, getNetworkId, isReadOnly } from '../ui'
import { setup as setupENS } from '../apollo/mutations/ens'
import {
  isReadOnlyReactive,
  networkIdReactive,
  networkReactive,
  web3ProviderReactive,
} from '../apollo/reactiveVars'

import { ConnectToOkx, OkxProvider } from './wallet/okx'

const INFURA_ID =
  window.location.host === 'app.ens.domains'
    ? '90f210707d3c450f847659dc9a3436ea'
    : '58a380d3ecd545b2b5b3dad5d2b18bf0'

const PORTIS_ID = '57e5d6ca-e408-4925-99c4-e7da3bdb8bf5'

const BSC_RPC = 'https://bsc-dataseed.binance.org/'

let provider
const option = {
  cacheProvider: true, // optional
  network: 'binance',
  theme: {
    background: '#D7ECE3',
    main: '#379070',
    secondary: 'rgb(136, 136, 136)',
    border: '#47C799',
    hover: '#47C799',
  },
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: BSC_RPC,
        },
        network: 'binance',
      },
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: 'Space ID',
        rpc: BSC_RPC,
        chainId: 56,
      },
    },
    'custom-okx': {
      display: {
        ...OkxProvider,
        description: 'Connect to your OKX provider account',
      },
      package: OkxProvider,
      options: {
        apiKey: 'EXAMPLE_PROVIDER_API_KEY',
      },
      connector: ConnectToOkx,
    },
  },
}

let web3Modal
let web3ModalProviderId
export const setWeb3ModalProvider = (id) => {
  web3ModalProviderId = id
}

export const getWeb3Modal = () => {
  if (!web3Modal) {
    web3Modal = new Web3Modal(option)
  }
  return web3Modal
}

export const connect = async () => {
  try {
    web3Modal = getWeb3Modal()
    if (web3ModalProviderId) {
      provider = await web3Modal.connectTo(web3ModalProviderId)
    } else if (web3Modal.cachedProvider) {
      provider = await web3Modal.connect()
      setWeb3ModalProvider(web3Modal.cachedProvider)
    } else {
      throw new Error('wallet error')
    }
    await setupENS({
      customProvider: provider,
      reloadOnAccountsChange: false,
      enforceReload: true,
    })
    return provider
  } catch (e) {
    web3Modal = undefined
    if (e !== 'Modal closed by user') {
      throw e
    }
  }
}

export const disconnect = async function () {
  web3ModalProviderId = undefined
  if (web3Modal) {
    await web3Modal.clearCachedProvider()
  }
  // Disconnect wallet connect provider
  if (provider && provider.disconnect) {
    provider.disconnect()
  }
  await setupENS({
    reloadOnAccountsChange: false,
    enforceReadOnly: true,
    enforceReload: false,
  })

  isReadOnlyReactive(isReadOnly())
  web3ProviderReactive(null)
  networkIdReactive(await getNetworkId())
  networkReactive(await getNetwork())
}

export const setWeb3Modal = (x) => {
  web3Modal = x
}

export const switchToBscChain = async () => {
  const chainID = process.env.REACT_APP_NETWORK_CHAIN_ID
  let chain = chainsInfo.filter((item) => item.chainId.toString() === chainID)
  if (provider && chain && chain.length > 0) {
    chain = chain[0]
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chain.chainId.toString(16)}` }],
      })
    } catch (err) {
      if (err.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chain.chainId.toString(16)}`,
                chainName: chain.chainName,
                rpcUrls: [chain.rpc],
              },
            ],
          })
        } catch (addError) {
          console.log(addError)
        }
      }
    }
  }
  window.location.reload()
}
