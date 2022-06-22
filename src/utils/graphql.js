import get from 'lodash/get'
import { decryptName } from '../api/labels'

export function refetchTilUpdated(
  refetch,
  interval,
  keyToCompare,
  name,
  prevData,
  getterString
) {
  let maxTries = 10
  let tries = maxTries
  let incrementedInterval = interval

  function recurseRefetch() {
    if (tries > 0) {
      return setTimeout(() => {
        tries--
        incrementedInterval = interval * (maxTries - tries + 1)
        refetch().then(({ data }) => {
          const updated =
            get(data, getterString)?.find(item => {
              return decryptName(item.domain.name) === name
            })[keyToCompare] !==
            get(prevData, getterString)?.find(item => {
              return decryptName(item.domain.name) === name
            })[keyToCompare]

          if (updated) return
          return recurseRefetch()
        })
      }, incrementedInterval)
    }
    return
  }

  recurseRefetch()
}

export function refetchTilUpdatedSingle({ refetch, interval, prevData }) {
  let maxTries = 10
  let tries = maxTries
  let incrementedInterval = interval

  function recurseRefetch() {
    if (tries > 0) {
      return setTimeout(() => {
        tries--
        incrementedInterval = interval * (maxTries - tries + 1)
        refetch().then(data => {
          const updated = prevData !== data
          if (updated) return
          return recurseRefetch()
        })
      }, incrementedInterval)
    }
    return
  }

  recurseRefetch()
}

export const getQueryName = document => document.definitions[0]?.name?.value
