import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { GET_TRANSACTION_HISTORY } from 'graphql/queries'
import { last } from 'lodash'

const useTransaction = () => {
  const [txHash, setTxHash] = useState('')
  const [txState, setTxState] = useState({ confirmed: false, error: false })
  const { data: { transactionHistory } = {} } = useQuery(
    GET_TRANSACTION_HISTORY
  )
  useEffect(() => {
    const lastTransaction = last(transactionHistory)
    if (
      lastTransaction &&
      lastTransaction.txHash === txHash &&
      lastTransaction.txState === 'Confirmed'
    ) {
      setTxState({ confirmed: true, error: false })
    }
    if (
      lastTransaction &&
      lastTransaction.txHash === txHash &&
      lastTransaction.txState === 'Error'
    ) {
      setTxState({ confirmed: false, error: true })
    }
  }, [transactionHistory, txHash])
  return [txState, setTxHash]
}

export default useTransaction
