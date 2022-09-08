// Import packages
import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { useMutation } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { isEmptyAddress } from 'utils/records'

// Import components
import ChangePrimaryDomain from 'components/Modal/ChangePrimaryDomain'
import PendingTx from 'components/PendingTx'

//Import graphql queries
import { GET_REVERSE_RECORD } from 'graphql/queries'
import { SET_NAME } from 'graphql/mutations'
import { refetchTilUpdatedSingleForPrimaryKey } from 'utils/graphql'

//Import custom functions
import { useQuery, gql } from '@apollo/client'
import { convertToETHAddressDisplayFormat } from 'utils/utils'
import { useEditable } from 'components/hooks'

//Import Redux
import { setAllDomains } from 'app/slices/domainSlice'

//Import assets
import DefaultAvatar from 'assets/images/default-avatar.png'

export const GET_ACCOUNT = gql`
  query getAccounts @client {
    accounts
  }
`

export default function ProfileCard({
  className,
  account,
  isReadOnly,
  networkId,
}) {
  const [isShowChangePrimaryModal, setIsShowChangePrimaryModal] =
    useState(false)
  const domains = useSelector((state) => state.domain.domains)

  const dispatch = useDispatch()

  const primaryDomain = domains.filter((item) => item.isPrimary)

  const { actions, state } = useEditable()

  const { startPending, setConfirmed } = actions
  const { pending, txHash } = state

  useEffect(() => {
    if (
      !isReadOnly &&
      domains.length === 0 &&
      !isEmptyAddress(account) &&
      networkId === process.env.REACT_APP_NETWORK_CHAIN_ID
    ) {
      fetchPrimaryDomain()
    }
  }, [isReadOnly, networkId, account])

  const {
    data: { accounts },
  } = useQuery(GET_ACCOUNT)

  const { data: { getReverseRecord } = {}, loading: reverseRecordLoading } =
    useQuery(GET_REVERSE_RECORD, {
      variables: {
        address: accounts?.[0],
      },
      skip: !accounts?.length,
    })

  const [setName] = useMutation(SET_NAME, {
    onCompleted: (data) => {
      if (Object.values(data)[0]) {
        startPending(Object.values(data)[0])
        setIsShowChangePrimaryModal(false)
      }
    },
  })

  const changePrimaryDomain = (param) => {
    setName({ variables: { name: param.value } })
  }

  const refetchPrimaryDomain = async () => {
    const params = {
      ChainID: networkId,
      Address: account,
    }
    let result = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/listname`,
      params
    )
    const data = result?.data?.map((item) => {
      const date = new Date(item?.expires)
      return {
        expires_at: date.toISOString(),
        ...item,
      }
    })
    return data
  }

  const fetchPrimaryDomain = async () => {
    const result = await refetchPrimaryDomain()
    dispatch(setAllDomains(result))
  }

  const refetchForPrimaryDomain = async () => {
    console.log('refetchForPrimaryDomain')
    await fetchPrimaryDomain()
    setConfirmed()
  }

  return (
    <div
      className={cn(
        'flex 1400px:min-w-[320px] account-profile-bg rounded-2xl p-4 items-center',
        className
      )}
    >
      {account ? (
        <div className="mr-4 flex-none w-[64px] h-[64px]">
          {!reverseRecordLoading &&
          getReverseRecord &&
          getReverseRecord.avatar ? (
            <img
              src={imageUrl(getReverseRecord.avatar, displayName, network)}
            />
          ) : (
            <div className="w-16 h-16 rounded-full ">
              <img
                className="rounded-full"
                src={DefaultAvatar}
                alt="default avatar"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-none w-10 mr-4 xl:w-8" />
      )}

      <div className="w-full">
        {!isReadOnly && account ? (
          <div className="text-white font-semibold text-[18px]">
            {convertToETHAddressDisplayFormat(account)}
          </div>
        ) : (
          <div className="text-white font-semibold text-[18px]">
            (Unconnected)
          </div>
        )}

        <div>
          <span className="text-xs text-white">Primary SPACE ID Name:</span>
        </div>
        {account && !isReadOnly ? (
          <div className="w-full">
            {pending ? (
              <PendingTx
                txHash={txHash}
                labelClassName="text-xs"
                onConfirmed={async () => {
                  refetchTilUpdatedSingleForPrimaryKey({
                    refetch: refetchPrimaryDomain,
                    refetchForPrimaryDomain: refetchForPrimaryDomain,
                    interval: 1000,
                    keyToCompare: 'name',
                    prevData:
                      primaryDomain && primaryDomain.length > 0
                        ? primaryDomain?.[0]
                        : '',
                  })
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center mt-[5px] justify-between">
                {primaryDomain && primaryDomain.length === 0 ? (
                  <button
                    className="px-2 text-xs font-semibold text-white rounded-full bg-dark-400"
                    onClick={() => {
                      setIsShowChangePrimaryModal(true)
                    }}
                  >
                    Add Primary domain
                  </button>
                ) : (
                  <div className="flex justify-between w-full">
                    <div className="text-green-100 text-[14px] truncate max-w-[120px]">
                      {primaryDomain[0].name + '.bnb'}
                    </div>
                    <button
                      className="px-2 text-xs font-semibold text-white rounded-full bg-dark-400"
                      onClick={() => {
                        setIsShowChangePrimaryModal(true)
                      }}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-white">-</div>
        )}
        <ChangePrimaryDomain
          show={isShowChangePrimaryModal}
          saveHandler={changePrimaryDomain}
          closeModal={() => setIsShowChangePrimaryModal(false)}
          domains={domains}
        />
      </div>
    </div>
  )
}
