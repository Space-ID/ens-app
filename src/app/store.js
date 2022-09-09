import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slices/accountSlice'
import errorSlice from './slices/errorSlice'
import uiSlice from './slices/uiSlice'
import domainSlice from './slices/domainSlice'
import registerSlice from './slices/registerSlice'
import stagingSlice from './slices/stagingSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    error: errorSlice,
    ui: uiSlice,
    domain: domainSlice,
    register: registerSlice,
    staging: stagingSlice,
  },
  devTools: process.env.NODE_ENV !== 'production',
})
