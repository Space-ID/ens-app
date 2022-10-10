// Import packages
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useQuery, gql } from '@apollo/client'
import SID, { getSidAddress } from '@siddomains/sidjs'
import { ethers, getNetworkId } from '../../ui'
import { useHistory } from 'react-router-dom'

// Import components
import { NoPermissionEdit } from 'components/ErrorModals'
import { useAccount } from 'components/QueryAccount'
import Mainbar from './components/Mainbar'
import Sidebar from './components/Sidebar'
import ProfileCard from './components/Sidebar/ProfileCard'
import Drawer from 'components/Drawer'
import SmallLogoIcon from '../../components/Icons/SmallLogoIcon'
import DomainList from './components/Sidebar/DomainList'
import { HamburgerIcon } from 'components/Icons'

// Import redux Assets
import { toggleDrawer } from 'app/slices/uiSlice'
import { setSelectedDomain } from 'app/slices/domainSlice'

//Import Assets
import LogoText from '../../assets/images/space-logo-text.png'
import { isEmptyAddress } from '../../utils/records'
import { getProvider } from '../../ui'

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export default function Profile() {
  const haveNoPermissionToEdit = false
  const [sid, setSid] = useState(null)
  const [isAccountConnected, setIsAccountConnected] = useState(false)
  const [networkId, setNetworkId] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const account = useAccount()
  const selectedDomain = useSelector((state) => state.domain.selectedDomain)
  const isShowDrawer = useSelector((state) => state.ui.isShowDrawer)
  const domains = useSelector((state) => state.domain.domains)

  const { data } = useQuery(HOME_DATA, {
    variables: {
      address: account,
    },
  })

  const { displayName, isReadOnly, isSafeApp, network } = data

  useEffect(() => {
    const tAccountConnected = !isEmptyAddress(account)
    setIsAccountConnected(tAccountConnected)
    if (tAccountConnected) {
      sidSetup()
    }
  }, [account])

  const sidSetup = async () => {
    try {
      const networkId = await getNetworkId()
      setNetworkId(networkId)
      let provider
      try {
        provider = await getProvider()
      } catch (e) {
        const infura = process.env.REACT_APP_INFURA_URL
        provider = new ethers.providers.JsonRpcProvider(infura)
      }
      const tSid = new SID({
        provider,
        sidAddress: process.env.REACT_APP_REGISTRY_ADDRESS,
      })
      setSid(tSid)
    } catch (error) {
      console.log('tSid-error', error)
    }
  }

  const selectDomain = async (domain, index) => {
    dispatch(setSelectedDomain(domain))
  }

  // useEffect(() => {
  //   if (domains && domains.length === 0 && !selectedDomain) {
  //     history.push('/')
  //   }
  // }, [domains, selectedDomain])

  return (
    <div className="my-[86px]">
      <div className="flex justify-center mx-[10px] md:mx-0 px-[10px] 2xl:px-0">
        <Sidebar
          className="mr-[10px] 2xl:mr-[32px] hidden lg:block"
          isReadOnly={isReadOnly}
          displayName={displayName}
          isSafeApp={isSafeApp}
          network={network}
        />
        <Mainbar
          isAccountConnected={isAccountConnected}
          sid={sid}
          selectedDomain={selectedDomain}
          account={account}
          isReadOnly={isReadOnly}
          networkId={networkId}
        />
      </div>
      <Drawer
        width="420px"
        show={isShowDrawer}
        closeDrawer={() => dispatch(toggleDrawer(false))}
      >
        <div className="pr-9 pl-[64px] py-5">
          <div className="flex items-center">
            <div onClick={() => dispatch(toggleDrawer(false))}>
              <HamburgerIcon size={25} className="text-green-100" />
            </div>
            <SmallLogoIcon size={40} className="ml-5 text-green-100" />
            <div className="ml-5">
              <img src={LogoText} alt="logoText" />
            </div>
          </div>
          <div className="mt-[40px]">
            <ProfileCard
              className="mb-4"
              account={account}
              isReadOnly={isReadOnly}
              networkId={networkId}
            />
          </div>
          <div>
            <div className="border-t border-[rgba(204,252,255,0.2)]">
              <DomainList
                className="flex flex-col h-full mt-4"
                domainsList={domains}
                clickHandle={selectDomain}
                selectedDomain={selectedDomain}
              />
            </div>
          </div>
        </div>
      </Drawer>
      {haveNoPermissionToEdit && <NoPermissionEdit />}
    </div>
  )
}
