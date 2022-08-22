import styled from '@emotion/styled/macro'
import mq from 'mediaQuery'

export const H2 = styled('h2')`
  font-size: 18px;
  font-weight: 500;
  color: #adbbcd;
  ${mq.medium`
    font-size: 22px;
  `}
`

export const Title = styled('h2')`
  font-size: 24px;
  font-weight: 100;
  padding: 0;
  margin: 0;
  color: #379070;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`

export const HR = styled('hr')`
  border: 0;
  border-top: 1px solid #5ED6AB;
  background-color: #fff;
  margin-bottom: 30px;
  margin-top: 0;
`
