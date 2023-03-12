import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import AddFavourite from '../AddFavourite/AddFavourite'
import { useAccount } from '../QueryAccount'
import ExpiryDate from './ExpiryDate'
import Loader from '../Loader'
import { humaniseName } from '../../utils/utils'
import Checkbox from '../Forms/Checkbox'
import warningImage from '../../assets/warning.svg'

import mq, { useMediaMin, useMediaMax } from 'mediaQuery'

const CheckBoxContainer = styled('div')`
  margin-left: 24px;
  @media (max-width: 768px) {
    margin-left: 21px;
  }
`

const Container = styled.div`
  position: relative;
  background-color: white;
  border-radius: 20px;
  box-shadow: 3px 4px 20px 0 rgba(144, 171, 191, 0.42);
  padding: ${(p) => (p.hasInvalidCharacter ? '20' : '0')}px;
  padding-left: 0px;
`

const DomainContainer = styled(Link)`
  width: 100%;
  padding: 18px 28px;
  color: #379170;
  overflow: hidden;
  position: relative;
  background: ${({ percentDone }) =>
    percentDone
      ? `
  linear-gradient(to right, rgba(128, 255, 128, 0.1) 0%, rgba(82,229,255, 0.1) ${percentDone}%,#ffffff ${percentDone}%)`
      : '#F0F7F4;'};
  height: 65px;
  display: flex;
  justify-content: space-between;
  height: auto;
  align-items: center;
  font-size: 22px;
  font-weight: 500;
  line-height: 29px;
  margin-bottom: 4px;
  transition: 0.2s all;
  border-radius: 20px;
  border: 2px solid #18e199;

  ${mq.medium`
    grid-template-columns: 1fr minmax(150px,350px) 100px 50px 50px;
    grid-template-rows: 39px;
  `}

  color: #2b2b2b;
  z-index: 1;
  .label-container {
    display: flex;
  }

  &:visited {
    color: #2b2b2b;
  }
`

const RightContainer = styled('div')`
  display: flex;
  align-items: center;
  order: 3;
  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`

const SecondContainer = styled('div')`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    display: block;
  }
`

const DomainName = styled('div')`
  font-size: 18px;
  font-weight: 100;

  font-family: 'Urbanist'
  ${mq.medium`
    font-size: 24px;

  `}

  color: ${(p) => {
    switch (p.state) {
      case 'Yours':
      case 'Owned':
        return '#379070'
      default:
        return '#379070'
    }
  }};
`

const LabelContainer = styled('div')`
  margin-right: 20px;
  font-size: 16px;
  color: #ccd4da;
  display: none;
  align-items: center;
  order: 2;
`

const LabelText = styled('div')``

const Label = ({ domain, isOwner }) => {
  const { t } = useTranslation()
  let text
  switch (domain.state) {
    case 'Open':
      text = t('singleName.domain.state.available')
      break
    case 'Auction':
      text = t('singleName.domain.state.auction')
      break
    case 'Owned':
      text = t('singleName.domain.state.owned')
      break
    default:
      text = t('singleName.domain.state.default')
  }

  if (isOwner) {
    text = t('singleName.domain.state.owned')
  }

  return (
    <LabelContainer className="label-container">
      <LabelText>{text}</LabelText>
    </LabelContainer>
  )
}

const WarningImg = styled('img')`
  width: 16px;
  height: 16px;
  margin-bottom: 4px;
  margin-right: 4px;
`

const WarningContainer = styled.div`
  font-size: 16px;
  display: flex;
  background-color: white;
  margin-top: -10px;
  margin-left: 2px;
  align-items: center;
  justify-content: flex-start;
  color: black;
  font-weight: 100;
  padding: 10px 0px 10px 20px;

  & a:hover {
    color: #2c46a6;
  }
`

const Domain = ({
  domain,
  isSubDomain,
  className,
  isFavourite,
  loading,
  checkedBoxes = {},
  setCheckedBoxes,
  setSelectAll,
  hasInvalidCharacter,
}) => {
  const mediumBP = useMediaMax('medium')
  if (loading) {
    return (
      <DomainContainer state={'Owned'} className={className} to="">
        <Loader />
      </DomainContainer>
    )
  }
  const account = useAccount()
  let isOwner = false
  if (!domain.available && domain.owner && parseInt(domain.owner, 16) !== 0) {
    isOwner =
      account &&
      domain.owner &&
      domain.owner.toLowerCase() === account.toLowerCase()
  }
  const percentDone = 0
  let expiryDate = domain.expiryDate
  if (domain.expiryTime) {
    expiryDate = parseInt(domain.expiryTime.getTime() / 1000)
  }
  return (
    <Container
      state={isOwner ? 'Yours' : domain.state}
      hasInvalidCharacter={hasInvalidCharacter}
    >
      {hasInvalidCharacter && (
        <WarningContainer>
          <WarningImg src={warningImage} onClick={(e) => e.preventDefault()} />
          <span>
            <span onClick={(e) => e.preventDefault()}>
              This name is invalid.{' '}
            </span>
            <a href="https://docs.ens.domains/frequently-asked-questions#what-about-foreign-characters-what-about-upper-case-letters-is-any-unicode-character-valid">
              Learn more
            </a>
          </span>
        </WarningContainer>
      )}
      <DomainContainer
        to={`/app/name/${domain.name}`}
        className={className}
        percentDone={percentDone}
        data-testid={`domain-${domain.name}`}
      >
        <DomainName state={isOwner ? 'Yours' : domain.state}>
          {humaniseName(domain.name)}
          {mediumBP && !hasInvalidCharacter && (
            <Label domain={domain} isOwner={isOwner} />
          )}
        </DomainName>
        <SecondContainer>
          <RightContainer>
            <AddFavourite
              domain={domain}
              isSubDomain={isSubDomain}
              isFavourite={isFavourite}
            />
            {expiryDate && (
              <CheckBoxContainer>
                <Checkbox
                  testid={`checkbox-${domain.name}`}
                  checked={checkedBoxes[domain.name]}
                  onClick={(e) => {
                    e.preventDefault()
                    setCheckedBoxes &&
                      setCheckedBoxes((prevState) => {
                        return {
                          ...prevState,
                          [domain.name]: !prevState[domain.name],
                        }
                      })
                    if (checkedBoxes[domain.name]) {
                      setSelectAll(false)
                    }
                  }}
                />
              </CheckBoxContainer>
            )}
          </RightContainer>
          {!mediumBP && !hasInvalidCharacter && (
            <Label domain={domain} isOwner={isOwner} />
          )}
          <ExpiryDate expiryDate={expiryDate} name={domain.name} />
        </SecondContainer>
      </DomainContainer>
    </Container>
  )
}

export default Domain
