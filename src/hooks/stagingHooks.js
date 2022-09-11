import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import { GET_STAGING_INFO, GET_STAGING_QUOTA } from '../graphql/queries'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmptyAddress } from '../utils/records'
import { isENSReadyReactive } from '../apollo/reactiveVars'
import { setStagingInfo, setStagingQuota } from 'app/slices/stagingSlice'

export const useGetStagingInfo = () => {
  const dispatch = useDispatch()
  const ready = useReactiveVar(isENSReadyReactive)
  const [getStagingInfo, { data: stagingInfo }] = useLazyQuery(
    GET_STAGING_INFO,
    {
      fetchPolicy: 'no-cache',
    }
  )
  useEffect(() => {
    if (ready) {
      getStagingInfo()
    }
  }, [ready])
  useEffect(() => {
    if (stagingInfo) {
      dispatch(setStagingInfo(stagingInfo.getStagingInfo))
    }
  }, [stagingInfo])
}

export const useGetStagingQuota = (account) => {
  const dispatch = useDispatch()
  const ready = useReactiveVar(isENSReadyReactive)
  const [fetchStagingQuota, { data }] = useLazyQuery(GET_STAGING_QUOTA, {
    variables: { account },
    fetchPolicy: 'no-cache',
  })
  useEffect(() => {
    if (ready && !isEmptyAddress(account)) {
      fetchStagingQuota({ variables: { account } })
    }
  }, [account, ready])
  useEffect(() => {
    if (data) {
      dispatch(setStagingQuota(data.getStagingQuota))
    }
  }, [data])

  return fetchStagingQuota
}

export const useStagingInfo = () => {
  const startTime = useSelector((state) => state.staging.startTime)
  const totalQuota = useSelector((state) => state.staging.totalQuota)
  const usedQuota = useSelector((state) => state.staging.usedQuota)
  const individualQuota = useSelector((state) => state.staging.individualQuota)
  const individualQuotaUsed = useSelector(
    (state) => state.staging.individualQuotaUsed
  )
  const verify = useSelector((state) => state.staging.verify)
  const isStart = Date.now() > startTime
  const isUsedUp =
    usedQuota >= totalQuota || individualQuotaUsed >= individualQuota
  const disableRegister = !verify || isUsedUp || !isStart
  return {
    verify,
    disableRegister,
    isStart,
    usedQuota,
    totalQuota,
    individualQuota,
    individualQuotaUsed,
  }
}
