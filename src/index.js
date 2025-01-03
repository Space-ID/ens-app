import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'

import App from 'App'

import { setupAnalytics } from 'utils/analytics'
import Loader from './components/Loader'

import './index.css'
import 'globalStyles'
// ga4
setupAnalytics()
window.addEventListener('load', async () => {
  ReactDOM.render(
    <Suspense fallback={<Loader fullScreenLoading />}>
      <App />
    </Suspense>,
    document.getElementById('root')
  )
})
