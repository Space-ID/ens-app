import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showRedeem: false,
  showMint: false,
}

export const giftCardSlice = createSlice({
  name: 'giftCard',
  initialState,
  reducers: {
    setShowRedeem: (state, { payload }) => {
      state.showRedeem = payload
    },
    setShowMint: (state, { payload }) => {
      state.showMint = payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setShowRedeem, setShowMint } = giftCardSlice.actions

export default giftCardSlice.reducer
