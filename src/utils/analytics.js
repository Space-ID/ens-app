import ReactGA from 'react-ga4'

const TrackingID = {
  live: 'G-T851Y5QX1V',
  dev: 'G-Y8W54ERLDR',
}

function isProduction() {
  return process.env.REACT_APP_MODE === 'production'
}

function isDev() {
  return process.env.REACT_APP_MODE !== 'production'
}

export function setUtm() {
  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get('utm_source')
  if (utmSource) {
    window.sessionStorage.setItem('utmSource', utmSource)
  }
}

export function getUtm() {
  return window.sessionStorage.getItem('utmSource')
}

export const setupAnalytics = () => {
  if (isProduction()) {
    ReactGA.initialize(TrackingID.live)
    // ReactGA.plugin.require('ecommerce')
  } else {
    ReactGA.initialize(TrackingID.dev)
    // ReactGA.plugin.require('ecommerce', { debug: true })
    console.log('Analytics setup for dev with ', TrackingID.dev)
  }
  // ReactGA.pageview(window.location.pathname + window.location.search)
  ReactGA.send({
    hitType: 'pageview',
    page: window.location.pathname + window.location.search,
  })
  setUtm()
}
