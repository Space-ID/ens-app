export const ConnectToOkx = async () => {
  let provider = null
  if (typeof window?.okxwallet !== 'undefined') {
    provider = window.okxwallet
    try {
      console.log('ConnectToOkx')
      await provider.request({ method: 'eth_requestAccounts' })
    } catch (error) {
      throw new Error('User Rejected')
    }
  } else if (window.web3) {
    provider = window.web3.currentProvider
  } else {
    throw new Error('No Web3 Provider found')
  }
  return provider
}

export const OkxProvider = {
  id: 'custom-okx',
  name: 'OKX Wallet',
  logo: '',
  type: 'injected',
  check: 'isOkxWallet',
}
