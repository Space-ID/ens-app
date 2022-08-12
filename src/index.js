import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/client'
import { store } from 'app/store'
import { Provider } from 'react-redux'

import App from 'App'
import 'globalStyles'
import './index.css'
import setup from './setup'
import { clientReactive, networkIdReactive } from './apollo/reactiveVars'
import { setupClient } from './apollo/apolloClient'
import Loader from './components/Loader'

setup(false)
window.addEventListener('load', async () => {
  const client = clientReactive(setupClient(networkIdReactive()))
  ReactDOM.render(
    <Provider store={store}>
      <Suspense fallback={<Loader fullScreenLoading />}>
        <ApolloProvider {...{ client }}>
          <App />
        </ApolloProvider>
      </Suspense>
    </Provider>,
    document.getElementById('root')
  )
})
