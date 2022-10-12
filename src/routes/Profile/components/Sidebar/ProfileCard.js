// Import packages
import React, { useState, useEffect, useRef } from 'react'
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

//Import custom functions
import { useQuery, gql } from '@apollo/client'
import { convertToETHAddressDisplayFormat, getDomainNftUrl } from 'utils/utils'
import { useEditable } from 'components/hooks'

//Import assets
import DefaultAvatar from 'assets/images/default-avatar.png'
import { setAllDomains, setPrimaryDomain } from 'app/slices/domainSlice'

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
  const domainsRef = useRef(domains)
  const newPrimaryName = useRef()
  const primaryDomain = useSelector((state) => state.domain.primaryDomain)
  const dispatch = useDispatch()
  const [avatar, setAvatar] = useState(DefaultAvatar)

  const { actions, state } = useEditable()

  const { startPending, setConfirmed } = actions
  const { pending, txHash, confirmed } = state
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

  const [setName, { loading: setNameLoading }] = useMutation(SET_NAME, {
    onCompleted: (data) => {
      if (Object.values(data)[0]) {
        startPending(Object.values(data)[0])
        setIsShowChangePrimaryModal(false)
      }
    },
  })

  const changePrimaryDomain = (param) => {
    newPrimaryName.current = param.value
    setName({ variables: { name: param.value } })
  }

  useEffect(() => {
    domainsRef.current = domains
  }, [domains])
  useEffect(() => {
    if (primaryDomain?.name) {
      setAvatar(getDomainNftUrl(primaryDomain.name))
    } else {
      setAvatar(DefaultAvatar)
    }
  }, [primaryDomain])

  useEffect(() => {
    if (confirmed && !pending) {
      const newDomains = domainsRef.current.map((domain) => ({
        ...domain,
      }))
      dispatch(setAllDomains(newDomains))
      dispatch(setPrimaryDomain({ name: newPrimaryName.current }))
    }
  }, [pending, confirmed])

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
                src={avatar}
                onError={() => setAvatar(DefaultAvatar)}
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
                  setConfirmed()
                }}
                className="mt-1"
              />
            ) : (
              <div className="flex items-center mt-[5px] justify-between">
                {!primaryDomain ? (
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
                      {primaryDomain?.name + '.bnb'}
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
          loading={setNameLoading}
          show={isShowChangePrimaryModal}
          saveHandler={changePrimaryDomain}
          closeModal={() => setIsShowChangePrimaryModal(false)}
          domains={domains}
        />
      </div>
    </div>
  )
}
