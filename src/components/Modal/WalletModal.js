import { useEffect, useState } from 'react'
import { injected, isMobile } from 'web3modal'
import { getWeb3Modal } from 'api/web3modal'
import { connectProvider } from 'utils/providerUtils'
import { setWeb3ModalProvider } from 'api/web3modal'
import { supportedWallets, WalletConnect } from 'api/wallet/index'
import Modal from './index'

export default function WalletModal(props) {
  const [options, setOptions] = useState([])
  const [errorModal, setErrorModal] = useState(false)
  const web3Modal = getWeb3Modal()
  useEffect(() => {
    let userOpts = web3Modal?.getUserOptions() ?? []
    userOpts = [...userOpts]
    const index = userOpts.findIndex((v) => v.id === injected.TRUST.id)
    const injectedOpts = userOpts[index]
    if (isMobile()) {
      const mobileSupported = supportedWallets.filter(
        (v) => v.deepLink || v.isWalletConnect
      )
      if (injectedOpts) {
        const temp = supportedWallets.find(
          (p) => !p.isWalletConnect && p.check()
        )
        if (temp) {
          setOptions([temp, WalletConnect])
        } else {
          setOptions([injectedOpts, ...mobileSupported])
        }
      } else {
        setOptions(mobileSupported)
      }
    } else {
      setOptions(supportedWallets)
    }
  }, [web3Modal])
  const handleClick = (provider) => {
    if (typeof provider.check !== 'function' || provider.check()) {
      setWeb3ModalProvider(provider.id)
      connectProvider()
      props?.onOpenChange(false)
    } else {
      if (isMobile() && provider.deepLink) {
        const a = document.createElement('a')
        a.href = provider.deepLink
        a.target = '_self'
        document.body.appendChild(a)
        a.click()
        a.remove()
        return
      }
      if (provider.name === injected.METAMASK.name) {
        setErrorModal(true)
        return
      }
      if (provider.homePage) {
        window.open(provider.homePage, '_blank')
      }
    }
  }
  return (
    <>
      <Modal title="Select Wallet" {...props}>
        <div className="grid gap-5 md:grid-cols-[300px_300px] xs:grid-cols-[300px] grid-cols-[250px]">
          {options.map((item) => (
            <div
              key={`${item.id}-${item.name}`}
              onClick={() => handleClick(item)}
              className="h-[72px] rounded-2xl p-4 flex items-center cursor-pointer bg-black"
              style={{ backgroundColor: item.bgColor }}
            >
              <img
                src={item.logo}
                alt=""
                className="w-[40px] h-[40px] bg-white rounded-md p-0.5"
              />
              <p
                className="ml-5 font-semibold text-xl text-white"
                style={{
                  color: item.color,
                }}
              >
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        title="Connection Error to Metamask"
        open={errorModal}
        onOpenChange={setErrorModal}
      >
        <p className="text-base font-semibold text-center max-w-[470px]">
          Please check if you have the Metamask extension in your browser;
          otherwise you might have installed wallet extension that will conflict
          with Metamask.
        </p>
      </Modal>
    </>
  )
}
