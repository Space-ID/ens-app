import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { EMPTY_ADDRESS } from '../../utils/records'
import NameDetails from './NameDetails'

function isRegistrationOpen(available, parent) {
  return parent === 'bnb' && available
}
function isShowPremium(available, expiryTime) {
  if (expiryTime && available) {
    const start = moment(expiryTime).add(90, 'd')
    const now = moment()
    return start.isSameOrBefore(now) && start.add(21, 'd').isSameOrAfter(now)
  }
  return false
}

function isDNSRegistrationOpen(domain) {
  const nameArray = domain.name?.split('.')
  if (nameArray?.length !== 2 || nameArray?.[1] === 'bnb') {
    return false
  }
  return domain.isDNSRegistrar && domain.owner === EMPTY_ADDRESS
}

function isOwnerOfDomain(domain, account) {
  if (domain.owner !== EMPTY_ADDRESS && !domain.available) {
    return domain.owner?.toLowerCase() === account?.toLowerCase()
  }
  return false
}

const NAME_REGISTER_DATA_WRAPPER = gql`
  query nameRegisterDataWrapper @client {
    accounts
    networkId
  }
`

export const useRefreshComponent = () => {
  const [key, setKey] = useState(0)
  const {
    data: { accounts, networkId },
  } = useQuery(NAME_REGISTER_DATA_WRAPPER)
  const mainAccount = accounts?.[0]
  useEffect(() => {
    setKey((x) => x + 1)
  }, [mainAccount, networkId])
  return key
}

const NAME_QUERY = gql`
  query nameQuery {
    accounts @client
  }
`

function Name({ details: domain, name, pathname, type, refetch }) {
  const {
    data: { accounts },
  } = useQuery(NAME_QUERY)

  const account = accounts?.[0]
  const registrationOpen = isRegistrationOpen(domain.available, domain.parent)
  // todo test
  if (process.env.REACT_APP_MODE === 'stg') {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    const expire = params.get('expire')
    if (expire) {
      domain.expiryTime = moment(Number(expire)).toDate()
    }
  }
  // end
  const showPremium = isShowPremium(domain.available, domain.expiryTime)
  const preferredTab = registrationOpen ? 'register' : 'details'

  return (
    <div className="font-urbanist">
      <div className="h-full min-h-[100vh] flex items-center justify-center py-[84px]">
        <NameDetails
          tab={preferredTab}
          domain={domain}
          pathname={pathname}
          name={name}
          refetch={refetch}
          account={account}
          registrationOpen={registrationOpen}
          showPremium={showPremium}
        />
      </div>
    </div>
  )
}

export default Name
