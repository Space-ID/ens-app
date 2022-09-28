import React, { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { EMPTY_ADDRESS } from '../../utils/records'
import NameDetails from './NameDetails'
import DNSNameRegister from './DNSNameRegister'
import ShortName from './ShortName'
import { isOwnerOfParentDomain } from '../../utils/utils'

function isRegistrationOpen(available, parent) {
  return parent === 'bnb' && available
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
  const isOwner = isOwnerOfDomain(domain, account)
  const isOwnerOfParent = isOwnerOfParentDomain(domain, account)
  const isDeedOwner = domain.deedOwner === account
  const isRegistrant = !domain.available && domain.registrant === account

  const registrationOpen = isRegistrationOpen(domain.available, domain.parent)
  const preferredTab = registrationOpen ? 'register' : 'details'

  let ownerType,
    registrarAddress = domain.parentOwner
  if (isDeedOwner || isRegistrant) {
    ownerType = 'Registrant'
  } else if (isOwner) {
    ownerType = 'Controller'
  }
  let containerState
  if (isDNSRegistrationOpen(domain)) {
    containerState = 'Open'
  } else {
    containerState = isOwner ? 'Yours' : domain.state
  }

  return (
    <div className="font-urbanist">
      <div className="h-full min-h-[100vh] flex items-center justify-center py-[84px]">
        {isDNSRegistrationOpen(domain) ? (
          <DNSNameRegister
            domain={domain}
            registrarAddress={registrarAddress}
            pathname={pathname}
            refetch={refetch}
            account={account}
            readOnly={account === EMPTY_ADDRESS}
          />
        ) : type === 'short' && domain.owner === EMPTY_ADDRESS ? ( // check it's short and hasn't been claimed already
          <ShortName name={name} />
        ) : (
          <NameDetails
            tab={preferredTab}
            domain={domain}
            pathname={pathname}
            name={name}
            isOwner={isOwner}
            isOwnerOfParent={isOwnerOfParent}
            refetch={refetch}
            account={account}
            registrationOpen={registrationOpen}
          />
        )}
      </div>
    </div>
  )
}

export default Name
