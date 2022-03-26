import React from 'react'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled/macro'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import mq from 'mediaQuery'

import SearchDefault from '../components/SearchName/Search'
import NoAccountsDefault from '../components/NoAccounts/NoAccountsModal'
import bg from '../assets/heroBG.jpg'
import testLogo from '../assets/textLogo.png'
import TextBubbleDefault from '../components/Icons/TextBubble'
import QuestionMarkDefault from '../components/Icons/QuestionMark'
import HowToUseDefault from '../components/HowToUse/HowToUse'
import ENSLogo from '../components/HomePage/images/ENSLogo.svg'
import { aboutPageURL } from '../utils/utils'
import { connectProvider, disconnectProvider } from '../utils/providerUtils'
import { gql } from '@apollo/client'
import {
  MainPageBannerContainer,
  DAOBannerContent
} from '../components/Banner/DAOBanner'

const HeroTop = styled('div')`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  grid-template-columns: 1fr;
  ${mq.small`
     grid-template-columns: 1fr 1fr;
  `}
`

const NoAccounts = styled(NoAccountsDefault)`
  margin-top: 0;
`

const Network = styled('div')`
  margin-left: 20px;
  color: #25ffb1;
`
const Name = styled('span')`
  margin-left: 5px;
  text-transform: none;
  display: inline-block;
  width: 100px;
`

const NetworkStatus = styled('div')`
  flex: 1;
  color: white;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  text-transform: capitalize;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
  ${mq.small`
    display: none;
  `}
  ${mq.medium`
    left: 40px;
  `}

  &:before {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translate(-5px, -50%);
    content: '';
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }
`

const Nav = styled('div')`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  ${mq.small`
    justify-content: flex-end;
  `}
  a {
    font-weight: 700;
    color: white;
  }
`

const NavLink = styled(Link)`
  margin-left: 20px;
  color: #25ffb1 !important;
  &:first-child {
    margin-left: 0;
  }
`

const ExternalLink = styled('a')`
  margin-left: 20px;
  color: #25ffb1 !important;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  &:first-child {
    margin-left: 0;
  }
`

const Announcement = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: #5284ff;
  padding: 0 10px;
  border-bottom: #5284ff solid 3px;
  h3 {
    color: white;
    font-weight: 400;
    text-align: center;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  p {
    text-align: center;
    color: white;
  }
  a {
    color: white;
    text-decoration: none;
  }
`

const HowToUse = styled(HowToUseDefault)`
  padding: 70px;
`

const Hero = styled('section')`
  background: url(${bg});
  background-size: cover;
  padding: 60px 20px 20px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  ${mq.medium`
    padding: 0 20px 0;
  `}
`

const SearchContainer = styled('div')`
  margin: 0 auto 0;
  display: flex;
  flex-direction: column;
  min-width: 100%;
  ${mq.medium`
    min-width: 60%;
  `}
  > h2 {
    color: white;
    font-size: 38px;
    font-weight: 100;
    margin-bottom: 10px;
  }

  > h3 {
    color: white;
    font-weight: 100;
    font-size: 24px;
    margin-top: 0;
  }
`

const Search = styled(SearchDefault)`
  min-width: 90%;
  border-radius: 16px;
  background: rgba(147, 196, 178, 0.08);
  border: 3px solid #25ffb1;
  // overflow: hidden;
  height: 54px;
  ${mq.medium`
    min-width: 780px;
  `}

  input {
    width: 100%;
    border-radius: 0px;
    background: rgba(147, 196, 178, 0.08);
    box-sizing: border-box;
    color: #25ffb1;
    &::placeholder {
      color: rgba(147, 255, 216, 0.5);
    }
    ${mq.medium`
      border-radius: 6px 0 0 6px;
      font-size: 20px;
    `}
  }

  button {
    border-radius: 0 6px 6px 0;
    background: rgba(147, 196, 178, 0.08);
  }
`

const Explanation = styled('div')`
  display: grid;
  width: 100%;

  grid-template-columns: 1fr;
  grid-template-rows: auto;
  ${mq.medium`
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  `}
  grid-gap: 0;
`

const H2 = styled('h2')`
  font-size: 30px;
  font-weight: 500;
`

const Section = styled('section')`
  display: flex;
  justify-content: center;
  align-items: center;
`

const WhatItIs = styled(Section)`
  padding: 40px 20px 80px;
  p {
    font-size: 18px;
  }
`

const HowItWorks = styled(Section)`
  background: #f0f6fa;
  padding: 40px 20px 80px;
`

const Inner = styled('div')`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 350px;

  > p {
    font-weight: 300;
    font-size: 20px;
    margin-bottom: 1.5em;
  }
`
const NameAnimation = styled(Section)`
  display: block;
  height: 100%;
`

const TextBubble = styled(TextBubbleDefault)`
  margin-right: 10px;
`

const QuestionMark = styled(QuestionMarkDefault)`
  transform: scale(1.18);
  margin-right: 10px;
`

const LogoLarge = styled(motion.img)`
  width: 50%;
  margin: 0 auto 0;
  ${mq.medium`
    width: 120px;
  `}
`

const PermanentRegistrarLogo = styled(motion.h1)`
  font-family: Overpass;
  font-weight: 800;
  font-size: 18px;
  text-transform: uppercase;
  color: #4258d3;
  letter-spacing: 1.8px;
  text-align: right;
  line-height: 24px;
  margin-top: 10px;
  margin-bottom: 50px;
  text-align: center;
`

const ReadOnly = styled('span')`
  margin-left: 1em;
`

export const HOME_DATA = gql`
  query getHomeData($address: string) @client {
    network
    displayName(address: $address)
    isReadOnly
    isSafeApp
  }
`

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

const TextLogo = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  @media (max-width: 768px) {
    display: none;
  }
  img {
    object-fit: contain;
  }
`

const animation = {
  initial: {
    scale: 0,
    opacity: 0
  },
  animate: {
    opacity: 1,
    scale: 1
  }
}

export default ({ match }) => {
  const { url } = match
  const { t } = useTranslation()

  const {
    data: { accounts }
  } = useQuery(GET_ACCOUNT)

  const {
    data: { network, displayName, isReadOnly, isSafeApp }
  } = useQuery(HOME_DATA, {
    variables: { address: accounts?.[0] }
  })

  return (
    <Hero>
      <HeroTop>
        <NetworkStatus>
          {!isSafeApp && (
            <NoAccounts
              onClick={isReadOnly ? connectProvider : disconnectProvider}
              buttonText={isReadOnly ? t('c.connect') : t('c.disconnect')}
            />
          )}
          <Network>
            {`${network} ${t('c.network')}`}
            {isReadOnly && <ReadOnly>({t('c.readonly')})</ReadOnly>}
            {!isReadOnly && displayName && (
              <Name data-testid="display-name">({displayName})</Name>
            )}
          </Network>
        </NetworkStatus>
        <TextLogo>
          <img src={testLogo} style={{ width: 190 }} />
        </TextLogo>
        <Nav>
          {accounts?.length > 0 && !isReadOnly && (
            <NavLink
              active={url === '/address/' + accounts[0]}
              to={'/address/' + accounts[0]}
            >
              {t('c.mynames')}
            </NavLink>
          )}
          <NavLink to="/favourites">{t('c.favourites')}</NavLink>
          <ExternalLink href={aboutPageURL()}>{t('c.about')}</ExternalLink>
        </Nav>
      </HeroTop>
      <SearchContainer>
        <>
          <LogoLarge
            initial={animation.initial}
            animate={animation.animate}
            src={ENSLogo}
            alt="ENS logo"
          />
          <PermanentRegistrarLogo
            initial={animation.initial}
            animate={animation.animate}
          />
          <Search />
        </>
      </SearchContainer>
    </Hero>
  )
}
