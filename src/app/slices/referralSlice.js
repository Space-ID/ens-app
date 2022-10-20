import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  inviter: undefined,
}

export const referralSlice = createSlice({
  name: 'referral',
  initialState,
  reducers: {
    setInviter: (state, { payload }) => {
      state.inviter = payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setInviter } = referralSlice.actions

export default referralSlice.reducer
