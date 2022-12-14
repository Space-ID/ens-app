// Import packages
import React, { useState, useEffect, useRef } from 'react'
import cn from 'classnames'
import { useMutation } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'

// Import components
import ChangePrimaryDomain from 'components/Modal/ChangePrimaryDomain'
import PendingTx from 'components/PendingTx'

//Import graphql queries
import { GET_REVERSE_RECORD, QUERY_POINT_BALANCE } from 'graphql/queries'
import { SET_NAME } from 'graphql/mutations'

//Import custom functions
import { useQuery, gql } from '@apollo/client'
import { convertToETHAddressDisplayFormat } from 'utils/utils'
import { useEditable } from 'components/hooks'

//Import assets
import DefaultAvatar from 'assets/images/default-avatar.png'
import { setAllDomains, setPrimaryDomain } from 'app/slices/domainSlice'
import { setShowRedeem, setShowMint } from 'app/slices/giftCardSlice'
import { fetchDomainMetaData } from 'api'

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

  const { data: { getPointBalance = 0 } = {} } = useQuery(QUERY_POINT_BALANCE, {
    variables: { account: accounts?.[0] },
    skip: !accounts?.length,
  })

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
      fetchDomainMetaData(primaryDomain.name).then((res) => {
        setAvatar(res?.image)
      })
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
        'grid gap-4 2xl:min-w-[320px] account-profile-bg rounded-2xl p-4',
        className
      )}
    >
      <div className="flex items-center">
        {account ? (
          <div className="mr-[14px] flex-none w-[64px] h-[64px]">
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
                      className="btn btn-primary text-sm font-semibold rounded-xl py-2 px-8"
                      onClick={() => {
                        setIsShowChangePrimaryModal(true)
                      }}
                    >
                      Set Your Primary Name
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
            account={account}
            networkId={networkId}
            closeModal={() => setIsShowChangePrimaryModal(false)}
          />
        </div>
      </div>
      {/*gift card*/}
      {!isReadOnly && account && (
        <div className="grid gap-2 bg-fill-2 rounded-2xl px-3 py-4">
          <div className="flex justify-between">
            <div className="text-base font-bold text-white">
              SID Point
              <br />
              <span
                className="text-xs font-semibold text-green-100 cursor-pointer hover:opacity-80"
                onClick={() => dispatch(setShowMint(true))}
              >
                Mint Gift Card ↗
              </span>
            </div>
            <p className="text-center text-white text-right text-xs font-semibold">
              <span className="text-xl font-bold">{getPointBalance}</span>
              <br />
              Point balance
            </p>
          </div>
          <button
            className="btn-secondary text-xs font-semibold w-full h-7 rounded-xl normal-case"
            onClick={() => dispatch(setShowRedeem(true))}
          >
            My Gift Card
          </button>
        </div>
      )}
    </div>
  )
}
