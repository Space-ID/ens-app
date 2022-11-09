//Import packages
import React, { useState, useEffect } from 'react'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

//Import components
import MainBoard from './MainBoard'
import AnimationSpin from 'components/AnimationSpin'
import TopAddress from './TopAddress'
import TransferAddressModal from 'components/Modal/TransferAddressModal'
import ExtendPeriodModal from 'components/Modal/ExtendPeriodModal'
import AddressChangeModal from 'components/Modal/AddressChangeModal'

//Import sdk objects
import { getRegistrar } from 'apollo/mutations/ens'

//Import graphql quires
import {
  SET_REGISTRANT,
  SET_RESOLVER,
  RENEW,
  ADD_MULTI_RECORDS,
} from 'graphql/mutations'
import {
  GET_ETH_PRICE,
  GET_RENT_PRICE,
  GET_PRICE_CURVE,
  GET_RENT_PRICE_WITH_POINT,
  QUERY_POINT_BALANCE,
} from 'graphql/queries'

//Import custom hooks
import { useEditable } from 'components/hooks'
import { useInterval, useGasPrice, useBlock } from 'components/hooks'

// Import custom functions
import { calculateDuration } from 'utils/dates'
import PremiumPriceOracle from 'components/SingleName/NameRegister/PremiumPriceOracle'

//Import Redux
import { getDomainList } from 'app/slices/domainSlice'

export default function Mainbar({
  sid,
  selectedDomain,
  account,
  isReadOnly,
  networkId,
}) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingRegistration, setLoadingRegistration] = useState(true)
  const [registrantAddress, setRegistrantAddress] = useState('')
  const [resolverAddress, setResolverAddress] = useState('')
  const [loadingResolverAddress, setLoadingResolverAddress] = useState(true)
  const [transferShowModal, setTransferShowModal] = useState(false)
  const [extendPeriodShowModal, setExtendPeriodShowModal] = useState(false)
  const [showAddressChangeModal, setShowAddressChangeModal] = useState(false)
  const [mutationQuery, setMutationQuery] = useState(null)
  const [isRegsitrant, setIsRegsitrant] = useState(false)
  const [updatedRecords, setUpdatedRecords] = useState(false)
  const [updatingBNBAddress, setUpdatingBNBAddress] = useState('')
  const [param, setParam] = useState('')

  const dispatch = useDispatch()

  const [years, setYears] = useState(1)

  let now, currentPremium, underPremium

  const duration = calculateDuration(years)

  const expirationDate = new Date(
    new Date(registrantAddress).getTime() + duration * 1000
  )

  const { state, actions } = useEditable()
  const { editing, txHash, pending, confirmed } = state
  const { startPending, setConfirmed } = actions
  const { block } = useBlock()

  const [mutation] = useMutation(mutationQuery ?? SET_REGISTRANT, {
    onCompleted: (data) => {
      const txHash = Object.values(data)[0]
      startPending(txHash)
    },
  })

  const [mutationReNew] = useMutation(RENEW, {
    onCompleted: (data) => {
      const txHash = Object.values(data)[0]
      startPending(txHash)
      setExtendPeriodShowModal(false)
    },
  })

  const [addMultiRecords] = useMutation(ADD_MULTI_RECORDS, {
    onCompleted: (data) => {
      startPending(Object.values(data)[0])
      setUpdatingBNBAddress(param)
    },
  })

  const {
    data: { getRentPrice: getPremiumPrice } = {},
    loading: getPremiumPriceLoading,
  } = useQuery(GET_RENT_PRICE, {
    variables: {
      duration: 0,
      label: selectedDomain?.name,
      commitmentTimerRunning: false,
    },
  })

  const [
    loadEthUSDPriceData,
    { loading: ethUsdPriceLoading, data: ethUsdPriceData = {} },
  ] = useLazyQuery(GET_ETH_PRICE)

  const { data: { getPriceCurve } = {} } = useQuery(GET_PRICE_CURVE)

  let ethUsdPrice = ethUsdPriceData?.getEthPrice ?? 0

  const { data: { getRentPrice } = {}, loading: rentPriceLoading } = useQuery(
    GET_RENT_PRICE,
    {
      variables: {
        duration,
        label: selectedDomain?.name,
      },
      fetchPolicy: 'no-cache',
    }
  )
  // rent price with point
  const {
    data: { getRentPriceWithPoint } = {},
    loading: rentPriceWithPointLoading,
    refetch: refetchRentPriceWithPoint,
  } = useQuery(GET_RENT_PRICE_WITH_POINT, {
    variables: {
      duration,
      label: selectedDomain?.name,
      account,
    },
    fetchPolicy: 'no-cache',
  })
  const { loading: gasPriceLoading, price: gasPrice } = useGasPrice(
    true,
    isReadOnly
  )

  const expiryDate = moment(selectedDomain?.expires)

  const oracle = new PremiumPriceOracle(expiryDate, getPriceCurve)
  const { releasedDate, zeroPremiumDate } = oracle

  if (block) {
    now = moment(block.timestamp * 1000)
  }

  if (block) {
    currentPremium = oracle.getTargetAmountByDaysPast(oracle.getDaysPast(now))
    underPremium = now.isBetween(releasedDate, zeroPremiumDate)
  }

  const fetchRegistrantAddress = async () => {
    const t_address = await refetchRegistrantAddress()
    setRegistrantAddress(t_address)
    if (t_address === account) setIsRegsitrant(true)
    setLoadingRegistration(false)
  }

  useEffect(() => {
    let timer
    if (!pending) {
      dispatch(getDomainList({ account, networkId }))
      let count = 0
      timer = window.setInterval(() => {
        if (count <= 2) {
          count++
          dispatch(getDomainList({ account, networkId }))
        } else {
          window.clearInterval(timer)
        }
      }, 1000 * 10)
    }
    return () => window.clearInterval(timer)
  }, [pending, confirmed, account, networkId])

  useEffect(() => {}, [account, networkId])

  useEffect(() => {
    setIsRegsitrant(registrantAddress === account)
  }, [registrantAddress, account])

  useEffect(() => {
    loadEthUSDPriceData()
  }, [isReadOnly])

  const refetchRent = () => {
    refetchRentPriceWithPoint()
  }

  const refetchRegistrantAddress = async () => {
    try {
      const ownerAddr = await sid.name(`${selectedDomain.name}.bnb`).getOwner()
      return ownerAddr
    } catch (err) {
      console.log('debug: error: refetchRegistrantAddress', err)
    }
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
      setResolverAddress('')
      setLoadingResolverAddress(false)
      console.error(err)
    }
  }

  useEffect(() => {
    if (sid) {
      setLoading(false)
      setLoadingRegistration(true)
      setLoadingResolverAddress(true)
      fetchRegistrantAddress()
      fetchResolverAddress()
    }
  }, [sid, selectedDomain])

  const transferAddress = (values) => {
    setTransferShowModal(false)
    if (title === 'Registrant') {
      const variables = {
        address: values.address,
        name: selectedDomain.name + '.bnb',
      }
      setMutationQuery(SET_REGISTRANT)
      mutation({
        variables,
      })
    } else {
      setMutationQuery(SET_RESOLVER)

      var variables = {
        address: values.address,
        name: selectedDomain.name + '.bnb',
      }
      mutation({ variables })
    }
  }

  const extendExpiryDate = (usePoint = false) => {
    const variables = {
      duration,
      label: selectedDomain.name,
      usePoint,
    }
    mutationReNew({ variables })
  }

  const changeBNBAddress = (param) => {
    setShowAddressChangeModal(false)
    setTitle('BNBAddress')
    const variables = [{ ...updatedRecords, value: param.address, key: 'ETH' }]
    setParam(param.address)
    addMultiRecords({
      variables: { name: selectedDomain.name + '.bnb', records: variables },
    })
  }

  if (loading) {
    return (
      <div className="p-5 relative min-w-[840px] flex justify-center items-center">
        <AnimationSpin size={60} />
      </div>
    )
  }

  return (
    <div className="bg-fill-2 rounded-[24px] backdrop-blur-sm sm:p-10 p-6 relative sm:mx-16 mx-7 1.5xl:mx-0 w-auto 1.5xl:max-w-[1016px] flex-grow">
      {selectedDomain && (
        <TopAddress
          isRegsitrant={isRegsitrant}
          selectedDomain={selectedDomain}
          registrantAddress={registrantAddress}
          loadingRegistration={loadingRegistration}
          transferRegistrantAddress={() => {
            setTitle('Registrant')
            setTransferShowModal(true)
          }}
          pending={pending && title === 'Registrant'}
          setConfirmed={setConfirmed}
          refetchAddress={refetchRegistrantAddress}
          fetchAddress={fetchRegistrantAddress}
          txHash={txHash}
          address={registrantAddress}
          extendHandler={() => {
            setTitle('ExpirationDate')
            setExtendPeriodShowModal(true)
          }}
          pendingExp={pending && title === 'ExpirationDate'}
          expDate={selectedDomain.expires}
        />
      )}

      {selectedDomain && (
        <MainBoard
          registrantAddress={registrantAddress}
          isRegsitrant={isRegsitrant}
          selectedDomain={{ ...selectedDomain }}
          className="mt-8"
          resolverAddress={resolverAddress}
          loadingResolverAddress={loadingResolverAddress}
          setResolver={() => {
            setTitle('Resolver')
            setTransferShowModal(true)
          }}
          setResolverAddress={setResolverAddress}
          pending={pending && title === 'Resolver'}
          setConfirmed={() => {
            setUpdatingBNBAddress('')
            setConfirmed()
          }}
          refetchAddress={refetchResolverAddress}
          fetchAddress={fetchResolverAddress}
          txHash={txHash}
          address={resolverAddress}
          showAddressChangeModalHandle={(param) => {
            setUpdatedRecords(param)
            setShowAddressChangeModal(true)
          }}
          pendingBNBAddress={pending && title === 'BNBAddress'}
          updatingBNBAddress={updatingBNBAddress}
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
        open={extendPeriodShowModal}
        onOpenChange={(v) => setExtendPeriodShowModal(v)}
        duration={duration}
        years={years}
        setYears={(years) => {
          setYears(years)
        }}
        ethUsdPriceLoading={ethUsdPriceLoading}
        ethUsdPrice={ethUsdPrice}
        price={getRentPrice}
        priceWithPoint={getRentPriceWithPoint}
        rentPriceLoading={rentPriceLoading}
        gasPrice={gasPrice}
        ethUsdPremiumPrice={currentPremium}
        premiumOnlyPrice={getPremiumPrice}
        extendHandler={extendExpiryDate}
        refetchRent={refetchRent}
      />
      <AddressChangeModal
        defaultValue={updatedRecords.value}
        show={showAddressChangeModal}
        closeModal={() => setShowAddressChangeModal(false)}
        saveHandler={changeBNBAddress}
      />
    </div>
  )
}
