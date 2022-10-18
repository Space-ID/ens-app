import { useEffect, useState } from 'react'
import { injected, providers, isMobile } from 'web3modal'
import { getWeb3Modal } from 'api/web3modal'
import { connectProvider } from 'utils/providerUtils'
import { setWeb3ModalProvider } from 'api/web3modal'
import Modal from './index'

const WalletBg = {
  MetaMask: '#F5841F',
  WalletConnect: '#3B99FC',
  Trust: '#3375BB',
  default: '#000000',
}
const WalletDeepLinks = {
  [injected.METAMASK
    .name]: `https://metamask.app.link/dapp/${process.env.REACT_APP_PUBLIC_URL.replace(
    'https://',
    ''
  )}/`,
  [injected.TRUST
    .name]: `https://link.trustwallet.com/open_url?coin_id=20000714&url=${process.env.REACT_APP_PUBLIC_URL}/`,
}

const WalletLogo = {
  WalletConnect:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAI4SURBVHgB7ZZNUttAEIW7RxLF0kfwDcgyCamKcpKgqlQSrzAniDhBzMpFNsAJEk6AFxC2cAMfwVskzXR6lAgba/4UsUNvpULz3ny0u2cEMGjQoBcmhI5Kz2j0IGUaKUgJ8D0QjfnPo3+vV5x4x7FLJejy9lP8CzoqGEiDFJU6REXTDQBf/JJ3WCRSHC8m/PxcQG9+yENBlIeDtMEUyJPbLzsz70rXS12VslTf+Wc5gOcQ4nmSiKNFhivrEnDBFNWCl+xZltT9wgH3iqjeQCCOCGAPCFKwQ90x1AcbVGzzFQ8yRzTCrLiPTuLdeGYLfT2nsQCZMuE3hLrp1yJ6VRSV7sPc5LVWqA4V6upJoIKLZDeaukq+nREJmfPjxw2i+2QnTm0Z6AtsoLgqx9eTJIf/0Lt5mRNXywcTJA21f1pMoafezqsD3Ze+ddhsWleCz4ybz1EGHfTY/CjI1axWbz3FkCaKvXxWYatXPFNghGkmsY+XzyoNJVqNy1PA1Fe+8up/pHUsNN751mR5YWrzuGQWwSfwZcvhgWqqajyjtFfYoVznGyp1Ia6/xlM9QaFQxuOgbR6boNwwf6f4cezXo7m9ct0XYTBPzMumWUNg6ufNFy4oKmUGcfTTBNNU2OhlKClUxp8rMx9MC8gJZdFmYB+vFahLsCmwj9cKFBLsukr6eJ13mT1YHd14PrZsXt+d6P1i3A4mBdnvSXwOAdL3Fwo4C4UJlobaP61IbwAdpT3aqzNg0KBBg9r6A3sso9+9JGCiAAAAAElFTkSuQmCC',
  Trust:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMTSURBVHgB1ZnPaxNBFMdfagsNJJIUFDZCiQk0YC5Kc1Swh3oyHi311Iv9A8R70pOngh6tJ0+lPbY92UMi5iImqIcILqQNle4ehEbcQioU4nw3u8lsSNzZH23WD7zutuzOfue9mTdvpkQGnU4nxqzArNQZH5+ZrRBHyBCXZJcSsyQFgyazhVAo1DQFHlJwxJk0md25Yrh0hYJHjNmfEOLObm5TMClDYIcCzAQFHN8EysopPXn5kfIvKqS0zsgvPIdYOzunzQ9HuuHeZHUxRQ9zCUrEp8kLrgRCiKxoVK7/pL1PikUYj8TE5dJxXehcIkrR6UlyipDA52+/ktY+Z6Fr67+rQ0KIj68+SOnPDXqTf0aamWbXKUqw67NHGVvRtl2Cl2CjwAeW783qZn4MHnuz36Bqo2XpDERrbKyC2gHRfKrrXU8CB8VEwpOUSVzVPXE/e21o6DDuCo+zhpCW3kEMCXhXPWmPHBKuBEbD/UcQwuW7s+QEeAlmsldVqLj9Tfh9R2kGHvAK34Y0E7Z9/tITtZPwAluB0fAUjRNbgRFuAqg+rBB8iEXy4qWH+JQLcUQgOrYC+aVKOWmTV8xkP9j2KIQ8KBkNqS3vAk349PUvhASaE8XpDByGfKzpVykmVkQICcyw1QJ012P3EwXvm51MCORAICRwTor07uXj3+QWWdX6bRqdtkNM4I1+Y7XDX+QWLHMm8+m40DuCHuwXBPiI27GI6qbXpp8exIxDOQUwjjbeNcgpG/sHvUSfz0nCxatwokYVYza6WflBa9t1oQkDb6/vyLpAgDaeLqZJFEcl/25NobWtfqmE/Ii9R35E0YnKGsL4IYE6ER68EIEAxef6znfLujwoFEVqcatueQaeKyzdYkXudXKCq00TQouSfreqWv4Oz2CMDm4RMH7RgQvbNDkVaoJUgpB62Xr6cvSB1POam6UIeXEpayn13eLb2Yy+3awc6ff8Ds8r/8XhUZmCyxcIfE/B5RVCjJNMHGImKVg02Rn1zQn2A+XJAnXPhINCk7qarOC82vhXwLgoMSsaUdX5C4cnbI3AMfK8AAAAAElFTkSuQmCC',
  MetaMask:
    'data:image/png;base64,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',
}

export default function WalletModal(props) {
  const [options, setOptions] = useState([])
  const web3Modal = getWeb3Modal()
  useEffect(() => {
    let userOpts = web3Modal?.getUserOptions() ?? []
    userOpts = [...userOpts]
    if (isMobile()) {
      const index = userOpts.findIndex((v) => v.id === injected.TRUST.id)
      const injectedOpts = userOpts[index]
      if (injectedOpts) {
        if (injectedOpts.name !== injected.METAMASK.name) {
          userOpts.splice(index + 1, 0, {
            ...injected.METAMASK,
            deepLink: WalletDeepLinks[injected.METAMASK.name],
          })
        }
        if (injectedOpts.name !== injected.TRUST.name) {
          userOpts.splice(index + 1, 0, {
            ...injected.TRUST,
            deepLink: WalletDeepLinks[injected.TRUST.name],
          })
        }
      } else {
        userOpts.push({
          ...injected.TRUST,
          deepLink: WalletDeepLinks[injected.TRUST.name],
        })
        userOpts.push({
          ...injected.METAMASK,
          deepLink: WalletDeepLinks[injected.METAMASK.name],
        })
      }
    }
    if (
      userOpts.find(
        (v) =>
          v.name === providers.WALLETCONNECT.name &&
          v.id === providers.WALLETCONNECT.id
      ) === undefined
    ) {
      userOpts.push(providers.WALLETCONNECT)
    }
    setOptions(userOpts)
  }, [web3Modal])
  const handleClick = async (id, deepLink) => {
    if (deepLink) {
      const a = document.createElement('a')
      a.href = deepLink
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      a.remove()
    } else {
      setWeb3ModalProvider(id)
      connectProvider()
      props?.onOpenChange(false)
    }
  }
  return (
    <Modal title="Select Wallet" {...props}>
      <div className="grid gap-5 md:grid-cols-[300px_300px] xs:grid-cols-[300px] grid-cols-[250px]">
        {options.map((item) => (
          <div
            key={`${item.id}-${item.name}`}
            onClick={() => handleClick(item.id, item.deepLink)}
            className="h-[72px] rounded-2xl p-4 flex items-center cursor-pointer"
            style={{ backgroundColor: WalletBg[item.name] ?? WalletBg.default }}
          >
            <img
              src={WalletLogo[item.name] ?? item.logo}
              alt=""
              className="w-[40px] h-[40px] bg-white rounded-md p-0.5"
            />
            <p className="ml-5 font-semibold text-xl">{item.name}</p>
          </div>
        ))}
      </div>
    </Modal>
  )
}
