//Import packages
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useMutation } from '@apollo/client'

//Import components
import AddressList from './AddressList'
import MainBoard from './MainBoard'
import AnimationSpin from 'components/AnimationSpin'
import EditButton from '../../../../components/Button/EditButton'
import TopAddress from './TopAddress'
import TransferAddressModal from 'components/Modal/TransferAddressModal'
import ExtendPeriodModal from 'components/Modal/ExtendPeriodModal'

//Import sdk objects
import getENS, { getRegistrar } from 'apollo/mutations/ens'

//Import Reducer
import { toggleEditMode } from 'app/slices/accountSlice'

//Import graphql quires
import { SET_REGISTRANT, SET_RESOLVER } from 'graphql/mutations'

//Import custom hooks
import { useEditable } from 'components/hooks'
export default function Mainbar({
  sid,
  selectedDomain,
  isAccountConnected,
  account
}) {
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [loadingRegistration, setLoadingRegistration] = useState(true)
  const [registrantAddress, setRegistrantAddress] = useState('')
  const [resolverAddress, setResolverAddress] = useState('')
  const [loadingResolverAddress, setLoadingResolverAddress] = useState(true)
  const [transferShowModal, setTransferShowModal] = useState(false)
  const [extendPeriodShowModal, setExtendPeriodShowModal] = useState(false)
  const [mutationQuery, setMutationQuery] = useState(null)
  const [isRegsitrant, setIsRegsitrant] = useState(false)

  const { state, actions } = useEditable()
  const { editing, txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions

  const [mutation] = useMutation(mutationQuery ?? SET_REGISTRANT, {
    onCompleted: data => {
      const txHash = Object.values(data)[0]
      startPending(txHash)
    }
  })

  const fetchRegistrantAddress = async () => {
    const t_address = await refetchRegistrantAddress()
    setRegistrantAddress(t_address)
    if (t_address === account) setIsRegsitrant(true)
    setLoadingRegistration(false)
  }

  const refetchRegistrantAddress = async () => {
    const registrar = getRegistrar()
    const entry = await registrar.getEntry(selectedDomain.name)
    return entry.registrant
  }

  const refetchResolverAddress = async () => {
    const nameUI = sid.name(`${selectedDomain.name}.bnb`)
    const resolver = await nameUI.getResolver()
    return resolver
  }

  const fetchResolverAddress = async () => {
    try {
      const t_address = await refetchResolverAddress()
      setResolverAddress(t_address)
      setLoadingResolverAddress(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (sid && selectedDomain) {
      setLoading(false)
      setLoadingRegistration(true)
      setLoadingResolverAddress(true)
      fetchRegistrantAddress()
      fetchResolverAddress()
    }
  }, [sid, selectedDomain])

  const transferAddress = values => {
    setTransferShowModal(false)
    if (title === 'Registrant') {
      const variables = {
        address: values.address,
        name: selectedDomain.name + '.bnb'
      }
      console.log(variables)
      setMutationQuery(SET_REGISTRANT)
      mutation({
        variables
      })
    } else {
      setMutationQuery(SET_RESOLVER)

      var variables = {
        address: values.address,
        name: selectedDomain.name + '.bnb'
      }
      mutation({ variables })
    }
  }

  if (loading) {
    return (
      <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-5 relative min-w-[840px] flex justify-center items-center">
        <AnimationSpin size={60} />
      </div>
    )
  }

  return (
    <div className="bg-[rgba(72,143,139,0.25)] rounded-[24px] backdrop-blur-sm p-[40px] relative">
      {/* <AddressList
        className="mt-[14px]"
        sid={sid}
        selectedDomain={selectedDomain}
        canEdit={editOn}
        account={account}
      /> */}
      {selectedDomain && (
        <TopAddress
          className="pb-8 border-b border-[rgba(204,252,255,0.2)]"
          selectedDomain={selectedDomain}
          registrantAddress={registrantAddress}
          loadingRegistration={loadingRegistration}
          transferRegistrantAddress={() => {
            setTitle('Registrant')
            setTransferShowModal(true)
          }}
          pending={
            editing ? null : pending && !confirmed && title === 'Registrant'
          }
          setConfirmed={setConfirmed}
          refetchAddress={refetchRegistrantAddress}
          fetchAddress={fetchRegistrantAddress}
          txHash={txHash}
          address={registrantAddress}
          extendHandler={() => {
            setExtendPeriodShowModal(true)
          }}
        />
      )}

      {selectedDomain && (
        <MainBoard
          selectedDomain={{ ...selectedDomain }}
          className="mt-8"
          resolverAddress={resolverAddress}
          loadingResolverAddress={loadingResolverAddress}
          setResolver={() => {
            setTitle('Resolver')
            setTransferShowModal(true)
          }}
          pending={
            editing ? null : pending && !confirmed && title === 'Resolver'
          }
          setConfirmed={setConfirmed}
          refetchAddress={refetchResolverAddress}
          fetchAddress={fetchResolverAddress}
          txHash={txHash}
          address={resolverAddress}
        />
      )}
      <TransferAddressModal
        title={title}
        show={transferShowModal}
        saveHandler={transferAddress}
        account={account}
        closeModal={() => setTransferShowModal(false)}
        address={title === 'Registrant' ? registrantAddress : resolverAddress}
      />
      <ExtendPeriodModal
        show={extendPeriodShowModal}
        selectedDomain={selectedDomain}
        duration={duration}
      />
    </div>
  )
}
