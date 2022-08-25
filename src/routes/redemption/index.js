import React from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/client'
import Search from 'components/SearchName/Search'
import { SpaceIDTextIcon } from 'components/Icons'

import { useAccount } from 'components/QueryAccount'
import { GET_ELIGIBLE_COUNT } from '../../graphql/queries'

export default function Redemption() {
  const searchingDomainName = useSelector(
    (state) => state.domain.searchingDomainName
  )

  const account = useAccount()

  const { data } = useQuery(GET_ELIGIBLE_COUNT, {
    variables: {
      account,
    },
    fetchPolicy: 'no-cache',
  })

  console.log('data', data)

  return (
    <div className="py-[84px] mx-auto min-w-[100%] md:min-w-[60%] min-h-[100vh] flex items-center justify-center">
      <div className="min-h-[202px]">
        <div className="flex justify-center mb-7">
          <SpaceIDTextIcon />
        </div>
        <Search
          className="px-7 md:px-0 md:w-[600px] mx-auto"
          searchingDomainName={searchingDomainName}
        />
      </div>
    </div>
  )
}
