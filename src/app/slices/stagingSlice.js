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
      state.startTime = payload.startTime
      state.totalQuota = payload.totalQuota
    },
    setStagingQuota: (state, { payload }) => {
      state.usedQuota = payload.usedQuota
      state.individualQuotaUsed = payload.individualQuotaUsed
      state.individualQuota = payload.individualQuota
    },
  },
})

export const { setStagingInfo, setStagingQuota } = stagingSlice.actions

export default stagingSlice.reducer
