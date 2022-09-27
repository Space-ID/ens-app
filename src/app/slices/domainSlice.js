import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDomainList } from 'api/index'
const initialState = {
  selectedDomain: null,
  searchingDomainName: '',
  domains: [],
  primaryDomain: undefined,
}

export const getDomainList = createAsyncThunk(
  'domain/getDomainList',
  async ({ account, networkId }) => {
    return fetchDomainList(account, networkId)
  }
)

export const domainSlice = createSlice({
  name: 'domainDetail',
  initialState,
  reducers: {
    setSelectedDomain: (state, { payload }) => {
      state.selectedDomain = payload
    },
    setSearchDomainName: (state, { payload }) => {
      state.searchingDomainName = payload
    },
    setAllDomains: (state, { payload }) => {
      state.domains = payload
      state.primaryDomain = payload.find((v) => v.isPrimary)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDomainList.fulfilled, (state, action) => {
      const data = action.payload ?? []
      if (state.selectedDomain) {
        const name = state.selectedDomain.name
        const temp = data.find((v) => v.name === name)
        if (temp) {
          state.selectedDomain = temp
        }
      } else {
        state.selectedDomain = data[0]
      }
      state.domains = data
      state.primaryDomain = data.find((v) => v.isPrimary)
    })
  },
})

// Action creators are generated for each case reducer function
export const { setSelectedDomain, setSearchDomainName, setAllDomains } =
  domainSlice.actions

export default domainSlice.reducer
