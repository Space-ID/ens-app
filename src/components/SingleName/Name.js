import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled/macro'
import { useTranslation } from 'react-i18next'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client'

import { useMediaMax, useMediaMin } from 'mediaQuery'
import { EMPTY_ADDRESS } from '../../utils/records'
import { Title } from '../Typography/Basic'
import TopBar from '../Basic/TopBar'
import DefaultFavourite from '../AddFavourite/Favourite'
import NameDetails from './NameDetails'
import DNSNameRegister from './DNSNameRegister'
import ShortName from './ShortName'
import Tabs from './Tabs'
import NameContainer from '../Basic/MainContainer'
import Copy from '../CopyToClipboard/'
import { isOwnerOfParentDomain } from '../../utils/utils'

const Container = styled('div')`
  font-family: Urbanist;
`

const Owner = styled('div')`
  color: #ccd4da;
  margin-right: 20px;
  @media (max-width: 768px) {
    display: none;
  }
`

const RightBar = styled('div')`
  display: flex;
  align-items: center;
`

const SingleNameContainer = styled('div')`
  color: #47c799;
  font-size: 24px;
  margin-bottom: 11px;
  margin-left: 12px;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const TitleContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Favourite = styled(DefaultFavourite)``

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
    data: { accounts, networkId }
  } = useQuery(NAME_REGISTER_DATA_WRAPPER)
  const mainAccount = accounts?.[0]
  useEffect(() => {
    setKey(x => x + 1)
  }, [mainAccount, networkId])
  return key
}

const NAME_QUERY = gql`
  query nameQuery {
    accounts @client
  }
`

function Name({ details: domain, name, pathname, type, refetch }) {
  const { t } = useTranslation()
  const mediumBP = useMediaMax('medium')
  const percentDone = 0

  const {
    data: { accounts }
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

  const key = useRefreshComponent()

  return (
    <Container>
      <SingleNameContainer>Names</SingleNameContainer>
      <NameContainer state={containerState} key={key}>
        <TopBar percentDone={percentDone}>
          <TitleContainer>
            <Title>
              {domain?.decrypted
                ? name
                : '[unknown' +
                  domain.name?.split('.')[0].slice(1, 11) +
                  ']' +
                  '.' +
                  domain.parent}
              <Copy
                value={
                  domain?.decrypted
                    ? name
                    : '[unknown' +
                      domain.name?.split('.')[0].slice(1, 11) +
                      ']' +
                      '.' +
                      domain.parent
                }
              />
            </Title>
            {mediumBP && <Favourite domain={domain} />}
          </TitleContainer>

          <RightBar>
            {!!ownerType && (
              <Owner data-testid="owner-type">
                {ownerType === 'Registrant'
                  ? t('c.registrant')
                  : t('c.Controller')}
              </Owner>
            )}
            {!mediumBP && <Favourite domain={domain} />}
            <Tabs
              pathname={pathname}
              tab={preferredTab}
              domain={domain}
              parent={domain.parent}
            />
          </RightBar>
        </TopBar>

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
      </NameContainer>
    </Container>
  )
}

export default Name
