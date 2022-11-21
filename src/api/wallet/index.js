import { injected, providers, isMobile } from 'web3modal'
import { OkxProvider } from './okx'
import metaMask from './logo/metaMask.svg'
import trust from './logo/trust.svg'
import walletConnect from './logo/walletConnect.svg'
import bitkeep from './logo/bitkeep.svg'
import okx from './logo/okx.svg'
import coinbase from './logo/coinbase.svg'

const getInjectedTrueFlags = () =>
  Object.keys(window.ethereum).filter(
    (v) => v.startsWith('is') && window.ethereum[v] === true
  )

export const MetaMask = {
  id: injected.METAMASK.id,
  name: injected.METAMASK.name,
  logo: metaMask,
  color: 'white',
  bgColor: '#F5841F',
  deepLink: `https://metamask.app.link/dapp/${process.env.REACT_APP_PUBLIC_URL.replace(
    'https://',
    ''
  )}/`,
  homePage: 'https://metamask.io/download/',
  check() {
    if (window.ethereum && !window.ethereum.overrideIsMetaMask) {
      if (isMobile() && window.bitkeep !== undefined) {
        return false
      }
      const flags = getInjectedTrueFlags()
      if (flags.length === 1 && flags[0] === 'isMetaMask') {
        return true
      }
    }
    return false
  },
}

export const Trust = {
  id: injected.TRUST.id,
  name: injected.TRUST.name + ' Wallet',
  logo: trust,
  color: 'white',
  bgColor: '#3375BB',
  deepLink: `https://link.trustwallet.com/open_url?coin_id=20000714&url=${process.env.REACT_APP_PUBLIC_URL}/`,
  homePage: 'https://trustwallet.com/',
  check() {
    if (window.ethereum) {
      const flags = getInjectedTrueFlags()
      const trustFlags = flags.filter((v) => v.startsWith('isTrust'))
      if (trustFlags.length === flags.length) {
        return true
      }
    }
    return false
  },
}

export const BitKeep = {
  id: providers.BITKEEPWALLET.id,
  name: providers.BITKEEPWALLET.name,
  logo: bitkeep,
  color: 'white',
  bgColor: '#7524F9',
  deepLink: `bitkeep://bkconnect?action=dapp&dappName=SPACE ID&chain=bsc&url=${process.env.REACT_APP_PUBLIC_URL}/`,
  homePage: 'https://bitkeep.com/en/download',
  check() {
    return window.bitkeep?.ethereum !== undefined
    // window.bitkeep?.ethereum?.isBitKeep || window.ethereum?.isBitKeep
  },
}

export const OKX = {
  id: OkxProvider.id,
  name: OkxProvider.name,
  logo: okx,
  color: 'black',
  bgColor: 'white',
  homePage: 'https://www.okx.com/web3',
  check() {
    if (isMobile()) {
      return /OKEx/.test(window.navigator.userAgent)
    }
    return (
      window.ethereum?.isOkxWallet ||
      window.ethereum?.isOKExWallet ||
      window.okxwallet?.isOKExWallet ||
      window.okxwallet?.isOkxWallet
    )
  },
}

export const Coinbase = {
  id: providers.COINBASEWALLET.id,
  name: providers.COINBASEWALLET.name + ' Wallet',
  logo: coinbase,
  color: 'white',
  bgColor: '#0D5BFF',
  deepLink: `https://go.cb-w.com/dapp?cb_url=${encodeURI(
    process.env.REACT_APP_PUBLIC_URL
  )}`,
  homePage: 'https://www.coinbase.com/wallet/downloads',
  check() {
    if (Array.isArray(window.ethereum?.providers)) {
      return !!window.ethereum.providers.find((v) => v.isCoinbaseWallet)
    }
    // window.ethereum.isCoinbaseBrowser
    return window.ethereum?.isCoinbaseWallet
  },
}

export const WalletConnect = {
  id: providers.WALLETCONNECT.id,
  name: providers.WALLETCONNECT.name,
  logo: walletConnect,
  color: 'white',
  bgColor: '#3B99FC',
  isWalletConnect: true,
  check() {
    return true
  },
}

export const supportedWallets = [
  MetaMask,
  WalletConnect,
  BitKeep,
  OKX,
  Coinbase,
  Trust,
]
