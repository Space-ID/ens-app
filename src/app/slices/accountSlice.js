import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accounts: [],
  isReadOnly: false,
  isSafeApp: false,
  network: '',
  displayName: ''
}

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    getAccounts: (state, { payload }) => {
      console.log('payload', payload)
      state.accounts = payload
    },
    getHomeData: (state, { payload }) => {
      state.isReadOnly = payload.isReadOnly
      state.isSafeApp = payload.isSafeApp
      state.network = payload.network
      state.displayName = payload.displayName
    }
  }
})

// Action creators are generated for each case reducer function
export const { getAccounts, getHomeData } = accountsSlice.actions

export default accountsSlice.reducer