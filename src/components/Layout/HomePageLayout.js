// Import packages
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { getNetworkId } from 'ui'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import ClickAwayListener from 'react-click-away-listener'

import { Button } from 'react-daisyui'

// Import components
import NoAccountsDefault from 'components/NoAccounts/NoAccounts'
import SmallLogoIcon from 'components/Icons/SmallLogoIcon'
import AnimationSpin from 'components/AnimationSpin'
import DomainList from 'routes/Profile/components/Sidebar/DomainList'
import {
  TwitterIcon,
  DiscordIcon,
  RoundedIcon,
  HamburgerIcon,
  WholeLogoIcon,
} from 'components/Icons'
import Modal from 'components/Modal/Modal'
import WalletModal from 'components/Modal/WalletModal'
import { Search } from 'components/SearchName/SearchInHeader'
import ProfileCard from 'routes/Profile/components/Sidebar/ProfileCard'

// Import graphql quires
import { GET_REVERSE_RECORD } from 'graphql/queries'
import {
  getDomainList,
  setAllDomains,
  setSelectedDomain,
} from 'app/slices/domainSlice'

// Import redux assets
import { getAccounts, getHomeData } from 'app/slices/accountSlice'
import {
  toggleDrawer,
  toggleNetworkError,
  setShowWalletModal,
} from 'app/slices/uiSlice'
import { globalErrorReactive } from 'apollo/reactiveVars'

// Import assets
import DefaultAvatar from 'assets/images/default-avatar.png'

import { chainsInfo } from 'utils/constants'

// Import custom functions
import { disconnectProvider } from 'utils/providerUtils'
import { EMPTY_ADDRESS } from 'utils/records'
import { getDomainNftUrl } from 'utils/utils'
import { GET_ERRORS } from 'graphql/queries'

//Import Assets
import SearchIcon from '../Icons/SearchIcon'

// Import custom hooks
import useReactiveVarListeners from 'hooks/useReactiveVarListeners'
import useDeviceSize from '../../hooks/useDeviceSize'

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
    loadingWallet
  }
`

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

export default ({ children }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [avatarPopup, setAvatarPopup] = useState(false)
  const [networkId, setNetworkID] = useState('')
  const [avatar, setAvatar] = useState(DefaultAvatar)
  const showWalletModal = useSelector((state) => state.ui.showWalletModal)
  const domains = useSelector((state) => state.domain.domains)
  const primaryDomain = useSelector((state) => state.domain.primaryDomain)
  const selectedDomain = useSelector((state) => state.domain.selectedDomain)
  useReactiveVarListeners()

  const { windowDimenion } = useDeviceSize()

  const {
    data: { globalError },
  } = useQuery(GET_ERRORS)

  const {
    data: { accounts },
  } = useQuery(GET_ACCOUNT)

  const { data } = useQuery(HOME_DATA, {
    variables: {
      address: accounts?.[0],
    },
  })

  useEffect(() => {
    if (accounts) {
      dispatch(getAccounts(accounts))
    }
  }, [accounts])

  useEffect(() => {
    if (data?.network) {
      dispatch(getHomeData(data))
    }
  }, [data])

  useEffect(() => {
    if (primaryDomain?.name) {
      setAvatar(getDomainNftUrl(primaryDomain.name))
    } else {
      setAvatar(DefaultAvatar)
    }
  }, [primaryDomain])

  const initActions = async () => {
    const networkId = await getNetworkId()
    setNetworkID(networkId)
    return networkId
  }

  const { network, displayName, isReadOnly, isSafeApp, loadingWallet } = data

  useEffect(async () => {
    if (!isReadOnly && accounts?.[0] !== EMPTY_ADDRESS) {
      const netId = await initActions()
      dispatch(getDomainList({ account: accounts[0], networkId: netId }))
    }
    if (isReadOnly) {
      dispatch(setAllDomains([]))
    }
  }, [isReadOnly, accounts])

  const menuOpen = () => {
    if (!isMenuOpen) {
      setSearchOpen(false)
    }
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (isReadOnly) {
      dispatch(setAllDomains([]))
    }
  }, [isReadOnly])

  const { data: { getReverseRecord } = {}, loading: reverseRecordLoading } =
    useQuery(GET_REVERSE_RECORD, {
      variables: {
        address: accounts?.[0],
      },
      skip: !accounts?.length,
    })

  const showAvatarPopup = () => {
    setAvatarPopup(!avatarPopup)
  }

  const selectDomain = async (domain, index) => {
    dispatch(setSelectedDomain(domain))
    if (windowDimenion.winWidth < 768) {
      history.push('/profile')
      setIsMenuOpen(false)
    }
  }

  const changeToBSCChain = async () => {
    const chainID = process.env.REACT_APP_NETWORK_CHAIN_ID
    let chain = chainsInfo.filter((item) => item.chainId.toString() === chainID)
    if (chain && chain.length > 0) {
      chain = chain[0]
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chain.chainId.toString(16)}` }],
        })
      } catch (err) {
        if (err.code === 4902) {
          try {
            await window.ethereum.request({
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

  const moveToProfile = () => {
    history.push('/profile')
  }

  const moveToWishList = () => {
    window.location.href = process.env.REACT_APP_AUCTION_WISHLIST_URL
  }

  const showDrawer = () => {
    dispatch(toggleDrawer(true))
  }

  const closeModal = () => {
    globalErrorReactive({
      ...globalErrorReactive(),
      network: null,
    })
    dispatch(toggleNetworkError(false))
  }

  const handleConnect = () => {
    dispatch(setShowWalletModal(true))
  }

  return (
    <section className="bg-[url('assets/images/home-bg.png')] bg-cover relative min-h-[100vh] flex items-center justify-center">
      {globalError.network && (
        <Modal
          cannotCloseFromOutside={false}
          width="574px"
          className="px-6 pt-6 pb-9"
          showingCrossIcon={true}
          closeModal={closeModal}
        >
          <div className="text-white">
            <div className="text-xl md:text-[28px] font-cocoSharp text-center font-bold text-white leading-10">
              Unsupported Network
            </div>
            <div className="mt-4 font-semibold text-center text-white text-urbanist">
              Please change your dapp browser to Binance Smart Chain{' '}
              {process.env.REACT_APP_MODE === 'production' ? null : (
                <span>Testnet</span>
              )}
              {'  '}to continue.
            </div>
            <div className="justify-center hidden md:flex">
              <Button
                onClick={() => changeToBSCChain()}
                className="leading-[26px] text-dark-common border-none mt-9 bg-primary rounded-full text-[18px] font-urbanist py-2 px-9 font-semibold normal-case"
              >
                Switch to BSC{' '}
                {process.env.REACT_APP_MODE === 'production' ? null : (
                  <span className="ml-1">Testnet</span>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {showWalletModal && (
        <WalletModal closeModal={() => dispatch(setShowWalletModal(false))} />
      )}

      {/* Header component for mobile and desktop device */}
      <div
        className={cn(
          'md:bg-transparency absolute top-0 w-full z-50',
          isMenuOpen
            ? 'min-h-[100vh] h-full md:h-[100px] md:min-h-[100px] menu-mobile-background'
            : searchOpen
            ? 'min-h-auto h-auto md:h-[100px] md:min-h-[100px] menu-mobile-background rounded-b-[24px]'
            : 'h-[80px]'
        )}
      >
        <div className="flex items-center justify-between py-5 px-7 md:px-12">
          {/* Only showing for the desktop device */}
          <Link
            to="/"
            className="items-center hidden w-56 h-10 text-green-100 cursor-pointer lg:flex"
          >
            {/* <SmallLogoIcon size={40} className="text-green-100" />
            <div className="hidden lg:block font-semibold text-[18px] ml-[31px]">
              <img src={LogoText} />
            </div> */}
            <WholeLogoIcon />
          </Link>

          <div className="items-center hidden md:flex lg:hidden">
            <div onClick={showDrawer}>
              <HamburgerIcon className="mr-5 text-green-100" />
            </div>
            <SmallLogoIcon size={40} className="text-green-100" />
          </div>

          {/* Only show for the mobile device */}
          <div className="justify-between block w-full cursor-pointer md:hidden">
            {/* <SmallLogoIcon size={40} className="text-green-100" /> */}
            {isMenuOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div onClick={menuOpen}>
                    <HamburgerIcon className="mr-5 text-green-100" />
                  </div>
                  <Link to="/">
                    <div className="flex items-center">
                      <SmallLogoIcon size={40} className="text-green-100" />
                    </div>
                  </Link>
                </div>
                {(!accounts || !accounts[0]) && (
                  <div className="">
                    <button
                      disabled={loadingWallet}
                      className="flex items-center px-5 py-2 text-xl font-semibold bg-green-100 text-dark-100 rounded-2xl"
                      onClick={handleConnect}
                    >
                      Connect{' '}
                      {loadingWallet && (
                        <div className="ml-2">
                          <AnimationSpin />
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div onClick={menuOpen} className="mr-5">
                    <HamburgerIcon className="font-semibold text-green-100" />
                  </div>
                  <Link to="/">
                    <div className="flex items-center">
                      <SmallLogoIcon size={40} className="text-green-100" />
                    </div>
                  </Link>
                </div>
                <div className="block md:hidden">
                  {isReadOnly && (
                    <div className="">
                      <button
                        disabled={loadingWallet}
                        className="flex items-center px-5 py-2 text-xl font-semibold bg-green-100 text-dark-100 rounded-2xl"
                        onClick={handleConnect}
                      >
                        Connect{' '}
                        {loadingWallet && (
                          <div className="ml-2">
                            <AnimationSpin />
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            {!isSafeApp && (
              <div className="flex items-center w-full mt-0 md:w-auto">
                {/* //TODO should show in the public registration */}
                {location.pathname !== '/' && (
                  <Search
                    className="mr-4 xl:w-[400px] hidden md:block"
                    errorShowing={true}
                    isShowSearchBtn={true}
                    errorsStyling={true}
                  />
                )}

                {isReadOnly && (
                  <div className="hidden md:block">
                    <NoAccountsDefault
                      onClick={handleConnect}
                      loadingWallet={loadingWallet}
                      buttonText={isReadOnly ? 'Connect' : network}
                      isReadOnly={isReadOnly}
                    />
                  </div>
                )}

                {accounts && accounts[0] && !isReadOnly && (
                  <div className="flex items-center">
                    <div
                      className="hidden block"
                      onClick={() => setSearchOpen(!searchOpen)}
                    >
                      <SearchIcon className="text-[rgba(204,252,255,0.6)] cursor-pointer" />
                    </div>

                    <button
                      className="flex items-center ml-4 cursor-pointer"
                      onClick={() => {
                        // if (windowDimenion.winWidth > 768) {
                        showAvatarPopup()
                        // }
                      }}
                    >
                      {!reverseRecordLoading &&
                      getReverseRecord &&
                      getReverseRecord.avatar ? (
                        <img
                          src={imageUrl(
                            getReverseRecord.avatar,
                            displayName,
                            network
                          )}
                        />
                      ) : (
                        <div className="w-[44px] h-[44px] rounded-full">
                          <img
                            className="rounded-full"
                            src={avatar}
                            onError={() => setAvatar(DefaultAvatar)}
                            alt="default avatar"
                          />
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* DropdownMenu for the avatar popup */}
            {accounts && accounts[0] && avatarPopup && (
              <ClickAwayListener
                onClickAway={() => {
                  setAvatarPopup(false)
                }}
              >
                <div className="absolute w-[266px] h-auto bg-[#0E4549] right-0 top-[60px] rounded-[24px] p-4 z-[100]">
                  <div>
                    <div className="flex items-center justify-center border-b-[2px] border-gray-800 pb-4">
                      {!reverseRecordLoading &&
                      getReverseRecord &&
                      getReverseRecord.avatar ? (
                        <img
                          src={imageUrl(
                            getReverseRecord.avatar,
                            displayName,
                            network
                          )}
                        />
                      ) : (
                        <div className="w-8 h-8 flex-grow-0 flex-shrink-0">
                          <img
                            className="rounded-full"
                            src={avatar}
                            alt="default avatar"
                          />
                        </div>
                      )}
                      <div className="ml-4 text-xl font-semibold text-white font-urbanist truncate">
                        {primaryDomain?.name
                          ? primaryDomain.name + '.bnb'
                          : `${accounts[0].substring(
                              0,
                              6
                            )}....${accounts[0].substring(
                              accounts[0].length - 6,
                              accounts[0].length
                            )}`}
                      </div>
                    </div>
                  </div>
                  <div
                    className="font-semibold text-white font-urbanist text-[18px] text-center pt-4"
                    onClick={showAvatarPopup}
                  >
                    <div
                      className="items-center justify-center hidden h-10 font-semibold cursor-pointer md:flex hover:bg-dark-200 hover:rounded-xl"
                      onClick={moveToProfile}
                    >
                      Manage Account
                    </div>
                    <div
                      className="h-10 flex items-center justify-center cursor-pointer bg-[rgba(67,140,136,0.25)] rounded-xl md:bg-transparent hover:bg-dark-200 hover:rounded-xl"
                      onClick={disconnectProvider}
                    >
                      Disconnect
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            )}
          </div>
        </div>

        {searchOpen && (
          <div className="py-3 px-7 pb-7">
            <Search
              className="mx-auto"
              errorShowing={true}
              isShowSearchBtn={true}
              errorsStyling={false}
              suggestionClassName="w-full"
              isAbsolutePosition={false}
              onSubmit={() => {
                setSearchOpen(false)
              }}
            />
          </div>
        )}

        <div
          className={cn('md:hidden', isMenuOpen ? 'block mx-7 mt-3' : 'hidden')}
        >
          <ProfileCard
            className="mb-4"
            account={accounts?.[0]}
            isReadOnly={isReadOnly}
            networkId={networkId}
          />
        </div>
        {!isReadOnly && isMenuOpen && windowDimenion.winWidth < 768 && (
          <div className="px-7 border-t border-[rgba(204,252,255,0.2)] h-[calc(100vh-250px)]">
            <DomainList
              className="flex flex-col h-full mt-4"
              domainsList={domains}
              clickHandle={selectDomain}
              selectedDomain={selectedDomain}
            />
          </div>
        )}
      </div>

      {/* Footer component in the home page */}
      <div className="absolute bottom-0 left-0 flex items-center justify-center w-full py-5 h-11 md:px-8 xl:px-12 md:justify-between bg-dark-common">
        <a className="hidden md:block" href="https://space.id">
          <p className="text-base font-semibold leading-7 text-center text-green-100 font-urbanist">
            About SPACE ID
          </p>
        </a>
        <div className="flex items-center">
          <a target="_blank" href="https://twitter.com/SpaceIDProtocol">
            <TwitterIcon className="mr-2 text-green-100" />
          </a>
          <a target="_blank" href="https://discord.com/invite/2qrrf79K2A">
            <DiscordIcon className="mr-2 text-green-100" />
          </a>
          <a target="_blank" href="https://medium.com/@SpaceID">
            <RoundedIcon />
          </a>
        </div>
      </div>

      {children}
    </section>
  )
}
