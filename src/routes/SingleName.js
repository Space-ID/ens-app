import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { toArray } from 'lodash'

import { validateName, validateDomain } from '../utils/utils'
import { GET_SINGLE_NAME } from '../graphql/queries'
import Loader from '../components/Loader'
import SearchErrors from '../components/SearchErrors/SearchErrors'
import Name from '../components/SingleName/Name'

const SINGLE_NAME = gql`
  query singleNameQuery @client {
    isENSReady
    networkId
  }
`

function SingleName({
  match: {
    params: { name: searchTerm },
  },
  location: { pathname },
}) {
  let history = useHistory()
  const [valid, setValid] = useState(undefined)
  const [type, setType] = useState(undefined)
  const [name, setNormalizedName] = useState('')
  let errorMessage
  const {
    data: { isENSReady },
  } = useQuery(SINGLE_NAME)
  const { data, loading, error, refetch } = useQuery(GET_SINGLE_NAME, {
    variables: { name },
    fetchPolicy: 'no-cache',
    context: {
      queryDeduplication: false,
    },
  })

  useEffect(() => {
    let normalizedName
    if (isENSReady) {
      let domain = searchTerm
      let suffix = ''
      let i = domain.lastIndexOf('.')
      if (i > 0) {
        domain = searchTerm.substring(0, i)
        suffix = searchTerm.substring(i)
      }
      if (
        suffix !== '.bnb' ||
        toArray(domain).length < 3 ||
        !validateDomain(domain)
      ) {
        setValid(false)
        setType('invalid')
        history.replace('/404')
      } else {
        try {
          normalizedName = validateName(searchTerm)
          setNormalizedName(normalizedName)
        } catch {
          document.title = 'Error finding name'
        } finally {
          setValid(true)
        }
      }
    }
  }, [searchTerm, isENSReady])

  if (valid) {
    if (loading) return <Loader large center />
    if (error) return <div>{(console.log(error), JSON.stringify(error))}</div>
    if (data?.singleName)
      return (
        <>
          <Name
            details={data.singleName}
            name={name}
            pathname={pathname}
            type={type}
            refetch={refetch}
          />
        </>
      )
  }

  if (valid === false) {
    if (type === 'invalid') {
      errorMessage = 'domainMalformed'
    } else if (type === 'short') {
      errorMessage = 'tooShort'
    } else {
      errorMessage = type
    }
    return (
      <SearchErrors errors={[errorMessage]} searchTerm={name || searchTerm} />
    )
  } else {
    return <Loader large center />
  }
}

export default SingleName
