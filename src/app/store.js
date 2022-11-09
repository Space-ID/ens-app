import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slices/accountSlice'
import errorSlice from './slices/errorSlice'
import uiSlice from './slices/uiSlice'
import domainSlice from './slices/domainSlice'
import registerSlice from './slices/registerSlice'
import giftCardSlice from './slices/giftCardSlice'
import referralSlice from './slices/referralSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    error: errorSlice,
    ui: uiSlice,
    domain: domainSlice,
    register: registerSlice,
    giftCard: giftCardSlice,
    referral: referralSlice,
  },
  devTools: process.env.NODE_ENV === 'stg',
})
