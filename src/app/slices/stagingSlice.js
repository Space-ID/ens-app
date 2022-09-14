import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  startTime: Number.MAX_VALUE,
  totalQuota: 0,
  individualQuota: 0,
  usedQuota: 0,
  individualQuotaUsed: 0,
}

export const stagingSlice = createSlice({
  name: 'staging',
  initialState,
  reducers: {
    setStagingInfo: (state, { payload }) => {
      state.startTime = payload?.startTime ?? Number.MAX_VALUE
      state.totalQuota = payload?.totalQuota ?? 0
    },
    setStagingQuota: (state, { payload }) => {
      state.usedQuota = payload?.usedQuota ?? 0
      state.individualQuotaUsed = payload?.individualQuotaUsed ?? 0
      state.individualQuota = payload?.individualQuota ?? 0
    },
  },
})

export const { setStagingInfo, setStagingQuota } = stagingSlice.actions

export default stagingSlice.reducer
