import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'

import mq from 'mediaQuery'

const TabLink = styled(Link)`
  font-size: 18px;
  background: ${({ active }) => (active ? '#5ED6AB' : 'transparent')};
  color: ${({ active }) => (active ? 'white!important' : '#B1B1B1 !important')};
  transform: scale(${({ active }) => (active ? '1.08' : '1')});
  transition: background 0.1s ease-out, transform 0.3s ease-out;
  padding: 5px 23px;
  border-radius: 10px;
  overflow: hidden;
  padding: 5px 28px;
  &:hover {
    background: #5ed6ab;
    color: white !important;
  }
  @media (max-width: 768px) {
    padding: 5px 22px;
    font-size: 14px;
  }
`

const TabContainer = styled('div')`
  display: inline-flex;
  justify-content: flex-start;
  border-radius: 4px;
  margin-left: 20px;

  @media (max-width: 768px) {
    margin-top: 16px;
    margin-right: 0;
    margin-left: 0;
  }
`
function getDetailsActive(domain, pathname, tab) {
  const { name } = domain
  if (domain.parent !== 'eth') {
    return (
      pathname !== `/app/name/${name}/register` &&
      pathname !== `/app/name/${name}/subdomains`
    )
  } else {
    return (
      (tab === 'details' || pathname === `/app/name/${name}/details`) &&
      pathname !== `/app/name/${name}/register` &&
      pathname !== `/app/name/${name}/subdomains`
    )
  }
}
const Tabs = ({ domain, pathname, parent, tab }) => {
  const { t } = useTranslation()
  const { name, state } = domain
  return (
    (state !== 'Auction' || state !== 'Reveal') && (
      <TabContainer>
        {parent === 'bnb' && (
          <TabLink
            active={
              (tab === 'register' ||
                pathname === `/app/name/${name}/register`) &&
              pathname !== `/app/name/${name}/details` &&
              pathname !== `/app/name/${name}/subdomains`
            }
            to={`/app/name/${name}/register`}
          >
            {t('singleName.tabs.register')}
          </TabLink>
        )}

        <TabLink
          active={getDetailsActive(domain, pathname, tab)}
          to={`/app/name/${name}/details`}
        >
          {t('singleName.tabs.details')}
        </TabLink>
        <TabLink
          active={pathname === `/app/name/${name}/subdomains`}
          to={`/app/name/${name}/subdomains`}
        >
          {t('singleName.tabs.subdomains')}
        </TabLink>
      </TabContainer>
    )
  )
}
export default Tabs
