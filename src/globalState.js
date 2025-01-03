import React, { createContext, Component } from 'react'

const filters = {
  searchDomains: ['top', 'sub'],
  unavailableNames: true,
  price: 'all',
}

const GlobalState = createContext({
  filters,
})

export default GlobalState
