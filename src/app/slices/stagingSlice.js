import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  startTime: Number.MAX_VALUE,
  totalQuota: 0,
  individualQuota: 0,
  usedQuota: 0,
  individualQuotaUsed: 0,
  verify: false,
}

export const stagingSlice = createSlice({
  name: 'staging',
  initialState,
  reducers: {
    setStagingInfo: (state, { payload }) => {
      state.startTime = payload.startTime
      state.totalQuota = payload.totalQuota
      state.individualQuota = payload.individualQuota
    },
    setStagingQuota: (state, { payload }) => {
      state.usedQuota = payload.usedQuota
      state.individualQuotaUsed = payload.individualQuotaUsed
    },
    setVerify: (state, { payload }) => {
      state.verify = payload
    },
  },
})

export const { setStagingInfo, setStagingQuota, setVerify } =
  stagingSlice.actions

export default stagingSlice.reducer
