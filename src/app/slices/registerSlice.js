import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  registering: false,
  requesting: false,
}

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    startRegistering: (state, { payload }) => {
      console.log('2222222222')
      state.registering = true
    },
    errorRegistering: (state, { payload }) => {
      state.registering = false
    },
    successRegistering: (state, { payload }) => {
      state.registering = false
    },
    startRequesting: (state, { payload }) => {
      state.requesting = true
    },
    errorRequesting: (state, { payload }) => {
      state.requesting = false
    },
    successRequesting: (state, { payload }) => {
      state.requesting = false
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  startRegistering,
  errorRegistering,
  successRegistering,
  startRequesting,
  errorRequesting,
  successRequesting,
} = registerSlice.actions

export default registerSlice.reducer
