import React from 'react'
import styled from '@emotion/styled/macro'
import { Link } from 'react-router-dom'
import mq from 'mediaQuery'

import ENSLogo from '../assets/ensIconLogo.svg'
import LogoTyped from '../assets/TypeLogo'

const IconLogo = styled('img')`
  width: 228px;
`

const LogoContainer = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: auto;
  height: 100%;
  margin-right: 34px;
`

const Logo = ({ color, className, to = '' }) => (
  <LogoContainer className={className} to={to}>
    <IconLogo src={ENSLogo} />
    {/*<LogoTyped color={color} />*/}
  </LogoContainer>
)

export default Logo
